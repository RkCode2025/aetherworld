// Redirect to timeline.html when the first tool is clicked
const timelineTool = document.getElementById("timeline-tool");

timelineTool.addEventListener("click", () => {
  window.location.href = "timeline.html";
});
const summary = document.getElementById("unsummary-tool");

summary.addEventListener("click", () => {
  window.location.href = "unsummary.html";
});
const excuse = document.getElementById("excuse-tool");

excuse.addEventListener("click", () => {
  window.location.href = "excuse.html";
});
const cancel = document.getElementById("cancel-tool");

cancel.addEventListener("click", () => {
  window.location.href = "cancel.html";
});


