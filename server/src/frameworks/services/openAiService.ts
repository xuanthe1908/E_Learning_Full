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
        model: config.model || 'gpt-4o-mini',
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
    // ✅ Cải thiện prompt để tạo title hay hơn
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tạo tiêu đề ngắn gọn và thu hút (15-40 ký tự) bằng tiếng Việt cho cuộc trò chuyện học tập dựa trên câu hỏi đầu tiên của học sinh.
            Quy tắc:
            - Tối đa 40 ký tự
            - Sử dụng tiếng Việt tự nhiên
            - Phản ánh chủ đề chính của câu hỏi
            - Tránh từ chung chung như "câu hỏi về...", "hỏi về..."
            - Ưu tiên từ khóa quan trọng

            Ví dụ:
            - Input: "Giải thích thuật toán sắp xếp nổi bọt" → "Thuật toán sắp xếp nổi bọt"
            - Input: "Làm thế nào để tính đạo hàm của hàm số" → "Tính đạo hàm hàm số"
            - Input: "React hooks là gì và cách sử dụng" → "React Hooks cơ bản"
            - Input: "Phân tích tác phẩm Số đỏ của Vũ Trọng Phụng" → "Phân tích Số đỏ"
            - Input: "Giúp tôi làm bài tập toán lớp 12" → "Bài tập Toán 12"`
        },
        {
          role: 'user',
          content: firstMessage
        }
      ],
      max_tokens: 30,
      temperature: 0.3, // Giảm temperature để title ổn định hơn
    });

    let title = completion.choices[0]?.message?.content?.trim();
    
    if (!title) return 'Chat mới';
    
    // ✅ Làm sạch title
    title = title.replace(/"/g, '').replace(/"/g, '').replace(/"/g, '');
    
    // ✅ Giới hạn độ dài
    if (title.length > 40) {
      title = title.substring(0, 37) + '...';
    }
    
    // ✅ Fallback nếu title quá ngắn hoặc không phù hợp
    if (title.length < 3 || title.toLowerCase().includes('tiêu đề')) {
      return generateSimpleTitle(firstMessage);
    }
    
    return title;
  } catch (error) {
    console.error('Title generation error:', error);
    return generateSimpleTitle(firstMessage);
  }
};

// ✅ Hàm tạo title đơn giản khi AI lỗi
const generateSimpleTitle = (message: string): string => {
  const cleanMessage = message.trim().toLowerCase();
  
  // Tạo title dựa trên từ khóa
  const keywords = {
    'toán': 'Câu hỏi Toán học',
    'math': 'Câu hỏi Toán học', 
    'lập trình': 'Lập trình',
    'programming': 'Lập trình',
    'javascript': 'JavaScript',
    'python': 'Python',
    'react': 'React',
    'nodejs': 'Node.js',
    'html': 'HTML/CSS',
    'css': 'HTML/CSS',
    'văn học': 'Văn học',
    'literature': 'Văn học',
    'lịch sử': 'Lịch sử',
    'history': 'Lịch sử',
    'tiếng anh': 'Tiếng Anh',
    'english': 'Tiếng Anh',
    'physics': 'Vật lý',
    'vật lý': 'Vật lý',
    'chemistry': 'Hóa học',
    'hóa học': 'Hóa học',
    'biology': 'Sinh học',
    'sinh học': 'Sinh học'
  };
  
  for (const [keyword, title] of Object.entries(keywords)) {
    if (cleanMessage.includes(keyword)) {
      return title;
    }
  }
  
  // Lấy 3-4 từ đầu tiên làm title
  const words = message.trim().split(' ').slice(0, 4);
  let simpleTitle = words.join(' ');
  
  if (simpleTitle.length > 30) {
    simpleTitle = simpleTitle.substring(0, 27) + '...';
  }
  
  return simpleTitle || 'Chat mới';
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