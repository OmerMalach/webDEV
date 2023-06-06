document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var courseNumber = document.getElementById("input1").value;
    var courseName = document.getElementById("input2").value;
    var year = document.getElementById("input3").value;
    var semester = document.getElementById("input4").value;
    var summaryName = document.getElementById("input5").value;

    // Validate course number (only letters and numbers)
    var courseNumberPattern = /^[A-Za-z0-9]+$/;
    if (!courseNumberPattern.test(courseNumber)) {
      alert("Course number should contain only letters and numbers.");
      return;
    }

    // Validate course name (only letters and numbers in English)
    var courseNamePattern = /^[A-Za-z\s]+$/;
    if (!courseNamePattern.test(courseName)) {
      alert("Course name should contain only letters and spaces in English.");
      return;
    }

    // Validate year (between 1900 and 2099)
    if (year < 1900 || year > 2099) {
      alert("Year should be between 1900 and 2099.");
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

    // Show success message
    alert("Summary uploaded successfully!");
  });
