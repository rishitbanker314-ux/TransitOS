import * as logger from "firebase-functions/logger";

export const logInfo = (message: string, payload?: any) => {
  logger.info(message, { structuredData: true, ...payload });
};

export const logError = (message: string, error?: any) => {
  logger.error(message, { structuredData: true, error });
};
