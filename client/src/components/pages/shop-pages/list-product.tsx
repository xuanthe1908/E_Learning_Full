import React, { useEffect, useState } from "react";
import ProductCard from "./product-card";
import {
  getAllProducts,
  searchProduct,
} from "../../../api/endpoints/product/product";
import { toast } from "react-toastify";
import { ProductInterface } from "../../../types/product";
import { Link } from "react-router-dom";
import ShimmerCard from "../../shimmer/shimmer-card";
import { RiSearchLine } from "react-icons/ri";
import FilterproductsSelectBox from "./filter-product-selectbox";
import { debounce } from "lodash";
import { MdSentimentDissatisfied } from "react-icons/md";

const ListProduct: React.FC = () => {
  const [products, setproducts] = useState<ProductInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterQuery, setFilterQuery] = useState<string>("");

  const fetchProduct = async () => {
    try {
      const products = await getAllProducts();
      setproducts(products?.data?.data || []);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error: any) {
      toast.error(error?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    console.log(searchQuery)
    const debouncedHandleproductsearch = debounce(async () => {
      if (searchQuery.trim() !== "") {
        try {  
          const response = await searchProduct(searchQuery, "");
          setproducts(response?.data?.data || response?.data);
        } catch (error) {
          toast.error("Failed to search product");
        }
      } else if (filterQuery.trim() !== "") {
        try {
          const response = await searchProduct("", filterQuery);
          setproducts(response?.data?.data || response?.data);
        } catch (error) { 
          toast.error("Failed to search product");
        }
      } else {
        fetchProduct();
      }
    }, 300);

    debouncedHandleproductsearch();

    return () => {
      debouncedHandleproductsearch.cancel();
    };
  }, [searchQuery, filterQuery]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleSelect = (data: string) => {
    setFilterQuery(data);
  };

  if (isLoading) {
    return (
      <div className='text-customFontColorBlack  '>
        <div className='pt-5 pb-5 pl-9 pr-9 mt-5 mx-auto flex justify-center'>
          <div className='w-10/12 ml-2 pl-1 animate-pulse'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-100 h-8 rounded'>Loading Shop...</h1>
            <p className='text-gray-700 mt-2 bg-gradient-to-r from-gray-300 to-gray-100 h-4 rounded'></p>
          </div>
        </div>
        <div className='mx-auto pl-10 pr-10  flex justify-center'>
          <div className='w-10/12 pl-1 border-b-gray-100 border-b-2 mx-auto animate-pulse'>
            <div className='flex flex-wrap'>
              <div className='text-gray-900 rounded-lg px-2 py-2 mr-2 mb-2 cursor-pointer bg-gradient-to-r from-gray-300 to-gray-100 h-8 w-16'></div>
              <div className='text-gray-900 rounded-lg px-4 py-2 mr-2 mb-2 cursor-pointer bg-gradient-to-r from-gray-300 to-gray-100 h-8 w-24'></div>
              <div className='text-gray-900 rounded-lg px-4 py-2 mr-2 mb-2 cursor-pointer bg-gradient-to-r from-gray-300 to-gray-100 h-8 w-20'></div>
              <div className='text-gray-900 rounded-lg px-4 py-2 mr-2 mb-2 cursor-pointer bg-gradient-to-r from-gray-300 to-gray-100 h-8 w-24'></div>
            </div>
          </div>
        </div>

        <div className=' mx-auto flex justify-center'>
          <div className='w-10/12 '>
            <div className='flex mt-3 flex-wrap justify-center'>
              {[...Array(8)].map((_, index) => (
                <div className='m-2 py-3' key={index}>
                  <ShimmerCard />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-extrabold mb-3 drop-shadow-lg">
            🛍️ Tất cả sản phẩm
          </h1>
          <p className="text-blue-100 text-lg">
            Khám phá {products?.length} sản phẩm tuyệt vời dành cho bạn
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm hover:border-blue-300 transition-colors text-gray-700"
                  placeholder="🔍 Tìm kiếm sản phẩm..."
                />
                <RiSearchLine 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={22} 
                />
              </div>
            </div>
            <div className="md:w-64">
              <FilterproductsSelectBox handleSelect={handleSelect} />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {products.map((product: ProductInterface) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MdSentimentDissatisfied
              className="mx-auto text-gray-400 mb-4"
              size={64}
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-500">
              Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProduct;
export { ListProduct as ProductListPage };
