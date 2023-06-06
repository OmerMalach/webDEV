// Function to fetch the JSON data
async function fetchPosts() {
  try {
    const response = await fetch("../static/mockData/TheLibrary.json");
    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.log("Error fetching posts:", error);
    return [];
  }
}

function createPostHTML(post) {
  const authorPhoto = post.authorPhoto || "../static/photos/nullProfilePic.png";

  const postHTML = `
    <div class="post-container">
      <div class="post-header">
        <img class="author-photo" src="${authorPhoto}" alt="Author Photo">
        <h2 class="author">${post.author}</h2>
              <p class="timestamp">${formatTimestamp(post.timestamp)}</p>

      </div>
      <p class="post-content">${post.post}</p>
      <div class="comment-section">
        <input type="text" placeholder="Leave a comment" class="comment-input">
        <button class="comment-button" data-author="${post.author}">Comment</button>
        <ul class="comment-list"></ul>
      </div>
    </div>
  `;
  return postHTML;
}
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleString('en-US', options);
}

// Function to render the posts on the page
async function renderPosts() {
  const postsContainer = document.getElementById("posts-container");

  const posts = await fetchPosts();
  if (posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

  const postsHTML = posts.map(createPostHTML).join("");
  postsContainer.innerHTML = postsHTML;

  addCommentEventListeners();
}

function createCommentHTML(comment) {
  return `
    <li class="comment-item">
      <div class="comment-text">${comment.author}: ${comment.text}</div>
    </li>`;
}

// Function to render the comments for a post
function renderComments(postElement, comments) {
  const commentList = postElement.querySelector(".comment-list");
  const commentsHTML = comments.map(createCommentHTML).join("");
  commentList.innerHTML = commentsHTML;
}

// Function to handle comment submission
function handleCommentSubmission(event) {
  event.preventDefault();

  const postElement = event.target.closest(".post-container");
  const commentInput = postElement.querySelector(".comment-input");
  const commentList = postElement.querySelector(".comment-list");

  const comment = commentInput.value;
  if (comment) {
    const commentData = {
      author: "Omer Malach",
      text: comment,
    };
    const commentHTML = createCommentHTML(commentData);
    commentList.innerHTML += commentHTML;
    commentInput.value = "";
  }
}

// Function to add event listeners to comment buttons
function addCommentEventListeners() {
  const commentButtons = document.querySelectorAll(".comment-button");
  commentButtons.forEach((button) => {
    button.addEventListener("click", handleCommentSubmission);
  });
}

window.addEventListener("DOMContentLoaded", renderPosts);
