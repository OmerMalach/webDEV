const libraryContainer = document.querySelector("#posts-container");
fetch("/recentPosts")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    posts = data;

    if (posts.length > 0) {
      posts.forEach(generatePostContainer);
    } else {
      const noPostsMessage = document.createElement("p");
      noPostsMessage.textContent = "No posts found.";
      libraryContainer.appendChild(noPostsMessage);
    }
  })
  .catch((error) => console.error("There was an error!", error));

function generatePostContainer(post) {
  const postContainer = document.createElement("div");
  const postHeader = document.createElement("div");
  const authorPhoto = document.createElement("img");
  const authorName = document.createElement("h2");
  const timestamp = document.createElement("p");
  const email = document.createElement("p");
  const postContent = document.createElement("p");
  const commentSection = document.createElement("div");
  const commentInput = document.createElement("input");
  const commentButton = document.createElement("button");
  const commentList = document.createElement("ul");

  postContainer.classList.add("post-container");
  postHeader.classList.add("post-header");
  authorPhoto.classList.add("author-photo");
  commentSection.classList.add("comment-section");
  commentInput.classList.add("comment-input");
  commentButton.classList.add("comment-button");
  commentButton.dataset.author = post.Nickname;
  commentButton.dataset.postId = post.Post_ID;
  commentList.classList.add("comment-list");

  authorPhoto.src = post.authorPhoto;
  authorPhoto.alt = "Author Photo";
  authorName.textContent = post.Nickname;
  timestamp.textContent = formatTimestamp(post.DateTime);
  email.textContent = post.Email;
  postContent.textContent = post.Text;

  postHeader.appendChild(authorPhoto);
  postHeader.appendChild(authorName);
  postHeader.appendChild(timestamp);
  postHeader.appendChild(email);

  commentSection.appendChild(commentInput);
  commentSection.appendChild(commentButton);
  commentSection.appendChild(commentList);

  postContainer.appendChild(postHeader);
  postContainer.appendChild(postContent);
  postContainer.appendChild(commentSection);

  libraryContainer.appendChild(postContainer);
}

function validateComment(commentInput) {
  const commentText = commentInput.value;
  if (!commentText || commentText.trim() === "") {
    alert("Comment cannot be empty");
    return false; // This will prevent the form from being submitted
  }
  return true; // This will allow the form to be submitted
}

function generateCommentElement(comment) {
  const commentList = document.querySelector(`#comment-list-${comment.Post_ID}`);
  const listItem = document.createElement("li");
  listItem.textContent = `${comment.Student_ID}: ${comment.Text}`;
  commentList.appendChild(listItem);
}

const commentForms = document.querySelectorAll(".comment-form");
commentForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const commentInput = form.querySelector(".comment-input");
    if (validateComment(commentInput)) {
      const commentText = commentInput.value;
      const postId = form.dataset.postId;
      const author = form.dataset.author;

      const commentData = {
        DateTime: getCurrentDateTime(),
        Text: commentText,
        Post_ID: postId,
        Student_ID: author,
      };

      fetch("/newcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          generateCommentElement(commentData);
          commentInput.value = "";
        })
        .catch((error) => console.error("There was an error!", error));
    }
  });
});

function formatTimestamp(dateTime) {
  // Your timestamp formatting logic here
  // Example:
  const formattedDate = new Date(dateTime).toLocaleString();
  return formattedDate;
}