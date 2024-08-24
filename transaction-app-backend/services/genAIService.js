const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDOExmBe0spo7h7PXGRbFqiPRPzfn5FdxE");
//log the key

// Initialize the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const predictCategory = async (transactionType, existingCategories) => {
  console.log("Starting category prediction...");
  console.log("Transaction Type:", transactionType);
  console.log("Existing Categories:", existingCategories);

  try {
    const prompt = `
      Categorize the following transaction type: "${transactionType}".
      Existing categories: ${existingCategories.join(", ")}.
      If it fits an existing category, return the category name. 
      Otherwise, suggest a new category.
      
      Please respond with only the category name in the format: 
      "Category: <category name>"
    `;

    console.log("Generated Prompt:", prompt);

    // Generate content using the AI model
    const result = await model.generateContent([prompt]);
    console.log("Raw Result:", result);

    // Assuming the response is in the format "Category: <category name>"
    const text = result.response.text().trim();

    // Extracting just the category name from the response
    const categoryMatch = text.match(/Category:\s*(.*)/);
    const category = categoryMatch ? categoryMatch[1].trim() : "Uncategorized";

    console.log("Predicted Category:", category);

    return category;
  } catch (error) {
    console.error("Error generating category:", error);
    return "Uncategorized";
  }
};
const generateAIReportSummary = async (reportData) => {
  console.log("Starting AI report generation...");
  console.log("Report Data:", reportData);

  try {
    // Construct the prompt for the AI model
    const prompt = `
      Please generate a neatly formatted financial report summary based on the following data:

      **Total Expenditure:** $${reportData.totalSpent}
      **Category Breakdown:**
      ${Object.entries(reportData.categoryBreakdown)
        .map(([category, amount]) => `- ${category}: $${amount}`)
        .join("\n")}

      Please format the response in Markdown with the following structure:
      1. **Summary**: Briefly summarize the key points.
      2. **Insights**: Provide insights on spending patterns.
      3. **Anomalies**: Highlight any unusual or concerning spending patterns.
      4. **Recommendations**: Offer suggestions for better financial management.
      5. **Conclusion**: Summarize the overall financial health based on the report.
    `;

    console.log("Generated Prompt:", prompt);

    // Generate content using the AI model
    const result = await model.generateContent([prompt]);
    console.log("Raw Result:", result);

    // Extracting the summary from the response
    const summary = result.response.text().trim();

    console.log("Generated AI Summary:", summary);

    return summary;
  } catch (error) {
    console.error("Error generating AI report summary:", error);
    return "An error occurred while generating the summary.";
  }
};

const generateAIForecastAndAdvice = async ({ forecastPrompt }) => {
  console.log("Starting AI forecast generation...");
  console.log("Forecast Prompt:", forecastPrompt);

  try {
    // Generate content using the AI model
    const result = await model.generateContent([forecastPrompt]);
    console.log("Raw Result:", result);

    // Extracting the forecast and advice from the response
    const forecastSummary = result.response.text().trim();

    console.log("Generated AI Forecast and Advice:", forecastSummary);

    return forecastSummary;
  } catch (error) {
    console.error("Error generating AI forecast and advice:", error);
    return "An error occurred while generating the forecast.";
  }
};

module.exports = {
  predictCategory,
  generateAIReportSummary,
  generateAIForecastAndAdvice,
};
