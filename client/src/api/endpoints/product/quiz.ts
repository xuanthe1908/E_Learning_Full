import END_POINTS from "../../../constants/endpoints"
import { getCloudFrontVideoUrlService,getQuizzesByitemservice } from "../../services/product/quiz-service"

export const getCloudFrontUrl = (key:string)=>{
    return getCloudFrontVideoUrlService(END_POINTS.STREAM_VIDEO,key)
  }
  
  export const getQuizzesByItem = (itemId:string)=>{
    return getQuizzesByitemservice(END_POINTS.GET_QUIZZES_BY_ITEM,itemId)
  }
  






















