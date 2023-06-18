// document.getElementById("uploadForm").addEventListener("submit", function () {
//   var courseNumber = document.getElementById("input1").value;
//   var courseName = document.getElementById("input2").value;
//   var year = document.getElementById("input3").value;
//   var semester = document.getElementById("input4").value;
//   var summaryName = document.getElementById("input5").value;
//   // Validate course number (only letters and numbers)
//   var courseNumberPattern = /^[A-Za-z0-9]+$/;
//   var NamePattern = /^[\u0590-\u05FFA-Za-z\s]+$/; // hebrew letters are ok!

//   if (!courseNumberPattern.test(courseNumber)) {
//     alert("Course number should contain only letters and numbers.");
//     return;
//   }

//   // Validate course name
//   if (!NamePattern.test(courseName)) {
//     alert(
//       "Course name should contain only letters and spaces in English or Hebrew."
//     );
//     return;
//   }

//   // Validate summary name
//   if (!NamePattern.test(summaryName)) {
//     alert(
//       "Course name should contain only letters and spaces in English or Hebrew."
//     );
//     return;
//   }

//   // Validate year (between 1900 and 2099)
//   if (year < 1900 || year > 2099) {
//     alert("Year should be between 1900 and 2023.");
//     return;
//   }

//   // Validate semester (options: summer, winter, fall, spring)
//   var validSemesters = ["summer", "winter", "fall", "spring"];
//   if (!validSemesters.includes(semester.toLowerCase())) {
//     alert(
//       "Invalid semester. Choose from the options: summer, winter, fall, spring."
//     );
//     return;
//   }

//   // Show success message
//   alert("Summary uploaded successfully!");
// });
