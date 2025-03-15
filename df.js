// DOM Elements
const situationInput = document.getElementById("situation");
const generateButton = document.getElementById("generate-button");
const errorMessage = document.getElementById("error-message");
const resultContainer = document.getElementById("result-container");
const excuseText = document.getElementById("excuse-text");
const copyButton = document.getElementById("copy-button");

// Generate Excuse
generateButton.addEventListener("click", async () => {
  const situation = situationInput.value.trim();

  if (!situation) {
    errorMessage.textContent = "⚠️ Please enter a situation.";
    return;
  }

  generateButton.disabled = true;
  generateButton.textContent = "Thinking...";
  errorMessage.textContent = "";
  resultContainer.style.display = "none";

  try {
    // Mock API call (replace with actual API call)
    const mockResponse = await new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          excuse: `I'm sorry, but I can't do that because ${situation} is just too overwhelming for me right now.`,
        });
      }, 2000)
    );

    excuseText.textContent = mockResponse.excuse;
    resultContainer.style.display = "block";
  } catch (error) {
    errorMessage.textContent = "❌ Failed to generate an excuse. Please try again.";
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = "Generate Excuse";
  }
});

// Copy to Clipboard
copyButton.addEventListener("click", () => {
  const excuse = excuseText.textContent;

  navigator.clipboard
    .writeText(excuse)
    .then(() => {
      alert("Excuse copied to clipboard!");
    })
    .catch((error) => {
      console.error("Failed to copy text:", error);
      alert("Failed to copy excuse. Please try again.");
    });
});