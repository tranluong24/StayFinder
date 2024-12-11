import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { MdHelpOutline, MdOutlineKeyboardArrowDown } from "react-icons/md";

const Header = () => {
  const { isLoggedIn, role, name } = useAppContext();

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">BookingWEB.com</Link>
        </span>
        <span className="flex space-x-2">

  {/* Icons */}
  <div className="flex items-center space-x-4">
    {/* VND Icon */}
    <div className="flex items-center gap-1 cursor-pointer">
      <span className="text-md font-bold text-white">VND</span>
      <MdOutlineKeyboardArrowDown size={20} className="text-gray-500" />
    </div>

    {/* Vietnam Flag */}
    <div className="flex items-center gap-1 cursor-pointer">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
        alt="Vietnam Flag"
        className="w-6 h-4 object-cover"
      />
      <MdOutlineKeyboardArrowDown size={20} className="text-gray-500" />
    </div>

    {/* Help Icon */}
    <div className="flex items-center gap-1 cursor-pointer">
      <MdHelpOutline size={25} className="text-white" />
    </div>   
    </div>

          {isLoggedIn ? (
            <>
              <span
                className="flex items-center text-white px-3 font-bold mr-8">
                Welcome {name} !
              </span>
              {role === 'user' && (
                <Link
                  className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                  to="/my-bookings">
                  Phòng đã đặt
                </Link>
                )
              } 
              {role === 'host' && (
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-hotels">
                Khách sạn của tôi
              </Link>)
              }
              {role === 'admin' && (
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/admin">
                  Admin
              </Link>)
              }
              <SignOutButton />
              
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100 rounded-lg border border-gray-300"
            >
              Đăng nhập
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
