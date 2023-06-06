// Get references to the search input field and the search button
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

// Add an event listener to the search button
searchButton.addEventListener("click", () => {
  // Get the search query from the input field
  const searchQuery = searchInput.value;

  // Encode the search query so that it can be included in the URL
  const encodedSearchQuery = encodeURIComponent(searchQuery);

  // Redirect the user to the search results page with the search query in the URL
  window.location.href = `buddySearchResults.html?q=${encodedSearchQuery}`;
});
