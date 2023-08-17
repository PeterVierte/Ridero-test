export const createSuccessLog = (
  fileName: string,
  operationTime: number,
  operationMemory: number,
) => {
  return {
    fileName,
    operationMemory: `${operationMemory} bytes`,
    operationTime: `${Math.round(operationTime)} ms`,
    date: new Date(),
  };
};

export const createErrorLog = (message: string) => {
  return {
    date: new Date(),
    message: message,
  };
};
