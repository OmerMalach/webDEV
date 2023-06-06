// Add event listener to the "Contact Us" link
document
  .querySelector("#contact-us-link")
  .addEventListener("click", function () {
    navigateToContactPage();
  });

// Add event listener to the "About Us" link
document.querySelector("#about-us-link").addEventListener("click", function () {
  navigateToAboutPage();
});

// Function to navigate to the Contact page
function navigateToContactPage() {
  window.location.href = "ContactUs.html";
}

// Function to navigate to the About page
function navigateToAboutPage() {
  window.location.href = "AboutUs.html";
}
