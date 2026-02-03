import React, { useState, useEffect } from "react";
import VideoPlayer from "./video-player";
import AboutItem from "./about-item";
import Quizzes from "./quizzes-page";
import Discussion from "./discussion-page";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getItemById } from "../../../api/endpoints/product/item";
import { getItemsByProduct } from "../../../api/endpoints/product/item";
import { ApiResponseItem } from "../../../api/types/apiResponses/api-response-item";
import { Media } from "../../../api/types/apiResponses/api-response-item";
import { BiVideo } from "react-icons/bi";
import { useSelector } from "react-redux";
import { selectCustomerId } from "../../../redux/reducers/customerSlice";
import { selectProduct } from "redux/reducers/productSlice";
import ShimmerEffectWatchItems from "../../shimmer/watch-items-shimmer";
import ShimmerVideoPlayer from "../../shimmer/shimmer-video-player";
import ShopWidget from "components/shop/ShopWidget";

const WatchItems: React.FC = () => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [isLoadingAllItems, setisLoadingAllItems] = useState(false);
  const [isLoadingItem, setisLoadingItem] = useState(false);
  const [item, setItem] = useState<ApiResponseItem | null>(null);
  const [allItems, setAllItems] = useState<Array<ApiResponseItem>>([]);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const { itemId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();
  const [currentItemId, setcurrentItemId] = useState<string | undefined>(
    itemId
  );
  const customerId = useSelector(selectCustomerId);
  const currentProduct = useSelector(selectProduct);
  const { productId } = useParams();
  let isProductPurchased = false;

  if (currentProduct) {
    isProductPurchased = currentProduct.productsPurchased.includes(customerId);
  }
  console.log(currentProduct)
  console.log(currentProduct?.introduction.key)

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const fetchItemsByProduct = async (productId: string) => {
    try {
      setisLoadingAllItems(true);
      const response = await getItemsByProduct(productId);
      setAllItems(response?.data);
      setTimeout(() => {
        setisLoadingAllItems(false);
      }, 3000);
    } catch (error: any) {
      setisLoadingAllItems(false);
      toast.error(error?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };
  const fetchItem = async (itemId: string) => {
    try {
      setisLoadingItem(true);
      const response = await getItemById(itemId);
      setItem(response?.data);
      const key = response?.data?.media.find(
        (media: Media) => media.name === "itemVideo"
      )?.key;
      setVideoKey(key);
      setTimeout(() => {
        setisLoadingItem(false);
      }, 2000);
    } catch (error: any) {
      setisLoadingItem(false);
      toast.error(error?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => {
    currentItemId && fetchItem(currentItemId);
  }, [currentItemId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Hide the browser's scroll bar on component mount
    document.body.style.overflow = "hidden";
    productId && fetchItemsByProduct(productId);
    // fetchVideoUrl()
    return () => {
      // Restore the browser's scroll bar on component unmount
      document.body.style.overflow = "auto";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content = null;

  if (selectedItemIndex === 0) {
    content = <AboutItem about={item?.description ?? ""} />;
  } else if (selectedItemIndex === 1) {
    content = <Discussion itemId={currentItemId ?? ""} />;
  } else {
    content = <Quizzes itemId={itemId} />;
  }
  if (isLoadingAllItems && isLoadingItem) {
    return <ShimmerEffectWatchItems />;
  }
  return (
    <div className='flex h-screen pb-16'>
      {isLoadingItem ? (
        <ShimmerVideoPlayer />
      ) : (
        <div className='md:w-3/4 w-full  overflow-y-scroll scrollbar-track-blue-gray-50 scrollbar-thumb-gray-400 scrollbar-thin scrollbar-h-md'>
          <div className='h-3/4'>
            <VideoPlayer
              videoKey={videoKey}
              isProductPurchased={currentProduct && currentProduct.isPaid ? isProductPurchased : true}
              />
          </div>
          <div className=''>
            <ul className='flex p-3'>
              {/* <li
                className={` block md:hidden ml-5 cursor-pointer ${
                  selectedItemIndex === 0
                    ? "border-b-4 rounded-b-md border-blue-gray-700"
                    : ""
                }`}
                onClick={() => handleItemClick(0)}
              >
                items
              </li> */}
              <li
                className={`ml-5 cursor-pointer ${
                  selectedItemIndex === 0
                    ? "border-b-4 rounded-b-md border-blue-gray-700"
                    : ""
                }`}
                onClick={() => handleItemClick(0)}
              >
                About
              </li>
              <li
                className={`ml-6 cursor-pointer ${
                  selectedItemIndex === 1
                    ? "border-b-4 rounded-b-md  border-blue-gray-700"
                    : ""
                }`}
                onClick={() => handleItemClick(1)}
              >
                Discussion
              </li>
              <li
                className={`ml-6 cursor-pointer ${
                  selectedItemIndex === 2
                    ? "border-b-4 rounded-b-md  border-blue-gray-700"
                    : ""
                }`}
                onClick={() => handleItemClick(2)}
              >
                Quizzes
              </li>
            </ul>
          </div>
          <div className='pl-8 pr-8 pb-12 pt-4'>{content}</div>
        </div>
      )}
      <div className='w-1/4 hidden md:block flex-grow mt-3 mb-2 overflow-y-scroll  scrollbar-thumb-gray-400  scrollbar-rounded scrollbar-track-gray-200 scrollbar-thin'>
        <h1 className='font-semibold text-blue-gray-800 text-2xl border-b border-gray-300 p-2'>
          items
        </h1>
        <ul>
          {/* <li
            onClick={() => {
              setcurrentItemId(currentProduct?._id);
              setVideoKey(currentProduct?.introduction?.key??"")
            }}
            className={`p-6 border-b-2 flex items-center cursor-pointer 
              ${
                currentProduct?._id === currentItemId
                  ? "bg-gray-200 hover:bg-gray-200"
                  : "hover:bg-gray-100"
              }  
              `}
          >
            <BiVideo className='mr-2 text-blue-500' />
            <span className='flex-1 text-sm font-light text-gray-700'>
              Episode 0{0} - Introduction to the course
            </span>
          </li> */}

          {allItems.map((item: any, index: number) => (
            <li
              key={item?._id}
              onClick={() => {
                if (item?._id) {
                  setcurrentItemId(item._id);
                }
              }}
              className={`p-6 border-b-2 flex items-center cursor-pointer 
              ${
                item?._id === currentItemId
                  ? "bg-gray-200 hover:bg-gray-200"
                  : "hover:bg-gray-100"
              }  
              `}
            >
              <BiVideo className='mr-2 text-blue-500' />
              <span className='flex-1 text-sm font-light text-gray-700'>
                Episode 0{index + 1} - {item?.title}
              </span>
            </li>
          ))}
        </ul>
        <ShopWidget productId={productId} itemId={itemId} />
      </div>
    </div>
  );
};

export default WatchItems;




























