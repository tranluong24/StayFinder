import {Link} from "react-router-dom";

const Header = ()=>{
    return (
        //<!-- Nền xanh đậm với khoảng đệm dọc 6 đơn vị -->
        <div className ="bg-blue-800 py-6">
            {/* // Tạo div chứa, lề tự động ( margin-mx), sử dụng Flexbox để căn chỉnh phần tử con. */}
            <div className = "container mx-auto flex justify-between">
                {/* span la inline element-k tao ra dong moi */}
                <span className = "text-3xl text-white font-bold tracking-tight">
                    <Link to="/">StayFinder</Link>
                </span>
                {/* Them kc ngang giua cac ptu con ben trong 2~0.5rem, 8px */}
                <span className="flex space-x-2">
                    <Link 
                        to="/sign-in" 
                        className ="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-300 rounded"
                        >
                        Sign in
                        </Link>
                </span>
            </div>
        </div>
    )
};

export default Header;