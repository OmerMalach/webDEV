document.addEventListener("DOMContentLoaded", function() {
  var form = document.getElementById("resetForm");

document.addEventListener("DOMContentLoaded", function() {
  var form = document.getElementById("resetForm");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get the entered email
    var email = document.getElementById("email").value;

    // Check if the email is in the correct format
    var emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }


    // Append the message after the form
    form.parentNode.insertBefore(message, form.nextSibling);
  });
});