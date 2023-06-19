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
  console.log(post);
  const postElement = document.createElement("div");
  const authorElement = document.createElement("small");
  const timestampElement = document.createElement("small");
  const textElement = document.createElement("p");

  authorElement.textContent = post.Nickname;
  timestampElement.textContent = new Date(post.DateTime).toLocaleString();
  textElement.textContent = post.Text;
  postElement.appendChild(textElement);
  postElement.appendChild(authorElement);
  postElement.appendChild(timestampElement);

  //   postContainer.appendChild(postElement);
  postContainer.insertBefore(postElement, postContainer.firstChild);
}
