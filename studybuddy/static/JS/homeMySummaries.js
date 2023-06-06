const summariesContainer = document.querySelector(".summaries-container");
fetch("../static/mockData/searchResultsData.json") // Fetch the JSON data and generate the elements for all summaries
  .then((response) => response.json())
  .then((data) => {
    data.summaries.forEach(generateSummeryCard);
  });

function generateSummeryCard(card) {
  const summeryCard = document.createElement("div");
  const summaryName = document.createElement("h3");
  const CourseNumber = document.createElement("p");

  const Rank = document.createElement("p");
  const Downloads = document.createElement("p");
  const UploadingDate = document.createElement("p");

  const DownloadButton = document.createElement("a");
  // Set the content and attributes of the elements
  summaryName.textContent = card.name;
  CourseNumber.textContent = `Course Number: ${card.courseNumber}`;

  Rank.textContent = `Rank: ${card.rank}`;
  Downloads.textContent = `Downloads: ${card.numDownloads}`;
  UploadingDate.textContent = `Upload Date: ${card.uploadDate}`;

  DownloadButton.textContent = "Download";
  DownloadButton.href = card.summaryUrl;

  // Append the elements to the summery card
  summeryCard.appendChild(summaryName);
  summeryCard.appendChild(CourseNumber);

  summeryCard.appendChild(Rank);
  summeryCard.appendChild(Downloads);
  summeryCard.appendChild(UploadingDate);

  summeryCard.appendChild(DownloadButton);

  // Append the job element to the featured jobs container
  summariesContainer.appendChild(summeryCard);
}
