import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

export class TestDatabaseSetup {
  private static client = new DynamoDBClient({
    region: process.env.AWS_REGION || "eu-west-1",
    endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummy",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummy",
    },
  });

  static async createEpisodesTable(): Promise<void> {
    const tableName = process.env.EPISODES_TABLE || "Episodes";

    try {
      // Check if table exists
      const listResult = await this.client.send(new ListTablesCommand({}));
      if (listResult.TableNames?.includes(tableName)) {
        return; // Table already exists
      }

      // Create table
      await this.client.send(
        new CreateTableCommand({
          TableName: tableName,
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "N", // Number type
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
        }),
      );

      // Wait for table to be created
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error creating Episodes table:", error);
      throw error;
    }
  }

  static async cleanupEpisodesTable(): Promise<void> {
    const tableName = process.env.EPISODES_TABLE || "Episodes";

    try {
      await this.client.send(new DeleteTableCommand({ TableName: tableName }));
      // Wait for table to be deleted
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      // Table might not exist, which is fine for cleanup
      console.log("Table cleanup completed (table may not have existed)");
    }
  }
}
