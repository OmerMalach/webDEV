// Fetch DOM elements
const fileInput = document.querySelector("#file-input");
const dropzone = document.querySelector("#file-box");

// Add event listeners
dropzone.addEventListener("dragover", handleDragOver, false);
dropzone.addEventListener("drop", handleFileSelect, false);

// Define the array first
let eventNames = ["dragenter", "dragover", "dragleave", "drop"];

// Then use forEach
eventNames.forEach((eventName) => {
  dropzone.addEventListener(eventName, preventDefaults, false);
});

eventNames = ["dragenter", "dragover"];

eventNames.forEach((eventName) => {
  dropzone.addEventListener(eventName, highlight, false);
});

dropzone.addEventListener("dragleave", unhighlight, false);
dropzone.addEventListener("drop", droped, false);

// Prevent default behavior (Prevent file from being opened)
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropzone.classList.add("highlight");
}

function unhighlight(e) {
  dropzone.classList.remove("highlight");
}
function droped(e) {
  dropzone.classList.remove("highlight");
  dropzone.classList.add("droped");
}

function handleDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
  console.log("Drag over event triggered");
}

function handleFileSelect(e) {
  e.stopPropagation();
  e.preventDefault();
  console.log("File select event triggered");
  // FileList object.
  let files = e.dataTransfer.files;

  // Only process first file if multiple files are dropped
  if (files.length > 1) {
    alert("You can only upload one file at a time");
    return;
  }

  fileInput.files = files;
  // Hide the drag and drop prompt and the file input after file is dropped
  document.querySelector("#file-box p").style.display = "none";
  let uploadedFileName = files[0].name;
  document.querySelector("#file-box .content").innerHTML =
    '<p>Uploaded "' +
    uploadedFileName +
    '". You can only upload one file at a time, feel free to drag and drop again to replace the file.</p>';
}

// Handle form submission
document.querySelector("#uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let formData = new FormData();
  formData.append("file", fileInput.files[0]);

  // TODO: Add other form fields to formData
});
