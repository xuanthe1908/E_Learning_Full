import { useState, useEffect } from "react";

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

const usePagination = <T>(data: T[], itemsPerPage: number): PaginationResult<T> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState<T[]>([]);

  useEffect(() => {
    // ✅ Kiểm tra data hợp lệ
    if (!data || !Array.isArray(data) || itemsPerPage <= 0) {
      setTotalPages(1);
      return;
    }
    
    const pages = Math.ceil(data.length / itemsPerPage);
    setTotalPages(pages > 0 ? pages : 1);
  }, [data, itemsPerPage]);

  useEffect(() => {
    // ✅ Kiểm tra data hợp lệ trước khi slice
    if (!data || !Array.isArray(data) || itemsPerPage <= 0) {
      setCurrentData([]);
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentData(data.slice(startIndex, endIndex));
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  };
};

export default usePagination;