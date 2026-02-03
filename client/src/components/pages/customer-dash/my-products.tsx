import React, { useState, useEffect } from "react";
import MyCourseCard from "./my-product-card";
import { getProductByCustomer } from "../../../api/endpoints/product/product";
import { toast } from "react-toastify";
import { ProductInterface } from "../../../types/product";
import { Link } from "react-router-dom";
import ProfileCardShimmer from "../../shimmer/profile-card-shimmer";
import { USE_MOCK_DATA, MOCK_DELAY } from "../../../config/mockConfig";
import { mockCustomerProducts } from "../../../data/mockCustomerData";
type Props = {};

const MyProducts: React.FC = (props: Props) => {
  const [products, setProduct] = useState<ProductInterface[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchProducts = async () => {
    // ✅ Mock Mode
    if (USE_MOCK_DATA) {
      setLoading(true);
      setTimeout(() => {
        setProduct(mockCustomerProducts);
        setLoading(false);
      }, MOCK_DELAY);
      return;
    }

    // ✅ Production Mode
    try {
      setLoading(true);
      const response = await getProductByCustomer();
      setProduct(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      console.error("Error fetching products:", error);
      // Fallback to mock data
      setProduct(mockCustomerProducts);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className='w-full flex justify-center items-center  '>
      <div className='w-11/12 '>
        <div>
          <div className='pt-5 pb-2 w-full'>
            <h2 className='text-3xl font-semibold text-customFontColorBlack'>
              Sản phẩm của tôi
            </h2>
          </div>
          <div className='mb-2 pt-3'>
            <h5 className='text-customFontColorBlack font-semibold'>
              SẢN PHẨM ĐÃ MUA
            </h5>
          </div>
        </div>
        <div className='flex gap-x-10 h-full pb-10'>
          <div className=' w-full h-full   bg-white rounded-md '>
            <div className='flex pt-10  pb-10 flex-wrap border border-gray-300 rounded-md items-center bg-white  justify-center gap-x-10 gap-y-5 '>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => {
                  return <ProfileCardShimmer key={index} />;
                })
              ) : products?.length ? (
                products.map((product) => (
                  <Link to={`/shop/${product._id}`} key={product._id}>
                    <MyCourseCard {...product} />
                  </Link>
                ))
              ) : (
                <div className='text-center'>
                  Please purchase a product.{" "}
                  <Link to='/shop' className='text-blue-500 underline'>
                    View available products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;



























