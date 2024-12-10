type Props = {
    selectedPrice?: number;
    onChange: (value?: number) => void;
  };
  
  const PriceFilter = ({ selectedPrice, onChange }: Props) => {
    return (
      <div>
        <h4 className="text-md font-semibold mb-2"> Ngân sách của bạn (mỗi đêm)</h4>
        <select
          className="p-2 border rounded-md w-full"
          value={selectedPrice}
          onChange={(event) =>
            onChange(
              event.target.value ? parseInt(event.target.value) : undefined
            )
          }
        >
          <option value="">Chọn mệnh giá (VNĐ)</option>
            {[1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 10000000, 20000000].map((price) => (
          <option value={price}>{price.toLocaleString('vi-VN')}</option>
        ))}
        </select>
      </div>
    );
  };
  
  export default PriceFilter;
  