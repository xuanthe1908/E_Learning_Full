import { ProductDbRepositoryInterface } from '../../../app/repositories/productDbRepository';
import AppError from '../../../utils/appError';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import { ProductInterface } from '../../../types/productInterface';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const searchProductU = async (
  searchQuery: string,
  filterQuery: string,
  cloudService: ReturnType<CloudServiceInterface>,
  productDbRepository: ReturnType<ProductDbRepositoryInterface>
) => {
  console.log('🔍 Search params:', { searchQuery, filterQuery });
  
  if (!searchQuery && !filterQuery) {
    throw new AppError(
      'Please provide a search or filter query',
      HttpStatusCodes.BAD_REQUEST
    );
  }

  let isFree = false;
  let searchParams: string = '';

  // ✅ Handle search query logic
  if (searchQuery && searchQuery.trim() !== '') {
    const freeRegex = /^free\s/i;
    const isFreeMatch = searchQuery.match(freeRegex);
    if (isFreeMatch) {
      isFree = true;
      searchParams = searchQuery.replace(freeRegex, '').trim();
    } else {
      searchParams = searchQuery;
    }
  }

  // ✅ Handle filter query logic 
  if (filterQuery && filterQuery.trim() !== '') {
    // For Vietnamese categories, we might need to handle "free" differently
    // Check if filter query contains any free-related keywords
    const filterLower = filterQuery.toLowerCase();
    if (filterLower.includes('miễn phí') || filterLower.includes('free')) {
      isFree = true;
    }
    
    // If we don't have searchParams from searchQuery, use filterQuery
    if (!searchParams) {
      searchParams = filterQuery;
    }
  }

  console.log('🔍 Processed params:', { isFree, searchParams, filterQuery });

  try {
    const searchResult = await productDbRepository.searchProduct(
      isFree,
      searchParams,
      filterQuery
    );

    // ✅ Add thumbnail URLs
    await Promise.all(
      searchResult.map(async (product) => {
        if (product.thumbnail) {
          product.thumbnailUrl = await cloudService.getFile(product.thumbnail.key);
        }
      })
    );

    console.log('✅ Search result count:', searchResult.length);
    return searchResult;
  } catch (error) {
    console.error('❌ Search error:', error);
    throw new AppError(
      'Failed to search products',
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};