const searchForm = document.querySelector("#searchForm");
const searchButton = document.querySelector("#search-button");
const keywordInput1 = document.querySelector("#input1");
const keywordInput1 = document.querySelector("#input2");
const keywordInput3 = document.querySelector("#input3");
const keywordInput4 = document.querySelector("#input4");
const keywordInput5 = document.querySelector("#input5");

let searchResults = []; // storing the search results for filtering
fetch("../static/mockData/searchResultsData.json")
  .then((response) => response.json())
  .then((data) => {
    searchResults = data.summaries;
    console.log(searchResults);
  });

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Get the search term from the filter form
  const searchedSummaries = await summarySearch();
  console.log(searchedSummaries);
  // Store the searched summaries in session storage
  sessionStorage.setItem(
    "searchedSummaries",
    JSON.stringify(searchedSummaries)
  );
  // Navigate to the search results page
  window.location.href = "SearchResults.html";
});

async function summarySearch() {
  const searchTerm1 = keywordInput1.value.toLowerCase();
  const searchTerm3 = keywordInput3.value;
  const searchTerm4 = keywordInput4.value.toLowerCase();
  const searchTerm5 = Number(keywordInput5.value.trim());

  // Validate year (between 1900 and 2099)
  if (searchTerm3 !== "" && (searchTerm3 < 1900 || searchTerm3 > 2099)) {
    alert("Year should be between 1900 and 2099.");
    return [];
  }

  // Validate semester (options: summer, winter, fall, spring)
  const validSemesters = ["summer", "winter", "fall", "spring"];
  if (
    searchTerm4 !== "" &&
    !validSemesters.includes(searchTerm4.toLowerCase())
  ) {
    alert(
      "Invalid semester. Choose from the options: summer, winter, fall, spring."
    );
    return [];
  }

  let searchedSummaries = [];
  searchedSummaries = searchResults.filter((summary) => {
    return (
      // Filter the summaries by summary name, uploader name, or course number
      (searchTerm1.length === 0 ||
        summary.courseNumber.toLowerCase().includes(searchTerm1)) &&
      (searchTerm3 === "" || summary.year.toString() === searchTerm3) &&
      (searchTerm4 === "" ||
        summary.semester.toLowerCase().includes(searchTerm4)) &&
      (isNaN(searchTerm5) || summary.rank >= searchTerm5)
    );
  });

  return searchedSummaries;
}
