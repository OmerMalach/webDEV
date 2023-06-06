const postButton = document.querySelector("#post-button");
const postTextarea = document.querySelector("#post-textarea");
const postContainer = document.querySelector("#wall");
let posts = []; // an array to store all the posts
// fetch existing posts from the server
fetch("../static/mockData/posts.json")
  .then((response) => response.json())
  .then((data) => {
    posts = data.posts;
    console.log(posts);
    if (posts[0] != null) {
      data.posts.forEach(generatePostElement);
    }
  });

postButton.addEventListener("click", (event) => {
  event.preventDefault();
  const postText = postTextarea.value.trim();

  // create a new post object
  const newPost = {
    post: postText,
    id: Date.now(), // generate a unique id for the new post
    author: "Omer Malach", // replace with the actual author name
    timestamp: new Date().toISOString(), // generate timestamp for the new post
  };
  // add the new post to the beginning of the posts array
  posts.unshift(newPost);
  generatePostElement(newPost);
  postTextarea.value = "";

  // save the updated posts array to the server
  //   fetch('/posts.json', {
  //     method: 'PUT',
  //     body: JSON.stringify({ posts: posts }),
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  //     .then(response => {
  //       // clear the post text area and generate the new post element
  //       postTextarea.value = '';
  //       generatePostElement(newPost);
  //     });
});

function generatePostElement(post) {
  const postElement = document.createElement("div");
  const authorElement = document.createElement("small");
  const timestampElement = document.createElement("small");
  const textElement = document.createElement("p");

  authorElement.textContent = post.author;
  timestampElement.textContent = new Date(post.timestamp).toLocaleString();
  textElement.textContent = post.post;
  postElement.appendChild(textElement);
  postElement.appendChild(authorElement);
  postElement.appendChild(timestampElement);

  //   postContainer.appendChild(postElement);
  postContainer.insertBefore(postElement, postContainer.firstChild);
}
