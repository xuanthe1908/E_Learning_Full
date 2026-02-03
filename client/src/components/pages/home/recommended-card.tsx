import { ApiResponseRecommended } from "../../../api/types/apiResponses/api-response-home-page-listing";
import { Link } from "react-router-dom";

interface Props {
  productInfo: ApiResponseRecommended;
}

const RecommendedCard: React.FC<Props> = ({ productInfo }) => {
  const { product, seller, media } = productInfo;
  const imageUrl = media.thumbnailUrl;
  return (
    <Link to={`/shop/${product?._id}`}>
      <div className="w-[280px] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-video w-full bg-gray-100">
          <img 
            src={imageUrl} 
            className="h-full w-full object-cover" 
            alt={product?.name} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-4">
          <h5 className="text-gray-900 text-base font-semibold line-clamp-2 mb-2 hover:text-blue-600 transition-colors min-h-[3rem]">
            {product?.name}
          </h5>
          <p className="text-sm text-gray-500">
            Người bán: {seller?.firstName} {seller?.lastName}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default RecommendedCard;



























