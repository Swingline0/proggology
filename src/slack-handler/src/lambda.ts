import Proggology from "./Controllers/Proggology";
import { APIGatewayProxyResult } from 'aws-lambda';

const proggology = new Proggology();

export async function handler(): Promise<APIGatewayProxyResult> {
  return {
    body: JSON.stringify({
      text: proggology.getText(),
      response_type: 'in_channel',
      mrkdwn: true
    }),
    statusCode: 200,
  };
}


