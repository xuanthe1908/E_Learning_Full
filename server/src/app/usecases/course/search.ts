import { CourseDbRepositoryInterface } from '../../../app/repositories/courseDbRepository';
import AppError from '../../../utils/appError';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import { CourseInterface } from '../../../types/courseInterface';
import { CloudServiceInterface } from '@src/app/services/cloudServiceInterface';

export const searchCourseU = async (
  searchQuery: string,
  filterQuery: string,
  cloudService: ReturnType<CloudServiceInterface>,
  courseDbRepository: ReturnType<CourseDbRepositoryInterface>
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
    const searchResult = await courseDbRepository.searchCourse(
      isFree,
      searchParams,
      filterQuery
    );

    // ✅ Add thumbnail URLs
    await Promise.all(
      searchResult.map(async (course) => {
        if (course.thumbnail) {
          course.thumbnailUrl = await cloudService.getFile(course.thumbnail.key);
        }
      })
    );

    console.log('✅ Search result count:', searchResult.length);
    return searchResult;
  } catch (error) {
    console.error('❌ Search error:', error);
    throw new AppError(
      'Failed to search courses',
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};