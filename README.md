# Appwrite Functions for Recipe Generation & Data Management

Harness the power of Appwrite 1.4 with this repository, which contains enhanced serverless functions tailored for recipe generation and data management.

Demo: - [Try out the demo!](https://recipe.globalsaas.app/)

## 🚀 Features

### 1. Recipe Generator Function:
- **AI-Powered Recipes**: Utilizes the OpenAI GPT-3.5-turbo model to dynamically generate unique recipes based on the ingredients you provide. It ensures that the output is not only relevant but also detailed, providing both ingredients and step-by-step instructions.
- **Rate Limiting**: Designed with protection mechanisms in mind, the function intelligently rate limits requests based on the IP address of the requester, ensuring fair usage and preventing abuse.
- **Email Notifications**: Optionally, once a recipe is generated, it can be sent directly to an email address provided in the request. This feature is particularly useful if you wish to share the recipe or save it for later use.

### 2. Data Cleanup Function:
- **Efficient Cleanup**: This function is your go-to solution for maintaining a clean slate in your Appwrite collection. It methodically traverses the specified collection and deletes all entries, effectively resetting the data.
- **Regular Maintenance**: Ideal for periodic data resets or cleanups. For example, if you're running a demo or test environment where you wish to purge data at regular intervals, this function is a perfect fit.

### 3. Custom Domain Support:
- **Brand Consistency**: With Appwrite 1.4, each function can be assigned its unique domain. By setting up a custom domain for your functions, you maintain brand consistency and provide a more professional appearance to your users.
- **Enhanced Security**: Using a custom domain often allows for better security practices, especially if combined with SSL certificates, ensuring that the data between the client and server remains encrypted and secure.

## 📋 Prerequisites
- Appwrite 1.4 or later.
- OpenAI account with API key for the GPT-3.5-turbo model.
- SMTP server for sending emails.
- A custom domain (if you wish to leverage the custom domain feature).

## 🛠️ Setup & Configuration
- **Environment Variables**:
    - SMTP related (`APP_SMTP_HOST`, `APP_SMTP_PORT`, `APP_SMTP_USERNAME`, `APP_SMTP_PASSWORD`).
    - Appwrite related (`APPWRITE_FUNCTION_PROJECT_ID`, `APPWRITE_API_KEY`, `APP_DATABASE`, `APP_COLLECTION`).
    - OpenAI (`OPENAI_API_KEY`).
- **Deploying the Function**:
    - Use the Appwrite Console or CLI to deploy the function.
    - With Appwrite 1.4, link your GitHub repository for seamless deployments!
- **Setting Up CRON (Optional)**:
    - For periodic execution of the data cleanup function, set a CRON job.
    - For execution every minute: `* * * * *`.
- **Custom Domain Setup**:
    - Configure your custom domain within Appwrite to point to your function. Ensure that you have an SSL certificate if you wish to serve over HTTPS.

## 📚 Usage
- **Recipe Generator**:
    - POST request to the function's endpoint.
    - Include `ipAddress`, `email` (optional), and `prompts` (ingredient list) in the body.
- **Data Cleanup**:
    - Trigger the function to purge all documents in the specified collection.

## 📣 Feedback & Contributions
Your feedback is invaluable! Issues, pull requests, or feedback about the functions are welcome.

## 🔗 Useful Links
- [Appwrite's Official Documentation](https://appwrite.io/docs)
- [Appwrite's Discord Server](https://discord.gg/appwrite)

Happy Coding! 🎉
