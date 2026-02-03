import React, { useState } from "react";
import CustomBreadCrumbs from "../../common/bread-crumbs";
import { Link, useLocation } from "react-router-dom";
import { Button, Chip } from "@material-tailwind/react";
import { getIndividualProduct } from "../../../api/endpoints/product/product";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductInterface } from "../../../types/product";
import { formatToINR } from "../../../utils/helpers";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BiVideo } from "react-icons/bi";
import { IoBookSharp } from "react-icons/io5";
import useApiData from "../../../hooks/useApiCall";
import { getItemsByProduct } from "../../../api/endpoints/product/item";
import { useDispatch } from "react-redux";
import { setProduct } from "../../../redux/reducers/productSlice";
import { useSelector } from "react-redux";
import { selectCustomerId } from "../../../redux/reducers/customerSlice";
import { MdDone } from "react-icons/md";
import { addToCart } from "../../../redux/reducers/cartSlice";
import { ShoppingCartIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import PaymentConfirmationModal from "./payment-confirmation-modal";
import PdfViewer from "./pdf-viewer";
import Viewproductshimmer from "components/shimmer/view-product-shimmer";

const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

const ViewProductCustomerComponent: React.FC = () => {
  const params = useParams<{ productId: string }>();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const productId = params.productId;

  console.log('🔍 ViewCourse - Raw params:', params);
  console.log('🔍 ViewCourse - Extracted productId:', productId);
  console.log('🔍 ViewCourse - ProductId type:', typeof productId);
  const [openPaymentConfirmation, setOpenPaymentConfirmation] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const customerId = useSelector(selectCustomerId);
  const [showPdf] = useState(false);
  const [successToastShown, setSuccessToastShown] = useState(false);

  const fetchProduct = async (productId: string): Promise<ProductInterface> => {
    if (!productId || !isValidObjectId(productId)) {
      throw new Error('Invalid product ID format');
    }
    try {
      const product = await getIndividualProduct(productId);
      return product?.data?.data as ProductInterface;
    } catch (error: any) {
      toast.error(error.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      throw error;
    }
  };
  const fetchItems = async (productId: string) => {
    if (!productId || !isValidObjectId(productId)) {
      throw new Error('Invalid product ID for items');
    }
    try {
      const items = await getItemsByProduct(productId);
      return items.data;
    } catch (error: any) {
      toast.error(error.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      throw error;
    }
  };
  
  const shouldFetch = productId && isValidObjectId(productId);
  
  const { data, isLoading, refreshData } = useApiData(
    fetchProduct, 
    shouldFetch ? productId : null // Pass null if invalid
  );
  
  const { data: items, isLoading: isItemsLoading } = useApiData(
    fetchItems,
    shouldFetch ? productId : null // Pass null if invalid
  );

  const product: ProductInterface | null = data;
  product && dispatch(setProduct({ product }));

  const handleToggle = (index: any) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({
      _id: product._id || '',
      title: product.title || '',
      description: product.description || '',
      thumbnailUrl: product.thumbnailUrl || '',
      price: product.price || 0,
      isPaid: product.isPaid || false,
      rating: product.rating || 0,
    } as ProductInterface));
    toast.success("Đã thêm vào giỏ hàng!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const handleBuyNow = () => {
    // Thêm vào giỏ hàng trước, rồi chuyển đến checkout
    if (product) {
      dispatch(addToCart({
        _id: product._id || '',
        title: product.title || '',
        description: product.description || '',
        thumbnailUrl: product.thumbnailUrl || '',
        price: product.price || 0,
        isPaid: product.isPaid || false,
        rating: product.rating || 0,
      } as ProductInterface));
      // Chuyển đến trang checkout
      window.location.href = '/checkout';
    }
  };
  const location = useLocation();
  if (isLoading || isItemsLoading) {
    return <Viewproductshimmer />;
  }

  if (location.hash === "#success" && !successToastShown) {
    toast.success("Successfully purchased the product", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    setSuccessToastShown(true);
  }
  const purchased = (product?.productsPurchased || []).includes(customerId);
  
  if (!product) {
    return <Viewproductshimmer />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20'>
      <PaymentConfirmationModal
        open={openPaymentConfirmation}
        setUpdated={refreshData}
        productDetails={{
          price: product?.price ?? 0,
          overview: product?.description ?? "",
          isPaid: product?.isPaid ?? false,
        }}
        setOpen={setOpenPaymentConfirmation}
      />
      
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <CustomBreadCrumbs paths={location.pathname} />
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Product Image */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='relative aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200'>
                <img
                  className='w-full h-full object-cover'
                  src={product?.thumbnailUrl}
                  alt={product?.title}
                />
                <div className='absolute top-4 right-4'>
                  <div className='bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg'>
                    {product?.isPaid ? 'Bán chạy' : 'Miễn phí'}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className='bg-white rounded-xl shadow-lg p-8'>
              <div className='mb-6'>
                <h1 className='text-4xl font-extrabold text-gray-900 mb-4'>{product?.title}</h1>
                <p className='text-lg text-gray-600 leading-relaxed'>{product?.description}</p>
              </div>

              {/* Syllabus Section */}
              <div className='mb-8'>
                <h4 className='text-2xl font-bold mb-4 text-gray-900'>Nội dung khóa học</h4>
              <ul className='text-gray-700 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden'>
                <li
                  className={` p-6 border-b-2 cursor-pointer ${
                    expandedIndex === 0
                      ? "bg-blue-gray-50"
                      : "hover:bg-blue-gray-50"
                  }`}
                  onClick={() => handleToggle(0)}
                >
                  <div className='flex items-center'>
                    <span className='text-blue-500 mr-2'>&#9679;</span>
                    <span>Module 1: Introduction to the Course</span>
                    {expandedIndex === 0 ? (
                      <FaAngleUp className='ml-auto' />
                    ) : (
                      <FaAngleDown className='ml-auto' />
                    )}
                  </div>
                </li>
                {expandedIndex === 0 && (
                  <li className=''>
                    <ul>
                      <Link to={product?.guidelinesUrl ?? ""} target="_blank" rel="noopener noreferrer" >
                        <li
                          className='p-6 border-b border-gray-200 flex items-center cursor-pointer hover:bg-blue-50 transition-colors'
                        >
                          <IoBookSharp className='mr-2 text-blue-500' />
                          <span className='flex-1'>Important guidelines</span>
                        </li>
                      </Link>
                      {showPdf && (
                        <PdfViewer pdfUrl={product?.guidelinesUrl ?? ""} />
                      )}

                      {/* <Link to={`watch-item/introduction`}>
                        <li className='p-6 border-b flex items-center cursor-pointer hover:bg-customBlueShade'>
                          <BiVideo className='mr-2 text-blue-500' />
                          <span className='flex-1'>Introduction video</span>
                        </li>
                      </Link> */}
                    </ul>
                  </li>
                )}
                <li
                  className={` p-6 border-b-2 cursor-pointer ${
                    expandedIndex === 1
                      ? "bg-blue-gray-50"
                      : "hover:bg-blue-gray-50"
                  }`}
                  onClick={() => handleToggle(1)}
                >
                  <div className='flex items-center'>
                    <span className='text-blue-500 mr-2'>&#9679;</span>
                    <span>Module 2: Advanced Techniques</span>
                    {expandedIndex === 1 ? (
                      <FaAngleUp className='ml-auto' />
                    ) : (
                      <FaAngleDown className='ml-auto' />
                    )}
                  </div>
                </li>
                {expandedIndex === 1 && (
                  <li className=''>
                    <ul>
                      {items && items.length > 0 ? (
                        items.map((item: any) => {
                          return (
                            <Link
                              to={`watch-item/${item._id}`}
                              key={item._id}
                            >
                              <li className='p-6 border-b border-gray-200 flex items-center cursor-pointer hover:bg-blue-50 transition-colors'>
                                <BiVideo className='mr-2 text-blue-500' />
                                <span className='flex-1'>{item.title}</span>
                              </li>
                            </Link>
                          );
                        })
                      ) : (
                        <div className='p-6 text-gray-500'>No items available</div>
                      )}
                    </ul>
                  </li>
                )}
              </ul>
            </div>
              {/* About Section */}
              {product?.about && (
                <div className='mb-8'>
                  <h4 className='text-2xl font-bold mb-4 text-gray-900'>Mô tả sản phẩm</h4>
                  <div className='text-gray-700 bg-gray-50 p-6 rounded-lg leading-relaxed'>
                    {product?.about}
                  </div>
                </div>
              )}

              {/* Requirements Section */}
              {(product?.requirements || []).length > 0 && (
                <div className='mb-8'>
                  <h4 className='text-2xl font-bold mb-4 text-gray-900'>Yêu cầu</h4>
                  <ul className='space-y-2'>
                    {(product?.requirements || []).map((item, index) => {
                      return (
                        <li className='flex items-start p-3 bg-gray-50 rounded-lg' key={index}>
                          <span className='text-blue-600 mr-3 mt-1'>&#10003;</span>
                          <span className='text-gray-700'>{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-xl border border-gray-200 p-6 sticky top-4'>
              {/* Price */}
              <div className='mb-6 text-center border-b border-gray-200 pb-6'>
                {product?.isPaid ? (
                  <div>
                    <div className='text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                      {formatToINR(product?.price ?? 0)}
                    </div>
                    <p className='text-sm text-gray-500'>Giá đã bao gồm VAT</p>
                  </div>
                ) : (
                  <div className='text-4xl font-extrabold text-green-600 mb-2'>
                    Miễn phí
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='space-y-3 mb-6'>
                {purchased ? (
                  <div className='bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center'>
                    <MdDone className='inline-block text-2xl text-green-600 mb-2' />
                    <p className='text-green-700 font-semibold'>Đã sở hữu sản phẩm</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleBuyNow}
                      className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2'
                    >
                      <ShoppingCartIcon className='h-5 w-5' />
                      Mua ngay
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className='w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
                    >
                      <ShoppingCartIcon className='h-5 w-5' />
                      Thêm vào giỏ hàng
                    </button>
                  </>
                )}
              </div>

              {/* Product Features */}
              <div className='space-y-3 mb-6 pt-6 border-t border-gray-200'>
                <div className='flex items-center text-gray-700'>
                  <span className='text-green-500 mr-3 text-xl'>&#10003;</span>
                  <span className='text-sm'>Giao hàng nhanh chóng</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span className='text-green-500 mr-3 text-xl'>&#10003;</span>
                  <span className='text-sm'>Thanh toán an toàn</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span className='text-green-500 mr-3 text-xl'>&#10003;</span>
                  <span className='text-sm'>Hỗ trợ 24/7</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span className='text-green-500 mr-3 text-xl'>&#10003;</span>
                  <span className='text-sm'>Đổi trả trong 7 ngày</span>
                </div>
              </div>

              {/* Share Section */}
              <div className='pt-6 border-t border-gray-200'>
                <p className='text-sm text-gray-600 mb-3 text-center'>Chia sẻ sản phẩm</p>
                <div className='flex justify-center gap-3'>
                  <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                    <ShareIcon className='h-5 w-5 text-gray-600' />
                  </button>
                  <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                    <HeartIcon className='h-5 w-5 text-gray-600' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewProductCustomerComponent;
// Export with new name for shop compatibility
export { ViewProductCustomerComponent as ProductDetailPage };




























