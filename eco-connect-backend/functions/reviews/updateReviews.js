import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  // get user id from cognito token
  const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;

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
    const reviewId = event.pathParameters?.id;
    const body = JSON.parse(event.body);
    const { businessId, comment } = body;

    // fetch the review first to check who wrote it
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "Reviews",
        Key: { businessId, reviewId },
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

    // user is the author, safe to update the comment
    const result = await dynamo.send(
      new UpdateCommand({
        TableName: "reviews",
        Key: { businessId, reviewId },
        UpdateExpression: "set comment = :comment",
        ExpressionAttributeValues: {
          ":comment": comment,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify(result.Attributes),
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