/**
 * Generates an email template containing a recipe.
 * 
 * @param {string} recipeJSON - The JSON string representation of the recipe.
 * @returns {string} - The HTML string for the email content.
 */
export function generateEmailTemplate(recipeJSON) {
    const recipe = JSON.parse(recipeJSON);
  
    const ingredientsList = recipe.ingredients
      .map((ingredient) => `<li>${ingredient}</li>`)
      .join('');
  
    const instructionsList = recipe.instructions
      .map((instruction) => `<ol>${instruction}</ol>`)
      .join('');
  
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${generateStyles()}
      </head>
      <body>
        <div class="recipe">
          <h1>${recipe.name}</h1>
          <h2>Ingredients</h2>
          <ul>${ingredientsList}</ul>
          <h2>Instructions</h2>
          <ol>${instructionsList}</ol>
        </div>
      </body>
      </html>
    `;
  }
  
  /**
   * Generates CSS styles for the email template.
   * 
   * @returns {string} - The CSS styles for the email content.
   */
  function generateStyles() {
    return `
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .recipe {
          border: 1px solid #e0e0e0;
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        h1, h2 {
          color: #333;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        h2 {
          font-size: 20px;
          margin-top: 20px;
        }
        ul, ol {
          padding-left: 40px;
        }
      </style>
    `;
  }
  
  /**
   * Converts an IP address to a unique identifier.
   * 
   * @param {string} ip - The IP address to convert.
   * @returns {string} - The unique identifier derived from the IP address.
   */
  export function convertIpToUID(ip) {
    let uid = ip.replace(/\./g, "_");
    uid = uid.startsWith("_") ? "a" + uid : uid;
    return uid.slice(0, 36);
  }
  
