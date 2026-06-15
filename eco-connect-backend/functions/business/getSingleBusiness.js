import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
};

export const handler = async (event) => {
  try {
    console.log("EVENT:", JSON.stringify(event));

    const businessId = event.pathParameters?.id;

    // businessId is required to fetch anything
    if (!businessId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing businessId in path" }),
      };
    }

    // fetch the business and all its reviews at the same time
    const [businessResult, reviewsResult] = await Promise.all([
      dynamo.send(
        new GetCommand({
          TableName: "Businesses",
          Key: { businessId },
        })
      ),
      dynamo.send(
        new QueryCommand({
          TableName: "Reviews",
          KeyConditionExpression: "businessId = :id",
          ExpressionAttributeValues: { ":id": businessId },
        })
      ),
    ]);

    // business not found
    if (!businessResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Business not found" }),
      };
    }

    // return the business along with its reviews in one response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        business: businessResult.Item,
        reviews: reviewsResult.Items || [],
      }),
    };

  } catch (error) {
    console.error("ERROR:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};