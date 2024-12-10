import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";

const Home = () => {
  const { data: hotels } = useQuery("fetchQuery", () => apiClient.fetchHotels());

  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Điểm đến mới nhất</h2>
      <p>Các điểm đến mới nhất được thêm bởi các chủ khách sạn của chúng tôi</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotels?.map((hotel) => (
          <LatestDestinationCard hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Home;
