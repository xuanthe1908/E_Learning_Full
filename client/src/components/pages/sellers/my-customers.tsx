import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton
} from "@material-tailwind/react";
import { getMyCustomers } from "../../../api/endpoints/seller";
import { useState, useEffect } from "react";
import usePagination from "../../../hooks/usePagination";
import { formatDate } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { Customers } from "../../../api/types/customer/customer";
import { USE_MOCK_DATA, MOCK_DELAY } from "../../../config/mockConfig";
import { mockSellercustomers } from "../../../data/mockSellerData";
const TABLE_HEAD = ["Customer", "Sản phẩm", "Trạng thái", "Ngày tham gia"];

const MyCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customers[]>([]);
  const ITEMS_PER_PAGE = 5;  
  const {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(customers, ITEMS_PER_PAGE);
  const fetchCustomers = async () => {
    // ✅ Mock Mode
    if (USE_MOCK_DATA) {
      setTimeout(() => {
        setCustomers(mockSellercustomers as any);
      }, MOCK_DELAY);
      return;
    }

    // ✅ Production Mode
    try {
      const response = await getMyCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      // Fallback to mock data
      setCustomers(mockSellercustomers as any);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  return (
    <div className='pb-10'>
      <Card className='h-full w-full'>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          <div className=' flex items-center justify-between gap-8'>
            <div>
              <Typography variant='h5' color='blue-gray'>
                Danh sách khách hàng
              </Typography>
              <Typography color='gray' className='mt-1 font-normal'>
                Xem thông tin về tất cả khách hàng của bạn
              </Typography>
            </div>
            <div className='flex shrink-0 flex-col gap-2 sm:flex-row'>
              <Input
                label='Search'
                icon={<MagnifyingGlassIcon className='h-5 w-5' />}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className='overflow-scroll px-0'>
          <table className='mt-4 w-full min-w-max table-auto text-left'>
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className='cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50'
                  >
                    <Typography
                      variant='small'
                      color='blue-gray'
                      className='flex items-center justify-between gap-2 font-normal leading-none opacity-70'
                    >
                      {head}{" "}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className='h-4 w-4'
                        />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData?.map(
                (
                  {
                    _id,
                    email,
                    firstName,
                    lastName,  
                    product,
                    mobile,
                    isBlocked,
                    isGoogleUser,
                    dateJoined,
                    profileUrl,
                    profilePic
                  },
                  index
                ) => {
                  const isLast = index === customers.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
   
                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <div className='flex items-center gap-3'>
                          <Avatar
                            src={isGoogleUser?profilePic?.url:profileUrl}
                            alt={"image"}  
                            size='sm'
                          />
                          <div className='flex flex-col'>
                            <Typography
                              variant='small'
                              color='blue-gray'
                              className='font-normal'
                            >
                              {firstName + " " + lastName}
                            </Typography>
                            <Typography
                              variant='small'
                              color='blue-gray'
                              className='font-normal opacity-70'
                            >
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className='flex flex-col'>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'
                          >
                            {product || 'N/A'}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className='w-max'>
                          <Chip
                            variant='ghost'
                            size='sm'
                            value={!isBlocked ? "active" : "blocked"}
                            color={isBlocked ? "red" : "green"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'
                        >
                          {formatDate(dateJoined)}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className='flex items-center justify-between border-t border-blue-gray-50 p-4'>
        <Button
          variant='outlined'
          color='blue-gray'
          size='sm'
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className='flex items-center gap-2'>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <IconButton
                key={pageNumber}
                variant={pageNumber === currentPage ? "outlined" : "text"}
                color='blue-gray'
                size='sm'
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </IconButton>
            )
          )}
        </div>
        <Button
          variant='outlined'
          color='blue-gray'
          size='sm'
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </CardFooter>
      </Card>
    </div>
  );
};

export default MyCustomers;



























