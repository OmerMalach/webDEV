const postContainer = document.querySelector("#wall");
let posts = []; // an array to store all the posts

function validatePost() {
  var postContent = document.getElementById("post-textarea").value;

  if (!postContent || postContent.trim() === "") {
    alert("Post cannot be empty");
    return false; // This will prevent the form from being submitted
  }
  return true; // This will allow the form to be submitted
}

fetch("/mypost")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    posts = data;
    if (posts[0] != null) {
      posts.forEach(generatePostElement);
    }
  });
function generatePostElement(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("each-post");

  const textElement = document.createElement("div");
  textElement.classList.add("post-text");
  textElement.textContent = post.Text;
  postElement.appendChild(textElement);

  const timestampElement = document.createElement("p");
  timestampElement.classList.add("timestamp");
  timestampElement.textContent = new Date(post.DateTime).toLocaleString();
  textElement.appendChild(timestampElement);

  // create comments section for each post
  if (post.comments.length > 0) {
    const commentsElement = document.createElement("div");
    commentsElement.classList.add("comments-container");

    post.comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");

      const commentAuthorElement = document.createElement("p");
      commentAuthorElement.classList.add("comment-author");
      commentAuthorElement.textContent = comment.Nickname;
      commentElement.appendChild(commentAuthorElement);

      const commentTextElement = document.createElement("p");
      commentTextElement.classList.add("comment-text");
      commentTextElement.textContent = comment.Text;
      commentElement.appendChild(commentTextElement);

      const commentTimestampElement = document.createElement("small");
      commentTimestampElement.classList.add("commentTimestamp");
      commentTimestampElement.textContent = new Date(
        comment.DateTime
      ).toLocaleString();
      commentElement.appendChild(commentTimestampElement);

      commentsElement.appendChild(commentElement);
    });

    postElement.appendChild(commentsElement);
  }

  postContainer.insertBefore(postElement, postContainer.firstChild);
}
