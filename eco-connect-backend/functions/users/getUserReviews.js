import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
const userId = event.requestContext?.authorizer?.claims?.sub;

  // no token, tell frontend to redirect to login
  if (!userId) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify({ error: "Unauthorized - please login", redirect: "/login" }),
    };
  }

  try {
    // scan the reviews table and filter by the logged in user's id
    const data = await docClient.send(
      new ScanCommand({ TableName: "reviews" })
    );

    // only return reviews that belong to this user
    const userReviews = (data.Items || []).filter(
      (item) => item.userId === userId
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
      body: JSON.stringify(userReviews),
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