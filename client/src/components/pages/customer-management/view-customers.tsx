import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  getAllcustomers,
  unblockStudent,
} from "../../../api/endpoints/customer-management";

import { toast } from "react-toastify";
import { formatDate } from "../../../utils/helpers";
import usePagination from "../../../hooks/usePagination";
import BlockStudentModal from "./block-customer-modal";
import { Customers } from "../../../api/types/customer/customer";
import { USER_AVATAR } from "../../../constants/common";
import { USE_MOCK_DATA, MOCK_DELAY } from "../../../config/mockConfig";
import { mockCustomers } from "../../../data/mockAdminData";

const TABLE_HEAD = ["Name", "Email", "Date Joined", "Status", "Actions"];

interface Props {
  updated: boolean;
  setUpdated: Dispatch<SetStateAction<boolean>>;
}
const Viewcustomers: React.FC<Props> = ({ updated, setUpdated }) => {
  const [customers, setcustomers] = useState<Customers[]>([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const ITEMS_PER_PAGE = 4;
  const {
    currentPage,
    totalPages,  
    currentData,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(customers, ITEMS_PER_PAGE);

  const fetchcustomers = async () => {
    // ✅ Mock Mode
    if (USE_MOCK_DATA) {
      setTimeout(() => {
        setcustomers(mockCustomers as any);
      }, MOCK_DELAY);
      return;
    }

    // ✅ Production Mode
    try {
      const response = await getAllcustomers();
      setcustomers(response?.data);
    } catch (error: any) {
      console.error("Error fetching customers:", error);
      // Fallback to mock data
      setcustomers(mockCustomers as any);
    }
  };
  useEffect(() => {
    fetchcustomers();
  }, [updated]);

  const handleUnblock = async (customerId: string) => {
    try {
      const response = await unblockStudent(customerId);
      toast.success(response?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setUpdated(!updated);
    } catch (error: any) {
      toast.error(error?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };
  return (
    <Card className='h-full w-full'>
      {open && (
        <BlockStudentModal
          open={open}
          setOpen={setOpen}
          updated={updated}
          setUpdated={setUpdated}
          id={id}
        />
      )}
      <CardHeader floated={false} shadow={false} className='rounded-none'>
        <div className='mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center'>
          <div>
            <Typography variant='h5' color='blue-gray'>
              Quản lý Customers
            </Typography>
            <Typography color='gray' className='mt-1 font-normal'>
              Chi tiết về các customers trong hệ thống
            </Typography>
          </div>
          <div className='flex w-full shrink-0 gap-2 md:w-max'>
            <div className='w-full md:w-72'>
              <Input
                label='Search'
                icon={<MagnifyingGlassIcon className='h-5 w-5' />}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className='overflow-scroll px-0'>
        <table className='w-full min-w-max table-auto text-left'>
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className='border-y border-blue-gray-100 bg-blue-gray-50/50 p-4'
                >
                  <Typography
                    variant='small'
                    color='blue-gray'
                    className='font-normal leading-none opacity-70'
                  >
                    {head}
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
                  firstName,
                  profileUrl,
                  profilePic,
                  isGoogleUser,
                  lastName,
                  email,
                  dateJoined,
                  isBlocked,
                },
                index
              ) => {
                const isLast = index === customers?.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <div className='flex items-center gap-3'>
                        <Avatar
                          src={
                            isGoogleUser && profilePic && profilePic.url
                              ? profilePic.url
                              : profileUrl || USER_AVATAR
                          }
                          alt='image'
                          size='md'
                          className='border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1'
                        />
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-bold'
                        >
                          {`${firstName} ${lastName}`}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant='small'
                        color='blue-gray'
                        className='font-normal'
                      >
                        {email}
                      </Typography>
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
                    <td className={classes}>
                      <div className='w-max'>
                        <Chip
                          size='sm'
                          variant='ghost'
                          value={isBlocked ? "Blocked" : "Active"}
                          color={isBlocked ? "red" : "green"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className='flex items-center '>
                        {isBlocked ? (
                          <div>
                            <button
                              onClick={() => {
                                handleUnblock(_id);
                              }}
                              className='w-[80px] px-1 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transform-gpu transition-transform duration-300 ease-in-out active:scale-95'
                            >
                              Unblock
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              onClick={() => {
                                setOpen(true);
                                setId(_id);
                              }}
                              className='w-[80px] px-1 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transform-gpu transition-transform duration-300 ease-in-out active:scale-95'
                            >
                              Block
                            </button>
                          </div>
                        )}
                      </div>
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
  );
};

export default Viewcustomers;



























