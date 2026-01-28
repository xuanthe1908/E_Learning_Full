import React from "react";
import { Tooltip, Typography } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectStudent } from "../../../redux/reducers/studentSlice";
import { USE_MOCK_DATA } from "../../../config/mockConfig";
import { mockCustomerInfo } from "../../../data/mockCustomerData";

type Props = {};

const DashHome: React.FC = (props: Props) => {
  const student = useSelector(selectStudent);
  // ✅ Mock Mode: Use mock customer info
  const customerName = USE_MOCK_DATA 
    ? `${mockCustomerInfo.firstName} ${mockCustomerInfo.lastName}`
    : (student.studentDetails?.firstName + " " + student.studentDetails?.lastName || "Customer");
  
  return (
    <div className='w-full flex justify-center items-center'>
      <div className='w-11/12'>
        <div>
          <div className='pt-5 pb-2 w-full'>
            <h2 className='text-3xl font-semibold text-customFontColorBlack'>
              Chào mừng trở lại, {customerName}
            </h2>
          </div>
          <div className='mb-2 pt-3'>
            <h5 className='text-customFontColorBlack font-semibold'>
              TỔNG QUAN
            </h5>
          </div>
        </div>
        <div className='h-[30rem] flex flex-col md:flex-row gap-x-10'>
          <div className='border md:w-8/12 w-full h-full bg-white rounded-md border-gray-300'>
            <div className='flex h-full flex-col justify-center items-center'>
              <h2 className='text-xl font-semibold p-1 text-customFontColorBlack'>
                Bắt đầu mua sắm ngay hôm nay!
              </h2>
              <div className='w-7/12'>
                <p className='text-sm whitespace-pre-line text'>
                  Khám phá hàng ngàn sản phẩm chất lượng với
                </p>
                <p className='text-sm ml-4 whitespace-pre-line text'>
                  giá cả hợp lý và dịch vụ chăm sóc khách hàng tận tâm.
                </p>
              </div>
              <Link to="/shop">
                <button className='bg-blue-500 mt-5 hover:bg-blue-600 rounded-md text-white p-2'>
                  Xem sản phẩm
                </button>
              </Link>
            </div>
          </div>
          <div className='border my-5 md:mt-0 md:w-4/12 w-full h-full bg-white rounded-md border-gray-300'>
            <div className='p-2 flex'>
              <h2 className='text-customFontColorBlack font-bold pt-2 pl-2'>
                Mục tiêu của tôi
              </h2>
              <Tooltip
                content={
                  <div className='w-80'>
                    <Typography color='white' className='font-medium'>
                      Info
                    </Typography>
                    <Typography
                      variant='small'
                      color='white'
                      className='font-normal opacity-80'
                    >
                      Để đạt mục tiêu của bạn, hãy mua sắm và sử dụng sản phẩm
                    </Typography>
                  </div>
                }
              >
                <InformationCircleIcon
                  strokeWidth={2}
                  className='text-blue-gray-500 w-4 h-4 mt-3 ml-0.5 cursor-pointer'
                />
              </Tooltip>
            </div>
            <div></div>
            <div className='m-4 bg-gray-200 rounded-md'>
              <h2 className='text-sm font-light p-2'>
                Tạo thói quen! Mỗi ngày bạn mua sắm và sử dụng sản phẩm, bạn sẽ tích lũy được nhiều kinh nghiệm và lợi ích.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashHome;
