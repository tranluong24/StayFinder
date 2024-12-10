type Props = {
    selectedStars: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  const StarRatingFilter = ({ selectedStars, onChange }: Props) => {
    return (
      <div className="border-b border-slate-300 pb-5">
        <h4 className="text-md font-semibold mb-2">Xếp hạng khách sạn</h4>
        {["5", "4", "3", "2", "1"].map((star) => (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded w-5 h-5" // Tăng kích thước
              value={star}
              checked={selectedStars.includes(star)}
              onChange={onChange}
            />
            <span>{star} Sao</span>
          </label>
        ))}
      </div>
    );
  };
  
  export default StarRatingFilter;
  