import express, { Request, Response } from 'express';
import Hotel from '../models/hotel';
import { HotelSearchResponse } from '../shared/types';

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