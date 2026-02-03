import React, { useEffect, useState, ChangeEvent } from "react";
import SellerCard from "./seller-card";
import { Link } from "react-router-dom";
import { getAllSellers } from "../../../api/endpoints/seller-management";
import { SellerApiResponse } from "../../../api/types/apiResponses/api-response-sellers";
import { toast } from "react-toastify";
import ShimmerListAllsellers from "../../shimmer/shimmer-list-all-sellers";
import FiltersellerselectBox from "./filter-seller-select-box";
import { RiSearchLine } from "react-icons/ri";
import { Spinner } from "@material-tailwind/react";

type Props = {};

const ListAllsellers: React.FC<Props> = () => {
  const [sellers, setsellers] = useState<
    SellerApiResponse[] | undefined
  >(undefined);
  const [filteredsellers, setFilteredsellers] = useState<
    SellerApiResponse[] | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [debouncedFilter, setDebouncedFilter] = useState<number | undefined>(
    undefined
  );

  const fetchsellers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSellers();
      setsellers(response?.data?.data);
      setFilteredsellers(response?.data?.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => {
    fetchsellers();
  }, []);

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ) => {
    let timeoutId: number | undefined;
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        func(...args);
      }, delay);
      setDebouncedFilter(timeoutId);
    };
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  useEffect(() => {
    const debouncedFilterFunc = debounce(() => {
      setIsSearchLoading(true);
      const searchResult = sellers?.filter(
  (instructor) =>
    (instructor.firstName?.toLowerCase().trim().includes(searchQuery.toLowerCase()) ||
     instructor.lastName?.toLowerCase().trim().includes(searchQuery.toLowerCase()))
);

  
      setTimeout(() => {
        setFilteredsellers(searchResult);
        setIsSearchLoading(false);
      }, 500);
    }, 200);

    debouncedFilterFunc();

    return () => {
      if (debouncedFilter) {
        clearTimeout(debouncedFilter);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sellers]);

  const filteredAndSearchedsellers = filteredsellers?.filter(
    (instructor) =>
      filterValue.length === 0 ||
      instructor.subjects.some((category: string) => filterValue.includes(category))
  );
  const handleSelect = (value: string) => {
    setFilterValue(value);
  };

  if (isLoading || sellers === undefined) {
    return <ShimmerListAllsellers />;
  }

  return (
    <div className="h-full pb-7">
      <div className="h-1/3 p-12 flex flex-col w-full bg-skyBlueCustom items-center justify-center">
        <div className="block text-center">
          <h1 className="p-2 text-customFontColorBlack md:text-4xl sm:text-4xl font-bold">
            Our sellers
          </h1>
        </div>
        <div className="block text-center">
          <p className="text-customFontColorBlack md:text-xl sm:text-4xl font-semibold">
            Meet Subject Experts
          </p>
        </div>
      </div>
      <div>
        <div className="flex p-3 bg-white justify-center">
          <div className="p-5 flex md:w-4/12 w-full gap-x-1">
            <FiltersellerselectBox handleSelect={handleSelect} />
            <div className="relative flex-1 mt-2">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="p-2 pr-8 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 h-10 w-full"
                placeholder="Search..."
              />  
              <div  className="absolute top-5 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                <RiSearchLine size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-10 flex items-center gap-y-10 bg-gray-50 justify-evenly flex-wrap">
          {isSearchLoading ? (
            <Spinner color="blue-gray" className="h-8 w-8" />
          ) : filteredAndSearchedsellers?.length ? (
            filteredAndSearchedsellers?.map((instructor) => (
              <Link key={instructor._id} to={`/tutors/${instructor._id}`}>
                <SellerCard {...instructor} />
              </Link>
            ))
          ) : (
            <div className="p-3 text-customFontColorBlack font-light">
              No results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default ListAllsellers;



























