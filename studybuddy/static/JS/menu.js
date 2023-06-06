const menu = document.querySelector("#menu-icon");
const nav = document.querySelector("#navbar");

menu.onclick = () => {
  nav.classList.toggle("open");
};
