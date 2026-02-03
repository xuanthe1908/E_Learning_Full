import { ApiResponseTrending } from "../../../api/types/apiResponses/api-response-home-page-listing";
import { Link } from "react-router-dom";

interface Props {
  productInfo: ApiResponseTrending;
}

const TrendingCard: React.FC<Props> = ({ productInfo }) => {
  const imageUrl = productInfo?.thumbnailUrl;
  return (
    <Link to={`/shop/${productInfo._id}`}>
      <div className="w-[280px] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-video w-full bg-gray-100">
          <img 
            src={imageUrl} 
            className="h-full w-full object-cover" 
            alt={productInfo.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-4">
          <h5 className="text-gray-900 text-base font-semibold line-clamp-2 mb-2 hover:text-blue-600 transition-colors min-h-[3rem]">
            {productInfo.title}
          </h5>
          <p className="text-sm text-gray-500">
            Người bán: {productInfo.sellerFirstName} {productInfo.sellerLastName}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TrendingCard;



























