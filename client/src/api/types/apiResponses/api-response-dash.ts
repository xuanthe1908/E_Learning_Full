export interface DashData {
    numberOfproducts: number
    numbersellers: number
    numberOfcustomers: number
    monthlyRevenue: number
  }
  

  
  export interface GraphData {
    revenue: Revenue[]
    trendingproducts: TrendingCourse[]
    courseByCategory: CourseByCategory[]
  }
  
  export interface Revenue {
    month: string
    revenue: number
    productsAdded: number
    productsEnrolled: number
  }
  
  export interface TrendingCourse {
    title: string
    enrolled: number
  }
  
  export interface CourseByCategory {
    _id: string
    name: string
    courseCount: number
  }
  






















