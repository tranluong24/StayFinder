import mongoose from "mongoose";
import { BookingType, HotelType } from "../shared/types";

const bookingSchema = new mongoose.Schema<BookingType>({
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    email: {type: String, require: true},
    adultCount: {type: Number, require: true},
    childCount: {type: Number, require: true},
    checkIn: {type: Date, require: true},
    checkOut: {type: Date, require: true},
    userId: {type: String, required: true},
    totalCost: {type: Number, required: true},
})

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
    bookings: [bookingSchema]
})

const Hotel = mongoose.model<HotelType> ("Hotel", hotelSchema)
export default Hotel
