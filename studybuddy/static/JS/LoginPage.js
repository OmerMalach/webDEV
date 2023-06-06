const loginForm = document.querySelector(".login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  const username = usernameInput.value;
  const password = passwordInput.value;

  validateUser(username, password)
    .then((result) => {
      if (result) {
        redirectToHomePage();
      } else {
        alert("Invalid username or password. Please try again.");
      }
    })
    .catch((error) => {
      alert("An error occurred during login. Please try again later.");
      console.error(error);
    });
});

async function validateUser(username, password) {
  const response = await fetch(
    "../static/mockData/buddySearchResultsData.json"
  );
  const data = await response.json();

  const foundUser = data.users.find(
    (user) => user.nickname === username && user.password === password
  );

  return foundUser !== undefined;
}

function redirectToHomePage() {
  window.location.href = "home.html";
}

document
  .querySelector(".create-account-btn")
  .addEventListener("click", function () {
    moveToCreateAccount();
  });

// Function to move to the Create Account page
function moveToCreateAccount() {
  window.location.href = "NewAccount.html";
}

// Add event listener to the Forgot Password button
document
  .querySelector(".forgot-password-btn")
  .addEventListener("click", function () {
    moveToForgetPassword();
  });

// Function to move to the Forgot Password page
function moveToForgetPassword() {
  window.location.href = "ForgetPassword.html";
}
