const searchButton = document.querySelector("#search-button");
const keywordInput = document.querySelector("#keyword");
const buddyCardContainer = document.querySelector(".buddy-board");

searchResults = []; // stroing the search reasults for filtering
fetch("../static/mockData/buddySearchResultsData.json") // Fetch the JSON data and generate the elements for all summaries
  .then((response) => response.json())
  .then((data) => {
    searchResults = data.users;
    data.users.forEach(generateBuddyCard);
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("q");
    keywordInput.value = searchTerm;
    if (keywordInput.value != null) {
      searchButton.click();
    }
  });

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  buddyCardContainer.innerHTML = "";
  // Get the search term from the filter form
  const searchTerm = keywordInput.value.trim().toLowerCase();
  const searchAgain = searchResults.filter((buddy) => {
    return (
      // Filter the summaries by summary name, uploader name, or course number
      buddy.nickname.toLowerCase().includes(searchTerm)
    );
  });
  // Generate and append the elements for the filtered summaries
  searchAgain.forEach(generateBuddyCard);
  // Build the search query parameters and navigate to the search results page
});

function generateBuddyCard(card) {
  const buddyCard = document.createElement("div");
  const profilePicture = document.createElement("img");
  const nickName = document.createElement("h3");
  const addFriendButton = document.createElement("i");
  // Set the content and attributes of the elements
  nickName.textContent = card.nickname;
  profilePicture.src = "../static/photos/nullProfilePic.png";
  addFriendButton.classList = "fa-regular fa-user-plus";
  addFriendButton.id = "add-friend-icon";
  // Append the elements to the summery card
  buddyCard.appendChild(profilePicture);
  buddyCard.appendChild(addFriendButton);
  buddyCard.appendChild(nickName);
  // Append the job element to the featured jobs container
  buddyCardContainer.appendChild(buddyCard);
}
