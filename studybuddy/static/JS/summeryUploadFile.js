// Fetch DOM elements
const fileInput = document.querySelector("#summaryFile");
const dropzone = document.querySelector("#file-box");
let droppedFile = null;

function resetFormAndState() {
  const form = document.getElementById("uploadForm");
  form.reset();

  // Clear the droppedFile variable
  droppedFile = null;

  // Clear file input field
  const fileInputField = form.querySelector('input[type="file"]');
  fileInputField.value = null;

  // Clear the dropzone content and style
  dropzone.classList.remove("droped");
}
resetFormAndState();
// Define the array first
let eventNames = ["dragenter", "dragover", "dragleave", "drop"];
// Add event listeners
dropzone.addEventListener("dragover", handleDragOver, false);
dropzone.addEventListener("drop", handleFileSelect, false);
fileInput.addEventListener("change", function (e) {
  // When a file is selected through the file input, store it in `droppedFile`
  if (e.target.files.length > 0) {
    droppedFile = e.target.files[0];
  }
});
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
// a few functions responsible for user-feedback
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
// handels file being dropped
function handleFileSelect(e) {
  e.stopPropagation();
  e.preventDefault();
  console.log("File select event triggered");
  let files = e.dataTransfer.files;
  // Only process first file if multiple files are dropped
  if (files.length > 1) {
    alert("You can only upload one file at a time");
    return;
  }
  droppedFile = files[0]; // a veriabke containg the actual file
  console.log("File successfully dropped:", droppedFile);
  // Hide the drag and drop prompt and the file input after file is dropped
  document.querySelector("#file-box p").style.display = "none";
  let uploadedFileName = files[0].name;
  document.querySelector("#file-box .content").innerHTML =
    '<p>Uploaded "' +
    uploadedFileName +
    '". You can only upload one file at a time, feel free to drag and drop again to replace the file.</p>';
}

// the main handler , responsible on makeing the call to /upload though fatch request
document.getElementById("submitBtn").addEventListener("click", () => {
  console.log("Submit button clicked");
  let file = droppedFile; // here where geting the file. either from the drop zone or from file selection.
  // Build the form data - You can add other input values to this i.e descriptions, make sure img is appended last
  var courseNumber = document.getElementById("input1").value;
  var courseName = document.getElementById("input2").value;
  var year = document.getElementById("input3").value;
  var semester = document.getElementById("input4").value;
  var summaryName = document.getElementById("input5").value;
  var teacher = document.getElementById("input6").value;
  // Validate course number (only letters and numbers)
  var courseNumberPattern = /^[A-Za-z0-9]+$/;
  var NamePattern = /^[\u0590-\u05FFA-Za-z\s]+$/; // hebrew letters are ok!

  if (!courseNumberPattern.test(courseNumber)) {
    alert("Course number should contain only letters and numbers.");
    return;
  }

  // Validate course name
  if (!NamePattern.test(courseName)) {
    alert(
      "Course name should contain only letters and spaces in English or Hebrew."
    );
    return;
  }

  // Validate summary name
  if (!NamePattern.test(summaryName)) {
    alert(
      "Course name should contain only letters and spaces in English or Hebrew."
    );
    return;
  }

  // Validate year (between 1900 and 2099)
  if (year < 1900 || year > 2099) {
    alert("Year should be between 1900 and 2023.");
    return;
  }

  // Validate semester (options: summer, winter, fall, spring)
  var validSemesters = ["summer", "winter", "fall", "spring"];
  if (!validSemesters.includes(semester.toLowerCase())) {
    alert(
      "Invalid semester. Choose from the options: summer, winter, fall, spring."
    );
    return;
  }
  if (!NamePattern.test(teacher)) {
    alert("teacher name should contain only letters.");
    return;
  }
  if (!file || file.type !== "application/pdf") {
    alert("Please upload a PDF file.");
    return;
  }
  let formData = new FormData();
  formData.append("summaryFile", file);
  formData.append("nameOfSummary", document.querySelector("#input5").value);
  formData.append("Teacher", document.querySelector("#input6").value);
  formData.append("courseNumber", document.querySelector("#input1").value);
  formData.append("nameOfCourse", document.querySelector("#input2").value);
  formData.append("year", document.querySelector("#input3").value);
  formData.append("semester", document.querySelector("#input4").value);
  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      console.log("Response received from /upload");
      return res.text();
    })
    .then((text) => console.log("Response text: ", text))
    .catch((err) => console.log("Fetch error: ", err));
  // Show success message
  alert("Summary uploaded successfully!");
  resetFormAndState();
});

// this patch of code creates a dynamic years menu, helps the user and great for validating.
let currentYear = new Date().getFullYear();
let yearSelect = document.getElementById("input3");

for (let year = currentYear; year >= 1948; year--) {
  let option = document.createElement("option");
  option.value = year;
  option.text = year;
  yearSelect.appendChild(option);
}
