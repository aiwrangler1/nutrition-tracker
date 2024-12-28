export const asyncErrorHandler = async <T>(
  asyncFn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Async operation failed:', error, context);
    throw error;
  }
}; 