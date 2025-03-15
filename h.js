document.addEventListener("DOMContentLoaded", () => {
    const generateButton = document.getElementById("generate-button");
    const promptInput = document.getElementById("prompt");
    const timelineContainer = document.getElementById("timeline");
    const errorMessage = document.getElementById("error-message");
    const downloadButton = document.getElementById("download-button");
  
    generateButton.addEventListener("click", async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            errorMessage.textContent = "Please enter a scenario.";
            errorMessage.style.display = "block";
            return;
        }
  
        errorMessage.style.display = "none";
        generateButton.textContent = "Generating...";
        generateButton.disabled = true;
  
        try {
            const response = await fetch("http://localhost:5000/generate-timeline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
  
            if (!response.ok) {
                throw new Error("Server error: " + response.statusText);
            }
  
            const data = await response.json();
  
            if (!data.timeline || !Array.isArray(data.timeline)) {
                throw new Error("Invalid response format.");
            }
  
            timelineContainer.innerHTML = "";
  
            data.timeline.forEach(event => {
                const eventElement = document.createElement("div");
                eventElement.classList.add("timeline-event");
                eventElement.innerHTML = `<h3>${event.year}</h3><p>${event.description}</p>`;
                timelineContainer.appendChild(eventElement);
            });
  
        } catch (error) {
            errorMessage.textContent = "Error fetching timeline. Try again.";
            errorMessage.style.display = "block";
        } finally {
            generateButton.textContent = "Generate Timeline";
            generateButton.disabled = false;
        }
    });
  
    downloadButton.addEventListener("click", () => {
        html2canvas(timelineContainer).then(canvas => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "timeline.png";
            link.click();
        }).catch(error => {
            errorMessage.textContent = "Error downloading image.";
            errorMessage.style.display = "block";
        });
    });
  });