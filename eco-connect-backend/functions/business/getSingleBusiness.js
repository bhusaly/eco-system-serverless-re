import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "http://localhost:5173/",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
};

export const handler = async (event) => {
  try {
  
    console.log("EVENT:", JSON.stringify(event));

    const businessId = event.pathParameters?.id;

    if (!businessId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing businessId in path" }),
      };
    }

    const result = await dynamo.send(
      new GetCommand({
        TableName: "business",
        Key: {
          businessId: businessId,
        },
      })
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "Business not found" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal vercel Error",
        error: error,
      }),
    };
  }
};