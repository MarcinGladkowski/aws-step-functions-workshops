import { Context } from "aws-lambda";
import { ScanCvEvent, ScanCvScoreEvent } from "../types";
import { winstonLogger as logger } from "../../../shared/logger";
import { createConfig } from "./config";

const config = createConfig(process.env);

function calculateScore(event: Required<ScanCvEvent>): number {
  if (event.isExcluded) {
    return 0;
  }

  return event.cloudExperience + event.nodeExperience + event.itExperience;
}

export const handle = async (event: ScanCvEvent[], _context: Context) => {
  logger.info(`Handling event: ${JSON.stringify(event)}`);

  const singleEvent: Required<ScanCvEvent> = event.reduce((obj, currentValue) => {
    return {
      ...obj,
      ...currentValue,
    };
  }, {} as any);

  const scoreEvent: ScanCvScoreEvent = {
    calculatedScore: calculateScore(singleEvent),
    source: `${config.inputBucketName}/${singleEvent.key}`,
    key: singleEvent.key
  };

  logger.info(`Single event: ${JSON.stringify(singleEvent)}`);
  logger.info(`Config: ${JSON.stringify(config)}`);

  return scoreEvent;
};
