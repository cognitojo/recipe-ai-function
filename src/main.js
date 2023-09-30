// Import required modules
import { Client, Databases } from "node-appwrite";
import { createTransport } from "nodemailer";
import OpenAI from "openai";
import {
  convertIpToUID,
  generateEmailTemplate,
} from "/usr/local/server/src/function/src/utils.js";

// Destructure environment variables for easy access
const {
  APP_SMTP_HOST,
  APP_SMTP_PORT,
  APP_SMTP_USERNAME,
  APP_SMTP_PASSWORD,
  APPWRITE_FUNCTION_PROJECT_ID,
  APPWRITE_API_KEY,
  OPENAI_API_KEY,
  APP_DATABASE,
  APP_COLLECTION,
} = process.env;

// Set up email transporter using the provided SMTP details
const transporter = createTransport({
  host: APP_SMTP_HOST,
  port: APP_SMTP_PORT,
  auth: {
    user: APP_SMTP_USERNAME,
    pass: APP_SMTP_PASSWORD,
  },
});

// Main function
export default async ({ req, res, log, error }) => {
  // Initialize the Appwrite client with the appropriate configuration
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  // Initialize the Appwrite database and OpenAI client
  const database = new Databases(client);
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  // Extract required data from the request body
  const { ipAddress, email, prompts } = req.body;

  try {
    // Convert IP address to a unique ID
    const uid = convertIpToUID(ipAddress);

    // Fetch the document (if exists) from the database using the unique ID
    let entry;

    try {
        entry = await database.getDocument(APP_DATABASE, APP_COLLECTION, uid);
    } catch (err) {
        // If the document is not found, initialize 'entry' to null
        if (err.message === "Document with the requested ID could not be found.") {
            entry = null;
        } else {
            // For other errors, log and return an error response
            error(`Failed to fetch document: ${err.message}`);
            return res.send("Error fetching data", 500);
        }
    }

    // If the entry doesn't exist, create a new one
    if (!entry) {
      await database.createDocument(APP_DATABASE, APP_COLLECTION, uid, {
        ip: ipAddress.toString(),
        count: 0,
        timestamp: Date.now().toString(),
      });
      entry = { count: 1 };
    }

    // Rate limit check - if request count for the IP address is 3 or more, return an error
    if (entry.count >= 3) {
      return res.send("Rate limit exceeded", 429);
    }

    // Interact with OpenAI API to generate a recipe based on the provided ingredients
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that generates recipes. Only answer with receipe and detailed instructions and nothing else.  I have the following ingredients ${prompts}. Return as json in the following format: name, ingredients, instructions`,
        },
      ],
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract the generated recipe from the OpenAI response
    const responseData = response.choices[0].message.content;

    // If an email address was provided, send the generated recipe via email
    if (email) {
      const mailOptions = {
        from: APP_SMTP_USERNAME,
        to: email,
        subject: "Generated AI Recipe",
        html: generateEmailTemplate(responseData),
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) log(err);
        else log("Email sent: " + info.response);
      });
    }

    // Update the request count and timestamp for the given IP address in the database
    await database.updateDocument(APP_DATABASE, APP_COLLECTION, uid, {
      count: entry.count + 1,
      timestamp: Date.now().toString(),
    });

    // Return the generated recipe as a response
    return res.send(responseData, 200);
  } catch (e) {
    // Log any errors that occur and return a 500 error response
    error(`Failed to send email: ${e.message}`);
    return res.send("Failed to send email", 500);
  }
};
