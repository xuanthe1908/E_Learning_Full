import AppError from '../../../utils/appError';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import { QuizDbInterface } from '../../repositories/quizDbRepository';
import { shuffleQuiz } from '../../../app/helper/shuffle';
import { QuizInterface } from '../../../types/quiz';

export const getQuizzesItemU = async (
  itemId: string,
  quizDbRepository: ReturnType<QuizDbInterface>
) => {
  if (!itemId) {
    throw new AppError('Item id not found', HttpStatusCodes.BAD_REQUEST);
  }
  const quizzes: QuizInterface | null =
    await quizDbRepository.getQuizByItemId(itemId);
    
  return shuffleQuiz(quizzes);
};
