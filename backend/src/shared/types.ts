export type HotelType = { // mô tả cấu trúc của đối tượng khách sạn
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
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