import mongoose from 'mongoose';
import Quiz from '../models/quiz';
import { QuizInterface } from '@src/types/quiz';

import { AddQuizInfoInterface, EditQuizInfoInterface } from '@src/types/productInterface';

export const quizRepositoryMongodb = () => {
  const getQuizByItemId = async (itemId: string) => {
    const quiz: QuizInterface | null = await Quiz.findOne({
      itemId: new mongoose.Types.ObjectId(itemId)
    });
    return quiz;
  };

  const addQuiz = async (quiz: AddQuizInfoInterface) => {
    const newQuiz = new Quiz(quiz);
    const { _id: quizId } = await newQuiz.save();
    return quizId;
  };

  const editQuiz = async (itemId: string, quizInfo: EditQuizInfoInterface) => {
    await Quiz.updateOne(
      { itemId: new mongoose.Types.ObjectId(itemId) },
      { ...quizInfo }
    );
  };

  return {
    addQuiz,
    editQuiz,
    getQuizByItemId
  };
};

export type QuizRepositoryMongoDbInterface = typeof quizRepositoryMongodb;
