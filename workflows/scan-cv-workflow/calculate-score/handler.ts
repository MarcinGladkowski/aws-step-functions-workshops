import { Context } from "aws-lambda";
import { ScanCvEvent } from "../types";
import { winstonLogger as logger } from "../../../shared/logger";
import { createConfig } from "./config";

const config = createConfig(process.env);

export const handle = async (event: ScanCvEvent[], _context: Context) => {
  logger.info(`Handling event: ${JSON.stringify(event)}`);

  const singleEvent: Required<ScanCvEvent> = event.reduce((obj, currentValue) => {
    return {
      ...obj,
      ...currentValue,
    };
  }, {} as any);

  logger.info(`Single event: ${JSON.stringify(singleEvent)}`);
  // calculate total score - if excluded - 0, else sum points
  let calculatedScore = 0;

  if (!singleEvent.isExcluded) {
    calculatedScore = singleEvent.cloudExperience + singleEvent.nodeExperience + singleEvent.itExperience
  }

  logger.info(`Score has been calculated for ${config.inputBucketName}/${singleEvent.key}`);
  logger.info(`Score: ${calculatedScore}`)
  return event;
};
