import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar, AiOutlineEnvironment } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );
  const {data} = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser)

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-2xl font-bold">{hotel.name}</h1>
        <h6 className="italic flex items-center">
          {/* Biểu tượng địa chỉ */}
          <a 
            href="https://www.google.com/maps" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-500"
          >
            <AiOutlineEnvironment className="mr-1" />
          </a>
          {hotel.country}, {hotel.city}
        </h6>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image) => (
          <div className="h-[300px]">
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      <h6 className="font-bold text-xl">Tiện ích</h6>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
     
        {hotel.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>
      <h6 className="font-bold text-xl">Mô tả</h6>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
      
        <div className="whitespace-pre-line">{hotel.description}</div>
        {data?.role ==='user' &&(
        <div className="h-fit">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
        )} 
      </div>

    </div>
  );
};

export default Detail;
