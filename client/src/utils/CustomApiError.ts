class CustomApiError extends Error {
    private data: any;
  
    constructor(message: string, customData: any) {
      super(message);
      this.name = this.constructor.name;
      this.data = customData;
  
      Object.setPrototypeOf(this, CustomApiError.prototype);
    }
  
    getCustomData(): any {
      return this.data;
    }
  }

  export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof CustomApiError) {
      return error.getCustomData()?.message || error.message || fallback;
    }
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return axiosError.response?.data?.message || fallback;
    }
    return fallback;
  };

  export const getApiErrorStatus = (error: unknown): number | undefined => {
    if (error instanceof CustomApiError) {
      const statusMatch = error.message.match(/status (\d+)/);
      if (statusMatch) return Number(statusMatch[1]);
      if (error.message === 'Unauthorized') return 401;
      if (error.message === 'Not Found') return 404;
      return undefined;
    }
    if (error && typeof error === 'object' && 'response' in error) {
      return (error as { response?: { status?: number } }).response?.status;
    }
    return undefined;
  };
  
  export default CustomApiError;
  