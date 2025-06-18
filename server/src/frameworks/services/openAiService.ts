import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

interface AIServiceConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export const openAiService = (config: AIServiceConfig) => {
  const openai = new OpenAI({
    apiKey: config.apiKey
  });

  const generateResponse = async (
  messages: ChatCompletionMessageParam[],
  context?: any
) => {
    try {
      const systemPrompt = `Bạn là một trợ lý AI thông minh chuyên hỗ trợ học tập trực tuyến tại TutorTrek. 
      Nhiệm vụ của bạn:
      1. Trả lời câu hỏi về học tập, giải thích kiến thức một cách rõ ràng và dễ hiểu
      2. Hỗ trợ giảng viên trong việc tạo nội dung giảng dạy, đề thi, bài tập
      3. Giúp học sinh hiểu bài học, làm bài tập và ôn thi
      4. Đưa ra gợi ý học tập phù hợp với trình độ từng người
      5. Hỗ trợ cả tiếng Việt và tiếng Anh
      6. Giải thích các khái niệm phức tạp theo cách đơn giản, có ví dụ cụ thể
      7. Khuyến khích tư duy phản biện và học tập chủ động
      
      ${context?.courseId ? `Ngữ cảnh hiện tại: Đang hỗ trợ trong khóa học có ID ${context.courseId}` : ''}
      ${context?.lessonId ? `, bài học có ID ${context.lessonId}` : ''}
      
      Hãy trả lời một cách hữu ích, chính xác, thân thiện và phù hợp với ngữ cảnh học tập.
      Nếu không chắc chắn về thông tin, hãy thừa nhận và đưa ra gợi ý tìm hiểu thêm.`;

      const completion = await openai.chat.completions.create({
        model: config.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: config.maxTokens || 1000,
        temperature: config.temperature || 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      const responseContent = completion.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('Không nhận được phản hồi từ AI');
      }

      return {
        success: true,
        content: responseContent,
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0
        }
      };
    } catch (error: any) {
      console.error('OpenAI Service Error:', error);
      
      let errorMessage = 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
      
      if (error.status === 429) {
        errorMessage = 'Hệ thống đang quá tải. Vui lòng thử lại sau vài phút.';
      } else if (error.status === 401) {
        errorMessage = 'Lỗi xác thực API. Vui lòng liên hệ quản trị viên.';
      } else if (error.status === 400) {
        errorMessage = 'Yêu cầu không hợp lệ. Vui lòng thử lại với câu hỏi khác.';
      }

      return {
        success: false,
        content: errorMessage,
        error: error.message
      };
    }
  };

  const generateTitle = async (firstMessage: string) => {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tạo tiêu đề ngắn gọn (tối đa 30 ký tự) bằng tiếng Việt cho cuộc trò chuyện dựa trên tin nhắn đầu tiên của người dùng. Tiêu đề phải súc tích và phản ánh nội dung chính.'
          },
          {
            role: 'user',
            content: firstMessage
          }
        ],
        max_tokens: 50,
        temperature: 0.5,
      });

      const title = completion.choices[0]?.message?.content?.trim();
      return title || 'Chat mới';
    } catch (error) {
      console.error('Title generation error:', error);
      return 'Chat mới';
    }
  };

  const analyzeQuery = async (query: string) => {
    try {
      // Phân tích ý định của câu hỏi đơn giản
      const categories = {
        homework: ['bài tập', 'homework', 'assignment', 'làm bài', 'exercise'],
        explanation: ['giải thích', 'explain', 'what is', 'là gì', 'tại sao', 'why', 'how'],
        course: ['khóa học', 'course', 'môn học', 'subject', 'curriculum'],
        quiz: ['quiz', 'test', 'kiểm tra', 'bài kiểm tra', 'thi', 'exam'],
        programming: ['code', 'coding', 'lập trình', 'javascript', 'python', 'java', 'html', 'css'],
        math: ['toán', 'math', 'mathematics', 'phương trình', 'equation', 'tính toán'],
        general: ['help', 'giúp', 'hỗ trợ', 'support', 'hello', 'xin chào']
      };

      const queryLower = query.toLowerCase();
      
      for (const [category, keywords] of Object.entries(categories)) {
        const matchCount = keywords.filter(keyword => queryLower.includes(keyword)).length;
        if (matchCount > 0) {
          return { 
            category, 
            confidence: Math.min(0.9, 0.6 + (matchCount * 0.1)),
            keywords: keywords.filter(keyword => queryLower.includes(keyword))
          };
        }
      }

      return { category: 'general', confidence: 0.5, keywords: [] };
    } catch (error) {
      console.error('Query analysis error:', error);
      return { category: 'general', confidence: 0.5, keywords: [] };
    }
  };

  return {
    generateResponse,
    generateTitle,
    analyzeQuery
  };
};