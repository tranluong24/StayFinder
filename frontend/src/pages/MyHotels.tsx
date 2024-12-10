import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {},
    }
  );

  const {data} = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser)

  if (!hotelData) {
    return <span>Không tìm thấy khách sạn</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">Khách sạn của tôi</h1>
        {data?.status === 'done' && (
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded-lg border border-gray-300"
        >
          Thêm khách sạn
        </Link>
        )}
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div
            data-testid="hotel-card"
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center font-bold">
                <BsMap className="mr-1" />
                {hotel.country}, {hotel.city}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center font-bold">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center font-bold">
                <BiMoney className="mr-1" />{hotel.pricePerNight}VNĐ mỗi đêm
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center font-bold">
                <BiHotel className="mr-1" />
                {hotel.adultCount} người lớn, {hotel.childCount} trẻ em
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center font-bold">
                <BiStar className="mr-1" />
                {hotel.starRating} sao
              </div>
            </div>
            
            <div className="whitespace-pre-line">{hotel.description}</div>
            
            <span className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded-lg border border-gray-300"
              >
                Xem chi tiết
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
