import mongoose from "mongoose";
import { HotelType } from "../shared/types";

const hotelSchema = new mongoose.Schema<HotelType>({
    userId:{ type: String, requied: true },
    name: {type: String, required: true},
    city: { type: String, requied: true },
    country: { type: String, required: true },
    description:{ type: String, requied: true },
    type: { type: String, required: true },
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
