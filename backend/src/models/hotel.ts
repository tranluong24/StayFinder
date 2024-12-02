import mongoose from "mongoose";

export type HotelType = { // mô tả cấu trúc của đối tượng khách sạn
    _id: string;
    userId: string;
    name: string;
    city: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number,
    starRating: number;
    imageUrls: string[],
    lastUpdated: Date;
}

const hotelSchema = new mongoose.Schema<HotelType>({
    userId:{ type: String, requied: true },
    name: {type: String, required: true},
    city: { type: String, requied: true },
    description:{ type: String, requied: true },
    adultCount:{ type: Number, requied: true },
    childCount:{ type: Number, requied: true },
    facilities: [{ type: String,  requied: true }],
    pricePerNight:{ type: Number, requied: true },
    starRating: {type: Number, required: true, min:1, max:5},
    imageUrls:[{type: String, required: true}],
    lastUpdated: {type: Date, required: true},
})

const Hotel = mongoose.model<HotelType> ("Hotel", hotelSchema)
export default Hotel
