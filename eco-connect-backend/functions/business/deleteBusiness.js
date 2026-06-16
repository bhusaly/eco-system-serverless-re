import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    // get user id from cognito token
const userId = event.requestContext?.authorizer?.claims?.sub;

    // no token, block the request
    if (!userId) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
        },
        body: JSON.stringify({ error: "Unauthorized - please login" }),
      };
    }

    const businessId = event.pathParameters?.id;

    // fetch the business first so we can check who owns it
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "business",
        Key: { businessId },
      })
    );

    // business not found
    if (!existing.Item) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
        },
        body: JSON.stringify({ error: "Business not found" }),
      };
    }

    // logged in user is not the owner, block the delete
    if (existing.Item.userId !== userId) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
        },
        body: JSON.stringify({ error: "Unauthorized - you did not create this business" }),
      };
    }

    // user is the owner, safe to delete
    await dynamo.send(
      new DeleteCommand({
        TableName: "business",
        Key: { businessId },
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Deleted successfully" }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};