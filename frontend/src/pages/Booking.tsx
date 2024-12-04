import { useQuery } from "react-query"
import * as apiClient from "../api-client"
import BookingForm from "../forms/BookingForm/BookingForm"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import BookingDetailsSummary from "../components/BookingDetailsSummary"
import { useSearchContext } from "../contexts/SearchContext"

const Booking = () => {
    const search = useSearchContext()
    const { hotelId } = useParams()

    const [numberOfNights, setNumberOfNights] = useState<number>(0)

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
                (1000 * 60 * 60 * 24)

            setNumberOfNights(Math.ceil(nights))
        }
    }, [search.checkIn, search.checkOut])

    const { data: hotel } = useQuery("fetchHotelByID", () =>
        apiClient.fetchMyHotelById(hotelId as string), {
        enabled: !!hotelId,
    }
    )

    const { data: currentUser } = useQuery(
        "fetchCurrentUser",
        apiClient.fetchCurrentUser
    )

    if(!hotel){
        return <></>
    }

    return <div className="grid md:grid-cols-[]">
        <BookingDetailsSummary
            checkIn={search.checkIn}
            checkOut={search.checkOut}
            adultCount={search.adultCount}
            childCount={search.childCount} 
            numberOfNights={numberOfNights}
            hotel={hotel}
        />
        {currentUser && <BookingForm currentUser={currentUser} />}
    </div>
}

export default Booking