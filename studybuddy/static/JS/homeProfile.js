document.addEventListener("DOMContentLoaded", function () {
  // Fetch user profile data from the server
  fetch("/api/profile")
    .then((response) => response.json())
    .then((data) => {
      // Update profile picture
      const profilePicture = document.getElementById("profile-picture");
      profilePicture.src = data.profilePictureUrl;

      // Update username
      const usernameElement = document.getElementById("username");
      usernameElement.textContent = data.username;

      // Update credit count
      const creditCount = document.getElementById("credit-count");
      creditCount.textContent = data.creditCount;
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
    });
});
