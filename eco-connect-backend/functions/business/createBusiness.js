import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {

const userId = event.requestContext?.authorizer?.claims?.sub;
    // Reject the request if no valid user id present
    if (!userId) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
        },
        body: JSON.stringify({ error: "Unauthorized - no valid session" }),
      };
    }

    const body = JSON.parse(event.body);

    const item = {
      businessId: Date.now().toString(),
      name: body.name,
      category: body.category,
      description: body.description,
      userId,
    };

    await dynamo.send(new PutCommand({ TableName: "business", Item: item }));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify(item),
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