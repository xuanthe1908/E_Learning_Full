import { useState, useEffect } from "react";
import { GetProductBySellerInterface } from "../api/types/apiResponses/api-response-sellers";
import { debounce} from "lodash";

const useSearch = (
    data: GetProductBySellerInterface[],
    query: string
  ): GetProductBySellerInterface[] => {
    const [searchResults, setSearchResults] = useState<GetProductBySellerInterface[]>([]);
  
    useEffect(() => {
      const delay = 300; // Debounce delay in milliseconds
      const debounceSearch = debounce(() => {
        if (query.trim() !== "") {
          const regex = new RegExp(query, "i"); // Case-insensitive regex matching
          const filteredResults = data.filter((item) => {
            // Modify this condition according to your search criteria
            return regex.test(item.title);
          });
          setSearchResults(filteredResults);
        } else {
          setSearchResults([]);
        }
      }, delay);
  
      debounceSearch();
  
      return () => {
        debounceSearch.cancel();
      };
    }, [data, query]);
  
    return searchResults;
  };
  export default useSearch
  





















