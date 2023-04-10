import navbar from "../components/navbar.js";

document.getElementById("navbar").innerHTML = navbar();

let commonUrl = "https://social-media-backend-production-a70f.up.railway.app/";

let topFivePosts = document.getElementById("topFivePosts");
let getAllPosts = document.getElementById("getAllPosts");

let topFivePostsButton = document.getElementById(
  "getTopFiveMostLikedPostsButton"
);
let fetchAllPostsButton = document.getElementById("fetchAllPostsButton");

topFivePostsButton.addEventListener("click", () => {
  topFivePosts.style.display = "block";
  getAllPosts.style.display = "none";
  fetchTopFiveMostLikedPosts().then((posts) => {
    appendTopPosts(posts);
  });
});

fetchAllPostsButton.addEventListener("click", () => {
  getAllPosts.style.display = "block";
  topFivePosts.style.display = "none";
  fetchAllPosts().then((posts) => {
    appendPosts(posts);
  });
});

async function fetchAllPosts() {
  let response = await fetch(commonUrl + `analytics/posts`);
  let data = await response.json();
  if (response.status == 200) {
    console.log("data:", data);
    return data;
  } else {
    console.log(response);
  }
}

let appendPosts = (arrayOfPosts) => {
  let getAllPostTableBody = document.getElementById("getAllPostTableBody");
  getAllPostTableBody.innerHTML = "";
  arrayOfPosts.forEach((post) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = post.id;
    row.appendChild(idCell);

    const contentCell = document.createElement("td");
    contentCell.textContent = post.content;
    row.appendChild(contentCell);

    const likesCell = document.createElement("td");
    likesCell.textContent = post.likes;
    row.appendChild(likesCell);

    getAllPostTableBody.appendChild(row);
  });
};

async function fetchTopFiveMostLikedPosts() {
  let response = await fetch(commonUrl + `analytics/posts/top-liked`);
  let data = response.json();
  if (response.status == 200) {
    return data;
  } else {
    window.alert(data.details);
  }
}

let appendTopPosts = (posts) => {
  let topPostTableBody = document.getElementById("topPostTableBody");
  topPostTableBody.innerHTML = "";
  posts.forEach((post) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = post.id;
    row.appendChild(idCell);

    const contentCell = document.createElement("td");
    contentCell.textContent = post.content;
    row.appendChild(contentCell);

    const likesCell = document.createElement("td");
    likesCell.textContent = post.likes;
    row.appendChild(likesCell);

    topPostTableBody.appendChild(row);
  });
};
