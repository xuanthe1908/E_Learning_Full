import { formatToINR } from "../../../utils/helpers";
import { CourseInterface } from "../../../types/course";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartSlice";
import { toast } from "react-toastify";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const ProductCard: React.FC<CourseInterface> = ({
  rating,
  price,
  isPaid,
  title,
  thumbnailUrl,
  description,
  _id,
}) => {
  const dispatch = useDispatch();
  
  // Safe rating value
  const safeRating = rating && !isNaN(Number(rating)) ? Math.max(0, Math.min(5, Number(rating))) : 0;
  const formattedRating = safeRating.toFixed(1);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      rating,
      price,
      isPaid,
      title,
      thumbnailUrl,
      description,
      _id: _id || '',
    } as CourseInterface));
    toast.success("Đã thêm vào giỏ hàng!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  // Custom star rating component đẹp hơn
  const StarRating = ({ value }: { value: number }) => {
    const stars = Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.round(value);
      return (
        <span
          key={index}
          className={`text-lg transition-colors duration-200 ${
            filled ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    });
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="w-[280px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
      <Link to={`/courses/${_id}`}>
        <div className="relative aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <img 
            src={thumbnailUrl} 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" 
            alt={title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {!isPaid && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Miễn phí
            </span>
          )}
          {isPaid && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Bán chạy
            </span>
          )}
        </div>
      </Link>
      <div className="p-5 bg-white">
        <Link to={`/courses/${_id}`}>
          <h5 className="text-gray-900 text-base font-bold line-clamp-2 mb-2 hover:text-blue-600 transition-colors min-h-[3rem] group-hover:text-blue-600">
            {title}
          </h5>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <StarRating value={safeRating} />
            <span className="text-gray-700 text-sm font-semibold ml-1">{formattedRating}</span>
          </div>
          <div className="text-right">
            {isPaid ? (
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatToINR(price)}
                </p>
              </div>
            ) : (
              <p className="text-xl font-bold text-green-600">Miễn phí</p>
            )}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>Thêm vào giỏ</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
