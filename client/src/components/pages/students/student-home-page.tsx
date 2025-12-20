import React, { useState, useEffect } from "react";
import Carousel from "../../elements/carousel-page";
import TrendingCard from "../home/trending-card";
import RecommendedCard from "../home/recommended-card";
import { ApiResponseRecommended } from "../../../api/types/apiResponses/api-response-home-page-listing";
import TrendingCardShimmer from "components/shimmer/shimmer-trending-course";
import { selectIsLoggedIn } from "../../../redux/reducers/authSlice";
import { useSelector } from "react-redux";
import { Typography } from "@material-tailwind/react";
import {
  getTrendingCourses,
  getRecommendedCourses,
} from "../../../api/endpoints/course/course";
import { ApiResponseTrending } from "../../../api/types/apiResponses/api-response-home-page-listing";
import { Link } from "react-router-dom";
import { selectUserType } from "../../../redux/reducers/authSlice";

const StudentHomePage: React.FC = () => {
  const [trendingCourses, setTrendingCourses] = useState<
    ApiResponseTrending[] | null
  >(null);
  const [recommendedCourses, setRecommendedCourses] = useState<
    ApiResponseRecommended[] | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showMoreTrending, setShowMoreTrending] = useState(false);
  const [showMoreRecommended, setShowMoreRecommended] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(6);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [isLoadingRecommended, selectIsLoadingRecommended] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUserType);

  const fetchTrendingCourses = async () => {
    try {
      setIsLoadingTrending(true);
      const response = await getTrendingCourses();
      setTrendingCourses(response.data);
      setTimeout(() => {
        setIsLoadingTrending(false);
      }, 1000);
    } catch (error) {
      setIsLoadingTrending(false);
      // toast.error("Something went wrong", {
      //   position: toast.POSITION.BOTTOM_RIGHT,
      // });
    }
  };

  const fetchRecommendedCourses = async () => {
    try {
      selectIsLoadingRecommended(true);
      const response = await getRecommendedCourses();
      setRecommendedCourses(response.data);
      setTimeout(() => {
        selectIsLoadingRecommended(false);
      }, 1000);
    } catch (error) {
      selectIsLoadingRecommended(false);
      // toast.error("Something went wrong", {
      //   position: toast.POSITION.BOTTOM_RIGHT,
      // });
    }
  };

  useEffect(() => {
    fetchTrendingCourses();
    isLoggedIn && user === "student" && fetchRecommendedCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowMoreTrending = () => {
    setShowMoreTrending(true);
    setCardsToShow((prevCardsToShow) => prevCardsToShow + 3);
  };

  const handleShowMoreRecommended = () => {
    setShowMoreRecommended(true);
    setCardsToShow((prevCardsToShow) => prevCardsToShow + 3);
  };
  if (isLoadingTrending || isLoadingRecommended) {
    return (
      <div>
        <Carousel />
        <div className='lg:p-10 md:p-7 pt-7 sm:p-8 w-full'>
          <div className='ml-10 flex items-center justify-start w-9/12'>
            <Typography
              variant='h1'
              className='text-2xl  lg:text-4xl p-2 ml-2  font-semibold'
            >
              Trending Courses
            </Typography>
          </div>
          <div className='flex items-center justify-between px-10 flex-wrap'>
            {Array.from({ length: 6 }).map((_, index) => (
              <TrendingCardShimmer key={index} />
            ))}
          </div>
        </div>
        {isLoggedIn && (
          <div className='lg:p-10 md:p-7 pt-5 sm:p-8 w-full'>
            <div className='ml-10 flex items-center justify-start w-9/12'>
              <Typography
                variant='h1'
                className='text-2xl  p-2 ml-2 lg:text-4xl font-semibold'
              >
                Sản phẩm đề xuất
              </Typography>
            </div>
            <div className='flex items-center justify-between pt-2 px-10 flex-wrap'>
              {Array.from({ length: 6 }).map((_, index) => (
                <TrendingCardShimmer key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      <Carousel />
      
      {/* Trending Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-center">
          <div className="inline-block mb-4">
            <span className="text-5xl">🔥</span>
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Sản phẩm nổi bật
          </h2>
          <p className="text-gray-600 text-lg">Những sản phẩm được yêu thích nhất hiện nay</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {trendingCourses?.slice(0, cardsToShow).map((course) => (
            <TrendingCard key={course._id} courseInfo={course} />
          ))}
        </div>
        
        {trendingCourses && trendingCourses.length > cardsToShow && (
          <div className="text-center mt-12">
            <button
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={handleShowMoreTrending}
            >
              Xem thêm sản phẩm →
            </button>
          </div>
        )}
      </section>

      {/* Recommended Products Section */}
      {recommendedCourses && recommendedCourses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white/60 backdrop-blur-sm rounded-3xl mx-4 mb-8 shadow-xl">
          <div className="mb-10 text-center">
            <div className="inline-block mb-4">
              <span className="text-5xl">⭐</span>
            </div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Sản phẩm đề xuất cho bạn
            </h2>
            <p className="text-gray-600 text-lg">Dựa trên sở thích và lịch sử mua hàng của bạn</p>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-pink-600 to-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {recommendedCourses?.slice(0, cardsToShow).map((course, index) => (
              <RecommendedCard key={index} courseInfo={course} />
            ))}
          </div>
          
          {recommendedCourses.length > cardsToShow && (
            <div className="text-center mt-12">
              <button
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={handleShowMoreRecommended}
              >
                Xem thêm sản phẩm →
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default StudentHomePage;
