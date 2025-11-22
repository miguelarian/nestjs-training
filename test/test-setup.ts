import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import { GenericContainer, StartedTestContainer } from "testcontainers";

export class TestDatabaseSetup {
  private static client: DynamoDBClient;
  private static container: StartedTestContainer;

  static async startDynamoDBContainer(): Promise<void> {
    // Start DynamoDB Local container
    this.container = await new GenericContainer("amazon/dynamodb-local:latest")
      .withExposedPorts(8000)
      .withCommand(["-jar", "DynamoDBLocal.jar", "-sharedDb", "-inMemory"])
      .start();

    const dynamoDbPort = this.container.getMappedPort(8000);
    const dynamoDbHost = this.container.getHost();

    // Initialize DynamoDB client with container endpoint
    this.client = new DynamoDBClient({
      region: "us-east-1",
      endpoint: `http://${dynamoDbHost}:${dynamoDbPort}`,
      credentials: {
        accessKeyId: "dummy",
        secretAccessKey: "dummy",
      },
    });

    // Set environment variables for the application
    process.env.DYNAMODB_ENDPOINT = `http://${dynamoDbHost}:${dynamoDbPort}`;
    process.env.AWS_REGION = "us-east-1";
    process.env.AWS_ACCESS_KEY_ID = "dummy";
    process.env.AWS_SECRET_ACCESS_KEY = "dummy";
  }

  static async stopDynamoDBContainer(): Promise<void> {
    if (this.container) {
      await this.container.stop();
    }
  }

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
    } catch (err) {
      console.error("Error creating Episodes table:", err);
      throw err;
    }
  }

  static async cleanupEpisodesTable(): Promise<void> {
    const tableName = process.env.EPISODES_TABLE || "Episodes";

    try {
      await this.client.send(new DeleteTableCommand({ TableName: tableName }));
      // Wait for table to be deleted
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      // Table might not exist, which is fine for cleanup
      console.log("Table cleanup completed (table may not have existed)", err);
    }
  }
}
