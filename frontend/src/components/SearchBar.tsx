import { FormEvent, useState } from "react"
import { useSearchContext } from "../contexts/SearchContext"
import { MdCalendarToday, MdChildCare, MdPerson, MdTravelExplore } from "react-icons/md"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"

const SearchBar = () => {
    const navigate = useNavigate()
    const search = useSearchContext()

    const [destination, setDestination] = useState<string>(search.destination)
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn)
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut)
    const [adultCount, setAdultCount] = useState<number>(search.adultCount)
    const [childCount, setChildCount] = useState<number>(search.childCount)

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        search.saveSearchValues(
            destination, 
            checkIn, 
            checkOut, 
            adultCount, 
            childCount
        )
        navigate("/search")
    }

    const minDate = new Date()
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)

    return (
        <form onSubmit={handleSubmit} className="-mt-8 p-1 bg-orange-300 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-2">
            <div className="flex flex-row items-center flex-1 bg-white p-2 rounded-lg border border-gray-300">
              <MdTravelExplore size={25} className="mr-2" />
              <input
                placeholder="Bạn muốn đến đâu?"
                className="text-md w-full focus:outline-none"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
            </div>

            {/* Ô chọn số lượng người lớn và trẻ em */}
            <div className="flex w-full col-span-1 bg-white px-2 py-1  rounded-lg border border-gray-300">
              <label className="items-center flex w-4/7">
                <span className="text-sm font-bold w-2/3">Người lớn:</span>
                <input
                  className="w-1/3 p-1 focus:outline-none font-bold"
                  type="number"
                  min={1}
                  max={20}
                  value={adultCount}
                  onChange={(event) => setAdultCount(parseInt(event.target.value))}
                />
              </label>
              <label className="items-center flex w-3/7">
                <span className="text-sm font-bold w-3/5">Trẻ em:</span>
                <input
                  className="w-2/5 p-1 focus:outline-none font-bold"
                  type="number"
                  min={0}
                  max={20}
                  value={childCount}
                  onChange={(event) => setChildCount(parseInt(event.target.value))}
                />
              </label>
            </div>

            {/* Ô chọn ngày Check-in */}
            <div className="flex items-center bg-white p-2 rounded-lg border border-gray-300 w-full">
              <MdCalendarToday size={20} className="mr-2 text-gray-600" />
              <DatePicker
                selected={checkIn}
                onChange={(date) => setCheckIn(date as Date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={minDate}
                maxDate={maxDate}
                placeholderText="Ngày nhận phòng"
                className="w-full bg-white focus:outline-none font-bold"
              />
            </div>

            {/* Ô chọn ngày Check-out */}
            <div className="flex items-center bg-white p-2 rounded-lg border border-gray-300 w-full">
              <MdCalendarToday size={20} className="mr-2 text-gray-600" />
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date as Date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={minDate}
                maxDate={maxDate}
                placeholderText="Ngày trả phòng"
                className="w-full bg-white focus:outline-none font-bold"
              />
            </div>

            <div className="flex gap-1">
                <button className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-sky-600 rounded-lg border border-gray-300">
                    Tìm kiếm
                </button>
                <button className="w-1/3 bg-red-500 text-white h-full p-2 font-bold text-xl hover:bg-red-600 rounded-lg border border-gray-300">
                    Xóa
                </button>          
            </div>
        </form>
    )
}

export default SearchBar;