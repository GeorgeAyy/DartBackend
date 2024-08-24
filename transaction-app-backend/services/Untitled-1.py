import pandas as pd
import google.generativeai as genai
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import re
import sys
import os

print("Python script started.")

# Step 1: Load the CSV file into a DataFrame
file_path = sys.argv[1]  # Get the input file path from command-line argument
output_file_path = sys.argv[2]  # Get the output file path from command-line argument

print(f"Input file path: {file_path}")
print(f"Output file path: {output_file_path}")

if not os.path.exists(file_path):
    print(f"Error: Input file does not exist at {file_path}")
    sys.exit(1)

# Load the CSV file
transactions_df = pd.read_csv(file_path)

# Clean and validate the Amount_Spent column
def clean_amount(amount):
    try:
        # Try to convert to a float
        return float(amount)
    except ValueError:
        # If conversion fails, return NaN
        return float('nan')

# Apply cleaning to Amount_Spent column
if 'Amount_Spent' in transactions_df.columns:
    transactions_df['Amount_Spent'] = transactions_df['Amount_Spent'].apply(clean_amount)
    # Remove rows where 'Amount_Spent' is NaN
    transactions_df = transactions_df.dropna(subset=['Amount_Spent'])
else:
    print("Error: 'Amount_Spent' column not found in the dataset.")
    sys.exit(1)

# Step 2: Configure the Gemini API with your API key
api_key = "AIzaSyDOExmBe0spo7h7PXGRbFqiPRPzfn5FdxE"  # Replace with your actual API key
genai.configure(api_key=api_key)

# Step 3: Extract unique transaction types
unique_transaction_types = transactions_df['Transaction_Type'].unique()

# Step 4: Send all unique transaction types in a single prompt with a structured format request
bulk_prompt = """
Categorize the following transaction types and return the results in a JSON format where each category is a key and the transaction types that belong to that category are listed as an array of values. For example:
{
  "Transportation": ["Uber", "Taxi"],
  "Food": ["Restaurant", "Grocery Store"],
  ...
}
Do not leave out any transaction type and do not use other by any means categorize everything.
Transaction types:
"""
bulk_prompt += "\n".join(unique_transaction_types)

response = genai.generate_text(
    model="models/text-bison-001",  # Use the appropriate model name
    prompt=bulk_prompt
)

# Step 5: Print the raw response for debugging
print("Raw response from the model:")
print(response.result)

# Step 6: Manual parsing of the response
# Remove any problematic characters that might interfere with JSON parsing
raw_response = response.result.strip()

# Use regex to find all the category names and their associated transaction types
category_mapping = {}
category_pattern = r'\"(.*?)\":\s*\[(.*?)\]'
matches = re.findall(category_pattern, raw_response, re.DOTALL)

for match in matches:
    category = match[0]
    transactions = re.findall(r'\"(.*?)\"', match[1])
    category_mapping[category] = transactions

# Step 7: Create a reverse mapping from transaction type to category
transaction_to_category = {}
for category, transactions in category_mapping.items():
    for transaction in transactions:
        transaction_to_category[transaction] = category

# Step 8: Assign categories to the dataset
transactions_df['Gemini_Category'] = transactions_df['Transaction_Type'].map(transaction_to_category)

# Step 9: Handle NaN values in 'Gemini_Category' (replace with "other" if any)
transactions_df['Gemini_Category'].fillna('other', inplace=True)

# Step 10: Train a machine learning model on the categorized data
model = make_pipeline(CountVectorizer(), MultinomialNB())

X_train, X_test, y_train, y_test = train_test_split(
    transactions_df['Transaction_Type'], transactions_df['Gemini_Category'], test_size=0.2, random_state=42
)

model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Model accuracy: {accuracy * 100:.2f}%")

# Step 11: Predict categories for new transaction types
new_transaction_types = ["New Transaction 1", "New Transaction 2"]
predicted_categories = model.predict(new_transaction_types)
print("Predicted categories for new transactions:", predicted_categories)

# Step 12: Save the updated DataFrame with categories to the specified output path
# Log the paths for debugging
print(f"Saving the updated dataset to: {output_file_path}")

try:
    transactions_df.to_csv(output_file_path, index=False)
    print(f"Updated dataset saved successfully to '{output_file_path}'")
except Exception as e:
    print(f"Error saving the file: {e}")
    sys.exit(1)  # Exit with an error code if something goes wrong

sys.exit(0)
