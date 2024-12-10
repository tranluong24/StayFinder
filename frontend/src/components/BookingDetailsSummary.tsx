import { HotelType } from "../../../backend/src/shared/types"

type Props = {
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    numberOfNights: number,
    hotel: HotelType;
}

const BookingDetailsSummary = ({
    checkIn,
    checkOut,
    adultCount,
    childCount,
    numberOfNights,
    hotel
}: Props) => {
    return (
        <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
            <h2 className="text-xl font-bold">
                Chi tiết đặt phòng của bạn
            </h2>
            <div className="border-b py-2">
                Vị trí:
                <div className="font-bold">
                    {`${hotel.name}, ${hotel.country}, ${hotel.city}`}
                </div>
            </div>
            <div className="flex justify-between">
                <div>
                    Ngày đặt
                    <div className="font-bold">
                        {checkIn.toDateString()}
                    </div>
                </div>
                <div>
                    Ngày trả
                    <div className="font-bold">
                        {checkOut.toDateString()}
                    </div>
                </div>
            </div>
            <div className="border-t border-b py-2">
                Tổng thời gian đặt phòng:
                <div className="font-bold">
                    {numberOfNights} đêm
                </div>
            </div>

            <div>
                Khách{""}
                <div className="font-bold">
                    {adultCount} Người lớn & {childCount} Trẻ em
                </div>
            </div>
        </div>
    )
}

export default BookingDetailsSummary;