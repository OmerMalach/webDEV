const summariesContainer = document.querySelector(".summaries-container");
fetch("/myUploads")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    files = data;
    if (files[0] != null) {
      files.forEach(generatesummaryCard);
    }
  })
  .catch((error) => console.error("There was an error!", error));

function generatesummaryCard(card) {
  const summaryCard = document.createElement("div");
  const summaryName = document.createElement("h3");
  const CourseNumber = document.createElement("p");
  const CourseName = document.createElement("p");
  const teacher = document.createElement("p");
  const Downloads = document.createElement("p");
  const UploadingDate = document.createElement("p");
  const DownloadButton = document.createElement("a");

  // Set the content and attributes of the elements
  summaryName.textContent = card.Name_Summary;
  CourseNumber.textContent = `Course Number: ${card.Course_Number}`;
  CourseName.textContent = `Course Name: ${card.Course_Name}`;
  teacher.textContent = `Teacher: ${card.teacher}`;
  Downloads.textContent = `Downloads: ${card.numDownloads}`;
  UploadingDate.textContent =
    `Upload Date: ${card.uploadDate}`.toLocaleString();
  DownloadButton.textContent = "Download";
  DownloadButton.href = card.summaryUrl;

  // Append the elements to the summery card
  summaryCard.appendChild(summaryName);
  summaryCard.appendChild(CourseNumber);
  summaryCard.appendChild(CourseName);
  summaryCard.appendChild(teacher);
  summaryCard.appendChild(Downloads);
  summaryCard.appendChild(UploadingDate);
  summaryCard.appendChild(DownloadButton);

  // Append the job element to the featured jobs container
  summariesContainer.appendChild(summaryCard);
}
