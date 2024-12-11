import React, { useState } from 'react';
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";

const HomePage: React.FC = () => {
  const [scrollIndexAccommodation, setScrollIndexAccommodation] = useState(0);
  const [scrollIndexVietnam, setScrollIndexVietnam] = useState(0);

  const accommodationCards = [
    { img: "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550862.jpeg?k=3514aa4abb76a6d19df104cb307b78b841ac0676967f24f4b860d289d55d3964&o=", title: "Khách sạn", details: "947 chỗ nghỉ còn trống" },
    { img: "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595548591.jpeg?k=01741bc3aef1a5233dd33794dda397083092c0215b153915f27ea489468e57a2&o=", title: "Căn hộ", details: "1235 chỗ nghỉ còn trống" },
    { img: "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595551044.jpeg?k=262826efe8e21a0868105c01bf7113ed94de28492ee370f4225f00d1de0c6c44&o=", title: "Resort", details: "3 chỗ nghỉ còn trống" },
    { img: "https://r-xx.bstatic.com/xdata/images/hotel/263x210/620168315.jpeg?k=300d8d8059c8c5426ea81f65a30a7f93af09d377d4d8570bda1bd1f0c8f0767f&o=", title: "Biệt thự", details: "41 chỗ nghỉ còn trống" },
    { img: "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550377.jpeg?k=ef93cbc1a3af0d6db84e27b6da280a4ef24dbcfeb065fcfeae4fe9c43dddd2da&o=", title: "Homestay", details: "80 chỗ nghỉ còn trống" },
    { img: "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595549020.jpeg?k=f5df2d3dc0000073bef517b0cab9593036f3f1aafa2421df31a6538a8c56b834&o=", title: "Nhà nghỉ B&B", details: "150 chỗ nghỉ còn trống" },
    { img: "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550415.jpeg?k=8967853a074040381dfa25a568e6c780e309b529e0c144995c5bbc9644721eca&o=", title: "Hostel", details: "200 chỗ nghỉ còn trống" },
    { img: "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595550229.jpeg?k=2ae1f5975fa1f846ac707d3334eb604a7e8f817f640cbd790185b2691532476b&o=", title: "Villa", details: "5 chỗ nghỉ còn trống" },
    { img: "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595550975.jpeg?k=6d2c22368ec017e1f99a4811c8abb1cb2d7fd829c9ddd12a82ff1aa77ab7da19&o=", title: "Motel", details: "50 chỗ nghỉ còn trống" },
  ];

  const vietnamCards = [
    { img: "https://q-xx.bstatic.com/xdata/images/city/170x136/981517.jpg?k=2268f51ad34ab94115ea9e42155bc593aa8d48ffaa6fc58432a8760467dc4ea6&o=", title: "Hà Nội", details: "3.817 chỗ nghỉ" },
    { img: "https://q-xx.bstatic.com/xdata/images/city/170x136/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=", title: "TP. Hồ Chí Minh", details: "5.608 chỗ nghỉ" },
    { img: "https://r-xx.bstatic.com/xdata/images/city/170x136/688844.jpg?k=02892d4252c5e4272ca29db5faf12104004f81d13ff9db724371de0c526e1e15&o=", title: "Đà Nẵng", details: "2.509 chỗ nghỉ" },
    { img: "https://r-xx.bstatic.com/xdata/images/city/170x136/688866.jpg?k=fc9d2cb9fe2f6d1160e10542cd2b83f5a8008401d33e8750ee3c2691cf4d4f7e&o=", title: "Hội An", details: "1.010 chỗ nghỉ" },
    { img: "https://r-xx.bstatic.com/xdata/images/city/170x136/688832.jpg?k=7140dc6addba8af46c916c36c854613ecdff0b66eddeaeccc317a9704e94d159&o=", title: "Nha Trang", details: "2.000 chỗ nghỉ" },
    { img: "https://q-xx.bstatic.com/xdata/images/region/170x136/60673.jpg?k=162c4d29b8336d7252f5c55654c05603d78b87eeb8c3240dcea703c3c4a8c3d3&o=", title: "Hạ Long", details: "1.500 chỗ nghỉ" },
    { img: "https://q-xx.bstatic.com/xdata/images/city/170x136/688898.jpg?k=cf02624b12e35e7e5c6e7b1323f3fd4ef10b8b0676b84ff91b27c8a77f1b5d33&o=", title: "Sapa", details: "700 chỗ nghỉ" },
    { img: "https://q-xx.bstatic.com/xdata/images/city/170x136/688879.jpg?k=82ca0089828054a1a9c46b14ea7f1625d73d42505ae58761e8bcc067f9e72475&o=", title: "Phú Quốc", details: "800 chỗ nghỉ" },
  ];

  const popularDestinations = [
    { img: "https://cf.bstatic.com/xdata/images/city/600x600/981517.jpg?k=2268f51ad34ab94115ea9e42155bc593aa8d48ffaa6fc58432a8760467dc4ea6&o=", title: "Hà Nội", isLarge: true },
    { img: "https://images2.thanhnien.vn/528068263637045248/2024/9/21/z5848006936932397d4167846a296bf73c09ee59acc4c9-172689049301882877001.jpg", title: "Hạ Long", isLarge: true },
    { img: "https://cf.bstatic.com/xdata/images/city/600x600/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=", title: "TP. Hồ Chí Minh", isLarge: false },
    { img: "https://cf.bstatic.com/xdata/images/city/600x600/688844.jpg?k=02892d4252c5e4272ca29db5faf12104004f81d13ff9db724371de0c526e1e15&o=", title: "Đà Nẵng", isLarge: false },
    { img: "https://cf.bstatic.com/xdata/images/city/600x600/640445.jpg?k=50b44df6e3029c95c1874da1ae9634d62ac2264961b917271d56d7637ccb059c&o=", title: "Ninh Bình", isLarge: false },
    { img: "https://cf.bstatic.com/xdata/images/city/600x600/688866.jpg?k=fc9d2cb9fe2f6d1160e10542cd2b83f5a8008401d33e8750ee3c2691cf4d4f7e&o=", title: "Hội An", isLarge: false },
  ];


  const scrollCards = (setScrollIndex: React.Dispatch<React.SetStateAction<number>>, maxIndex: number, direction: number) => {
    setScrollIndex((prev) => Math.min(Math.max(prev + direction, 0), maxIndex));
  };
  const { data: hotels } = useQuery("fetchQuery", () => apiClient.fetchHotels());

  return (
    <div className="bg-white p-5">
        <section className="mb-10 mt-2">
          <h2 className="text-2xl font-bold text-left mb-2 ml-4">Điểm đến đang thịnh hành</h2>
          <h6 className="ml-4">Du khách tìm kiếm về Việt Nam cũng đặt chỗ ở những nơi này</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className={`bg-white p-4 shadow-lg rounded-lg ${
                  destination.isLarge ? "col-span-2" : "col-span-1"
                }`}
              >
                <img
                  src={destination.img}
                  alt={destination.title}
                  className={`${destination.isLarge ? "h-64" : "h-48"} w-full object-cover mb-4`}
                />
                <div className="flex items-center">
                  <h3 className="text-xl font-medium mr-2">{destination.title}</h3>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/32px-Flag_of_Vietnam.svg.png"
                    alt="Vietnam Flag"
                    className="w-5 h-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>


      {/* Section 1: Find by type of accommodation */}
      <section className="mb-10 mt-6">
        <h2 className="text-2xl font-bold text-left mb-2 ml-4">Tìm theo loại chỗ nghỉ ở Hà Nội</h2>
        <h6 className = "ml-4">Du khách tìm kiếm về Việt Nam cũng đặt chỗ ở những nơi này</h6>
        <div className="relative overflow-hidden">
          <div className="flex space-x-4 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${scrollIndexAccommodation * 16}rem)` }}>
            {accommodationCards.map((card, index) => (
              <div key={index} className="bg-white p-4 shadow-lg rounded-lg flex-none w-64">
                <img src={card.img} alt={card.title} className="w-full h-48 object-cover mb-4" />
                <h3 className="text-xl font-medium">{card.title}</h3>
                <p>{card.details}</p>
              </div>
            ))}
          </div>
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
            <button
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => scrollCards(setScrollIndexAccommodation, accommodationCards.length - 4, -1)}
            >
              {"<"}
            </button>
          </div>
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            <button
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => scrollCards(setScrollIndexAccommodation, accommodationCards.length - 4, 1)}
            >
              {">"}
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Explore Vietnam */}
      <section className="mb-10 mt-4">
      <h2 className="text-2xl font-bold text-left mb-2 ml-4">Khám phá Việt Nam</h2>
      <h6 className = "ml-4">Các điểm đến phổ biến này có nhiều điều chờ đón bạn</h6>
        <div className="relative overflow-hidden">
          <div className="flex space-x-4 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${scrollIndexVietnam * 16}rem)` }}>
            {vietnamCards.map((card, index) => (
              <div key={index} className="bg-white p-4 shadow-lg rounded-lg flex-none w-64">
                <img src={card.img} alt={card.title} className="w-full h-48 object-cover mb-4" />
                <h3 className="text-xl font-medium">{card.title}</h3>
                <p>{card.details}</p>
              </div>
            ))}
          </div>
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
            <button
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => scrollCards(setScrollIndexVietnam, vietnamCards.length - 4, -1)}
            >
              {"<"}
            </button>
          </div>
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            <button
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => scrollCards(setScrollIndexVietnam, vietnamCards.length - 4, 1)}
            >
              {">"}
            </button>
          </div>
        </div>
      </section> 

      <div className="space-y-3">
      <h2 className="text-2xl font-bold">Điểm đến mới nhất</h2>
      <p>Các điểm đến mới nhất được thêm bởi các chủ khách sạn của chúng tôi</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotels?.map((hotel) => (
          <LatestDestinationCard hotel={hotel} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default HomePage;
