const filterButton = document.querySelector("#filter-button");
const keywordInput = document.querySelector("#keyword");
const summariesContainer = document.querySelector(".summary-board");

searchResults = []; // stroing the search reasults for filtering

fetch("../static/mockData/mySummariesData.json") // Fetch the JSON data and generate the elements for all summaries
  .then((response) => response.json())
  .then((data) => {
    searchResults = data.summaries;
    data.summaries.forEach(generateSummeryCard);
  });

filterButton.addEventListener("click", (event) => {
  event.preventDefault();
  summariesContainer.innerHTML = "";
  // Get the search term from the filter form
  const searchTerm = keywordInput.value.trim().toLowerCase();
  const filteredSummaries = searchResults.filter((summary) => {
    return (
      // Filter the summaries by summary name, uploader name, or course number
      summary.name.toLowerCase().includes(searchTerm) ||
      summary.uploader.name.toLowerCase().includes(searchTerm) ||
      summary.courseNumber.toLowerCase().includes(searchTerm)
    );
  });
  // Generate and append the elements for the filtered summaries
  filteredSummaries.forEach(generateSummeryCard);
});

function generateSummeryCard(card) {
  const summeryCard = document.createElement("div");
  const summaryName = document.createElement("h3");
  const CourseNumber = document.createElement("p");
  const TeacherName = document.createElement("p");
  const Year = document.createElement("p");
  const Semester = document.createElement("p");
  const Rank = document.createElement("p");
  const Downloads = document.createElement("p");
  const UploadingDate = document.createElement("p");
  const Uploader = document.createElement("p");
  const DownloadButton = document.createElement("a");
  // Set the content and attributes of the elements
  summaryName.textContent = card.name;
  CourseNumber.textContent = `Course Number: ${card.courseNumber}`;
  TeacherName.textContent = `Teacher: ${card.teacher}`;
  Year.textContent = `Year: ${card.year}`;
  Semester.textContent = `Semester: ${card.semester}`;
  Rank.textContent = `Rank: ${card.rank}`;
  Downloads.textContent = `Downloads: ${card.numDownloads}`;
  UploadingDate.textContent = `Upload Date: ${card.uploadDate}`;
  Uploader.textContent = `Uploader: ${card.uploader.name}`;
  DownloadButton.textContent = "Download";
  DownloadButton.href = card.summaryUrl;

  // Append the elements to the summery card
  summeryCard.appendChild(summaryName);
  summeryCard.appendChild(CourseNumber);
  summeryCard.appendChild(TeacherName);
  summeryCard.appendChild(Year);
  summeryCard.appendChild(Semester);
  summeryCard.appendChild(Rank);
  summeryCard.appendChild(Downloads);
  summeryCard.appendChild(UploadingDate);
  summeryCard.appendChild(Uploader);
  summeryCard.appendChild(DownloadButton);

  // Append the job element to the featured jobs container
  summariesContainer.appendChild(summeryCard);
}
