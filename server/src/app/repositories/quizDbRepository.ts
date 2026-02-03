import { QuizRepositoryMongoDbInterface } from "@src/frameworks/database/mongodb/repositories/quizzDbRepository";
import { AddQuizInfoInterface, EditQuizInfoInterface } from '@src/types/productInterface';

export const quizDbRepository = (repository:ReturnType<QuizRepositoryMongoDbInterface>) =>{

    const addQuiz = async (quiz:AddQuizInfoInterface)=>await repository.addQuiz(quiz)

    const editQuiz = async (itemId:string,quiz:EditQuizInfoInterface) => repository.editQuiz(itemId,quiz)

    const getQuizByItemId = async (itemId:string)=>await repository.getQuizByItemId(itemId)

    return {
        addQuiz,
        editQuiz,
        getQuizByItemId
    }

}

export type QuizDbInterface = typeof quizDbRepository