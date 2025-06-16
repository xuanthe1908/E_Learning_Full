import { formatToINR } from "../../../utils/helpers";
import { CourseInterface } from "../../../types/course";

const CourseCard: React.FC<CourseInterface> = ({
  rating,
  price,
  isPaid,
  title,
  thumbnailUrl,
  description,
}) => {
  // Safe rating value
  const safeRating = rating && !isNaN(Number(rating)) ? Math.max(0, Math.min(5, Number(rating))) : 0;
  const formattedRating = safeRating.toFixed(1);
  console.log("DEBUG: CourseCard data", { title, isPaid, price });
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
    <div className="w-[18.5rem] p-5 text-customTextColor hover:shadow-lg border border-gray-200 rounded-lg transition-transform duration-200 hover:-translate-y-1">
      <div className="relative">
        <img src={thumbnailUrl} className="h-48 w-full object-cover rounded-md" alt={title} />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/60 rounded-md" />
      </div>
      <div className="pt-4">
        <div className="mb-3">
          <h5 className="text-blue-gray text-lg font-semibold">{title}</h5>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{description}</p>
        <div className="mt-3 flex justify-between items-center">
          <div>
            <p
              className={`text-sm font-medium ${
                isPaid
                  ? "text-blue-gray"
                  : "text-white p-1 text-xs rounded-tl-lg rounded-br-lg font-extrabold bg-green-400"
              }`}
            >
              {isPaid ? formatToINR(price) : "Free"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <StarRating value={safeRating} />
            <p className="text-blue-gray text-sm font-medium">{formattedRating}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
