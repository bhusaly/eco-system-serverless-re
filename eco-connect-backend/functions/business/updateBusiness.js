import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

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

    // fetch the business first to check ownership
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

    // logged in user is not the owner, block the update
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

    const body = JSON.parse(event.body);

    // user is the owner, safe to update the fields
    const result = await dynamo.send(
      new UpdateCommand({
        TableName: "business",
        Key: { businessId },
        UpdateExpression: "set businessName = :name, category = :category, description = :description",
        ExpressionAttributeValues: {
          ":name": body.name,
          ":category": body.category,
          ":description": body.description,
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