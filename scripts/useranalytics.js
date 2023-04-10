import navbar from "../components/navbar.js";

document.getElementById("navbar").innerHTML = navbar();

// let commonUrl = "http://localhost:8888/";
let commonUrl = "https://social-media-backend-production-a70f.up.railway.app/";

let getTopFiveMostActiveUsers = document.getElementById(
  "getTopFiveMostActiveUsers"
);

let topFiveUsers = document.getElementById("topFiveUsers");
let allUsers = document.getElementById("allUsers");

getTopFiveMostActiveUsers.addEventListener("click", () => {
  allUsers.style.display = "none";
  topFiveUsers.style.display = "block";
  getTopFiveActiveUsers().then((users) => {
    appendTopFiveUsers(users);
  });
});

async function getTopFiveActiveUsers() {
  let response = await fetch(commonUrl + `analytics/users/top-active`);
  let data = await response.json();
  if (response.status == 200) {
    return data;
  } else {
    window.alert("No any user found in database.");
  }
}

let appendTopFiveUsers = (users) => {
  let topUserTableBody = document.getElementById("topUserTableBody");
  topUserTableBody.innerHTML = "";
  users.forEach((user) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = user.id;
    row.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;
    row.appendChild(nameCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    const bioCell = document.createElement("td");
    bioCell.textContent = user.bio;
    row.appendChild(bioCell);

    const totalPostCell = document.createElement("td");
    totalPostCell.textContent = user.totalPosts;
    row.appendChild(totalPostCell);

    topUserTableBody.appendChild(row);
  });
};

let getAllUsers = document.getElementById("getAllUsers");

getAllUsers.addEventListener("click", () => {
  topFiveUsers.style.display = "none";
  allUsers.style.display = "block";
  fetchAllUsers().then((users) => {
    appendUsers(users);
  });
});

// Get all users
async function fetchAllUsers() {
  let response = await fetch(commonUrl + `analytics/users`);
  if (response.status == 200) {
    let data = await response.json();
    return data;
  }
}

let appendUsers = (arrayOfUsers) => {
  let userTableBody = document.getElementById("userTableBody");
  userTableBody.innerHTML = "";
  arrayOfUsers.forEach((user) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = user.id;
    row.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;
    row.appendChild(nameCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    const bioCell = document.createElement("td");
    bioCell.textContent = user.bio;
    row.appendChild(bioCell);

    userTableBody.appendChild(row);
  });
};
