document.querySelector(".sidebar").addEventListener("click", function () {
  moveToLoginPage();
});

// Function to move to the Login Page
function moveToLoginPage() {
  window.location.href = "loginPage.html";
}

// Function to validate email
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}


// Event listener for form submission
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  // Get input values
  const usernameInput = document.querySelector(
    'input[type="text"][placeholder="Username"]'
  );
  const emailInput = document.querySelector(
    'input[type="text"][placeholder="Email"]'
  );
  const passwordInput = document.querySelector(
    'input[type="password"][placeholder="Password"]'
  );
  const passwordVerifyInput = document.querySelector(
    'input[type="password"][placeholder="Password Verification"]'
  );
  const phoneInput = document.querySelector(
    'input[type="text"][placeholder="Phone number"]'
  );

  // Check if any of the fields are empty
  if (
    usernameInput.value.trim() === "" ||
    emailInput.value.trim() === "" ||
    passwordInput.value.trim() === "" ||
    passwordVerifyInput.value.trim() === "" ||
    phoneInput.value.trim() === ""
  ) {
    alert("Please fill in all the required fields");
    return;
  }

  // Validate email
  const email = emailInput.value.trim();
  if (!validateEmail(email)) {
    alert("Invalid email address");
    return;
  }

  // Validate password match
  const password = passwordInput.value.trim();
  const passwordVerify = passwordVerifyInput.value.trim();
  if (password !== passwordVerify) {
    alert("Password and password verification do not match");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    alert("Password must contain at least one uppercase letter, one lowercase letter, and one numeric digit");
    return;
  }

  //validate username
  const username =usernameInput.value.trim();
  if(username.length < 6){
   alert("User Name must be at least 6 characters long");
    return;
  }

  // Validate phone number
  const phoneNumber = phoneInput.value.trim();
  if (!/^\d{10,}$/.test(phoneNumber)) {
    alert("Phone number must be at least 10 digits");
    return;
  }

  // Display success message
  alert("Account created successfully!");

  // Reset form
  usernameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
  passwordVerifyInput.value = "";
  phoneInput.value = "";
});