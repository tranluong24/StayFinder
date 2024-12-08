import express, { Request, Response } from 'express';
import Hotel from '../models/hotel';
import { BookingType, HotelSearchResponse, PaymentIntentResponse } from '../shared/types';
import { param, validationResult } from 'express-validator';
import Stripe from "stripe"
import verifyToken from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

const router = express.Router()

router.get("/search", async (req: Request, res: Response) =>{
    try{
        const query = constructSearchQuery(req.query)

        let sortOptions = {}

        switch(req.query.sortOption){
            case "starRating":
                sortOptions = {starRating: -1}
                break;
            case "pricePerNightAsc":
                sortOptions = {pricePerNight: 1}
                break;
            case "pricePerNightDesc":
                sortOptions = {pricePerNight: -1}
                break;
            
        }

        const pageSize = 5 // so item trong 1 page
        const pageNumber = parseInt(req.query.page ? req.query.page.toString():"1")
        const skip = (pageNumber - 1)*pageSize

        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize)

        const total = await Hotel.countDocuments(query)

        const response: HotelSearchResponse = {
            data: hotels,
            pagination:{
                total,
                page: pageNumber,
                pages: Math.ceil(total/pageSize),
            }
        }

        res.json(response)
    }catch (err){
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

router.get("/", async (req: Request, res: Response) => {
    try {
      const hotels = await Hotel.find().sort("-lastUpdated");
      res.json(hotels);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Error fetching hotels" });
    }
  });

router.get("/:id", [param("id").notEmpty().withMessage("Hotel ID is required")],
    async(req: Request, res: Response) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({errors: errors.array()})
        }else{
            const id = req.params.id.toString();

            try{
                const hotel = await Hotel.findById(id);
                res.json(hotel)
            }catch(err){
                res.status(500).json({message: "Error fetching hotel"})
            }
        }
    }
)

router.post("/:hotelId/bookings/payment-intent", verifyToken, async(req: Request, res:Response) =>{
    //1. Tong tien thanh toan
    //2. hotelId
    //3. userId
    const {numberOfNights} = req.body
    const hotelId = req.params.hotelId
    const hotel = await Hotel.findById(hotelId)
    
    if(!hotel){
        res.status(400).json({message:"Hotel not found"})
    }else{
        const totalCost = hotel.pricePerNight * numberOfNights

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost * 100,
            currency: "gbp",//dvi tien te: 
            metadata:{
                hotelId,
                userId: req.userId,
            }
        })

        if(!paymentIntent.client_secret){
            res.status(500).json({message: "Error creating payment intent"})   
        }else{
            const response = {
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret.toString(),
                totalCost,
            }
            res.send(response)
        }
    }
})

router.post("/:hotelId/bookings", verifyToken, async(req: Request, res: Response)=>{

    try{
        const paymentIntentId = req.body.paymentIntentId

        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId as string
        )

        if(!paymentIntent){
            res.status(400).json({message: "payment intent not found"})
        }else{
            if(paymentIntent.metadata.hotelId !==req.params.hotelId ||
                paymentIntent.metadata.userId !== req.userId){
                    res.status(400).json({message: "Payment intent mismatch"})
            }else{
                if(paymentIntent.status !== "succeeded"){
                    res.status(400).json({message: `Payment intent not succeed. Status: ${paymentIntent.status}`})
                }else{
                    const newBooking: BookingType = {
                        ...req.body,
                        userId: req.userId,
                    }

                    const hotel =  await Hotel.findOneAndUpdate(
                        {_id: req.params.hotelId},
                        {$push: {bookings: newBooking},}
                    )

                    if(!hotel){
                        res.status(400).json({message: "Hotel not found"})
                    }else{
                        await hotel.save()
                        res.status(200).send();
                    }
                }
            }
            
        }
    }catch (err){
        res.status(500).json({message: "Something went wrong"})
    }
})

const constructSearchQuery = (queryParams: any) =>{
    let constructedQuery: any = {}

    if(queryParams.destination){
        //$or: tim kiem khi it nhat 1 dieu kien dung
        //RegExp: bieu thuc chinh quy ( k phan biet hoa thuong)
        constructedQuery.$or = [
            {city: new RegExp(queryParams.destination,"i")},
            {country: new RegExp(queryParams.destination, "i")},
        ];
    }

    if(queryParams.adultCount){
        constructedQuery.adultCount = {
            //$gte: bieu thuc lon hon or bang
            $gte: parseInt(queryParams.adultCount),
        }
    }

    if(queryParams.childCount){
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        }
    }


    if(queryParams.facilities){
        //$all: yeu cau tat ca gia tri trong mang phai xuat hien trong tai lieu
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities) ? queryParams.facilities:[queryParams.facilities],
        }
    }

    if(queryParams.types){
        constructedQuery.type = {
            //tim kiem xem co tai lieu nao co du lieu nam trong danh sach nay hay k ?
            $in: Array.isArray(queryParams.types) ? queryParams.types:[queryParams.types],
        }
    }

    if(queryParams.stars){
        const starRatings = Array.isArray(queryParams.stars) 
        ? queryParams.stars.map((star: string)=>parseInt(star))
        : parseInt(queryParams.stars)

        constructedQuery.starRating = {
            $in: starRatings
        }
    }

    if(queryParams.maxPrice){
        constructedQuery.pricePerNight = {
            //less than
            $lte: parseInt(queryParams.maxPrice).toString(),
        }
    }

    return constructedQuery;
}

export default router