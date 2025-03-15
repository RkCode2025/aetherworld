document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("defense-form");
  const topicInput = document.getElementById("topic");
  const wordCountSlider = document.getElementById("word-count");
  const wordCountValue = document.getElementById("word-count-value");
  const responseContainer = document.getElementById("response-container");
  const responseText = document.getElementById("response-text");
  const errorMessage = document.getElementById("error-message");
  const copyButton = document.getElementById("copy-button");
  const submitButton = document.getElementById("submit-button");

  let selectedStyle = "Serious Defense"; // Default style

  // Update word count display
  wordCountSlider.addEventListener("input", function () {
    wordCountValue.textContent = wordCountSlider.value;
  });

  // Handle style selection
  document.querySelectorAll(".style-option").forEach((option) => {
    option.addEventListener("click", function () {
      document.querySelectorAll(".style-option").forEach((el) => el.classList.remove("selected"));
      this.classList.add("selected");
      this.style.backgroundColor = "#ef4444"; // Highlight selected style in red
      selectedStyle = this.dataset.style;

      // Reset other styles to default
      document.querySelectorAll(".style-option").forEach((el) => {
        if (el !== this) el.style.backgroundColor = ""; // Reset non-selected styles
      });
    });
  });

  // Form submission
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    errorMessage.textContent = "";
    responseContainer.style.display = "none";

    const topic = topicInput.value.trim();
    const wordCount = parseInt(wordCountSlider.value, 10);

    if (!topic) {
      errorMessage.textContent = "⚠️ Please enter a topic.";
      return;
    }

    // Change button to "Defending..."
    submitButton.textContent = "Defending...";
    submitButton.style.backgroundColor = "grey";
    submitButton.disabled = true;

    try {
      const response = await fetch("http://127.0.0.1:5000/reverse-cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, style: selectedStyle, wordCount }),
      });

      const data = await response.json();

      if (response.ok) {
        responseText.textContent = data.defense;
        responseContainer.style.display = "block";
      } else {
        errorMessage.textContent = `⚠️ Error: ${data.error}`;
      }
    } catch (error) {
      errorMessage.textContent = "⚠️ Failed to connect to the server.";
    }

    // Reset button after response
    submitButton.textContent = "Defend This!";
    submitButton.style.backgroundColor = ""; // Reset button color
    submitButton.disabled = false;
  });

  // Copy to clipboard functionality
  copyButton.addEventListener("click", function () {
    navigator.clipboard.writeText(responseText.textContent).then(() => {
      copyButton.textContent = "Copied!";
      setTimeout(() => (copyButton.textContent = "Copy to Clipboard"), 2000);
    });
  });
});
