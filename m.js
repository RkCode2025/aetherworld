// DOM Elements
const promptInput = document.getElementById("prompt");
const styleSelect = document.getElementById("style");
const wordCountInput = document.getElementById("wordCount");
const generateButton = document.getElementById("generate-button");
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");
const copyButton = document.getElementById("copy-button");

// Function to generate unsummary
const generateUnsummary = async (prompt, style, wordCount) => {
  try {
    const response = await fetch("http://localhost:5000/generate-unsummary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, style, wordCount }),
    });

    if (!response.ok) throw new Error("Failed to generate unsummary.");

    const data = await response.json();
    return data.unsummary;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Event listener for the Generate button
generateButton.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  const style = styleSelect.value;
  const wordCount = parseInt(wordCountInput.value);

  // Validation
  if (!prompt) {
    alert("⚠️ Please enter a prompt.");
    return;
  }

  if (wordCount < 50 || wordCount > 1000) {
    alert("⚠️ Word count must be between 50 and 1000.");
    return;
  }

  // Simulate loading
  generateButton.disabled = true;
  generateButton.textContent = "Generating...";

  try {
    // Call the backend to generate unsummary
    const unsummary = await generateUnsummary(prompt, style, wordCount);

    // Display the result
    resultText.textContent = unsummary;
    resultContainer.style.display = "block";
  } catch (error) {
    alert("❌ Failed to generate unsummary. Please try again.");
  } finally {
    // Reset button
    generateButton.disabled = false;
    generateButton.textContent = "Generate Text";
  }
});

// Copy to Clipboard
copyButton.addEventListener("click", () => {
  const unsummary = resultText.textContent;

  navigator.clipboard
    .writeText(unsummary)
    .then(() => {
      alert("Unsummary copied to clipboard!");
    })
    .catch((error) => {
      console.error("Failed to copy text:", error);
      alert("Failed to copy unsummary. Please try again.");
    });
});