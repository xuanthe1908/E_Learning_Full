export const aiServiceInterface = (service: ReturnType<typeof aiServiceImplementation>) => {
  const generateResponse = async (
    messages: Array<{ role: string; content: string }>,
    context?: any
  ) => service.generateResponse(messages, context);

  const generateTitle = async (firstMessage: string) => service.generateTitle(firstMessage);

  const analyzeQuery = async (query: string) => service.analyzeQuery(query);

  return {
    generateResponse,
    generateTitle,
    analyzeQuery
  };
};

export const aiServiceImplementation = (config: any) => {
  const generateResponse = async (
    messages: Array<{ role: string; content: string }>,
    context?: any
  ) => {
    // Implementation sẽ được inject từ openAiService
    throw new Error('generateResponse implementation not provided');
  };

  const generateTitle = async (firstMessage: string) => {
    // Implementation sẽ được inject từ openAiService
    throw new Error('generateTitle implementation not provided');
  };

  const analyzeQuery = async (query: string) => {
    // Implementation sẽ được inject từ openAiService
    throw new Error('analyzeQuery implementation not provided');
  };

  return {
    generateResponse,
    generateTitle,
    analyzeQuery
  };
};