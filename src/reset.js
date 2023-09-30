import { Client, Databases } from "node-appwrite";

const {
  APPWRITE_FUNCTION_PROJECT_ID,
  APPWRITE_API_KEY,
  APP_DATABASE,
  APP_COLLECTION
} = process.env;

/**
 * Deletes all documents in the specified Appwrite collection.
 * 
 * @param {object} context - The execution context containing response and error handlers.
 * @param {function} context.res - The response handler.
 * @param {function} context.error - The error handler.
 */
export default async ({ res, error }) => {
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  const database = new Databases(client);

  try {
    // Retrieve all documents in the collection
    const { documents } = await database.listDocuments(APP_DATABASE, APP_COLLECTION);

    // Delete each document in the collection
    for (const doc of documents) {
      await database.deleteDocument(APP_DATABASE, APP_COLLECTION, doc.$id);
    }

    return res.send("All data in the collection has been deleted.", 200);
  } catch (e) {
    error(`Failed to delete data: ${e.message}`);
    return res.send("Failed to delete data", 500);
  }
};
