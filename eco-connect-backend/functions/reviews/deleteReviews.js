import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
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

  try {
    const businessId = event.pathParameters?.id;
    const reviewId = event.pathParameters?.reviewid;

    // both keys are required to find the review in dynamodb
    if (!businessId || !reviewId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
        },
        body: JSON.stringify({ error: "Missing businessId or reviewId" }),
      };
    }

    // fetch the review first to check who wrote it
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "reviews",
        Key: { businesId: businessId, reviewId },
      })
    );

    // review not found
    if (!existing.Item) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
        },
        body: JSON.stringify({ error: "Review not found" }),
      };
    }

    // logged in user is not the one who wrote this review
    if (existing.Item.userId !== userId) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
        },
        body: JSON.stringify({ error: "Unauthorized - you did not write this review" }),
      };
    }

    // user is the author, safe to delete
    await dynamo.send(
      new DeleteCommand({
        TableName: "reviews",
        Key: { businesId: businessId, reviewId },
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify({ message: "Review deleted successfully" }),
    };

  } catch (error) {
    console.error("Delete error:", error);
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