document.querySelectorAll(".downBt").forEach((item) => {
  item.addEventListener("click", function (event) {
    // Prevent the link from being followed, which is the default behavior
    event.preventDefault();

    const summaryId = event.target.getAttribute("data-id");

    // Send a POST request
    fetch("/downloadTracker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ summaryId }),
    })
      .then((response) => {
        if (!response.ok) {
          // If server responded with a status of 400 or 403, parse the JSON from the response body
          response.json().then((data) => {
            // Show the message in an alert dialog
            alert(data.message);
          });
        } else {
          // If the POST request was successful, redirect to the file download URL
          window.location.href = event.target.href;

          // Find the credit counter and decrement the value
          let creditCounter = document.querySelector("#credit-counter");
          let currentCredit = parseInt(
            creditCounter.innerText.replace("Your Credits:", "")
          );
          creditCounter.innerText = "Your Credits: " + (currentCredit - 1);
        }
      })
      .catch((error) => {
        // Log any error that occurred in the fetch call
        console.error("Fetch error: ", error);
      });
  });
});
