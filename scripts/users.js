import navbar from "../components/navbar.js";

document.getElementById("navbar").innerHTML = navbar();

// http://localhost:8888/
let commonUrl = "https://social-media-backend-production-a70f.up.railway.app/";

// Create/Update open close function start
let createUserButton = document.getElementById("createUserButton");
let updateUserButton = document.getElementById("updateUserButton");

let createUserDiv = document.getElementById("createUserDiv");
let updateUserDiv = document.getElementById("updateUserDiv");

createUserButton.addEventListener("click", () => {
  updateUserDiv.style.display = "none";
  createUserDiv.style.display = "block";
});

updateUserButton.addEventListener("click", () => {
  updateUserDiv.style.display = "block";
  createUserDiv.style.display = "none";
});

let closeCreateUser = document.getElementById("closeCreateUser");
let closeUpdateUser = document.getElementById("closeUpdateUser");

closeCreateUser.addEventListener("click", () => {
  createUserDiv.style.display = "none";
});

closeUpdateUser.addEventListener("click", () => {
  updateUserDiv.style.display = "none";
});
// Create/Update open close function end

// Create user data
{
  let userPostForm = document.getElementById("userPostForm");

  userPostForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);

    let name = formData.get("name");
    let email = formData.get("email");
    let bio = formData.get("bio");

    let userObject = {
      name: "someName",
      email: "someEmail",
      bio: "someBio",
    };

    userObject.name = name;
    userObject.email = email;
    userObject.bio = bio;

    createUser(userObject);
  });

  // Create user POST request method.
  let createUser = (userObject) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObject),
    };

    fetch(commonUrl + `users/`, options)
      .then((response) => response.json())
      .then((savedUserObject) => {
        if (savedUserObject.description == "Validation error") {
          window.alert(savedUserObject.details);
        } else if (savedUserObject.description == "uri=/users/") {
          window.alert(`Username already exist try with another one.`);
        } else {
          window.alert(`User created with Id : ${savedUserObject.id}`);
          main();
        }
        userPostForm.reset();
      })
      .catch((error) => console.error("error : ", error));
  };
}

// Update user data
let userUpdateForm = document.getElementById("userUpdateForm");

userUpdateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);

  let id = formData.get("id");
  let updatedName = formData.get("name");
  let updatedBio = formData.get("bio");

  let userObject = {
    id: 0,
    name: "someContent",
    bio: "someBio",
  };

  userObject.id = id;
  userObject.name = updatedName;
  userObject.bio = updatedBio;

  console.log("userObject:", userObject);

  updateUser(userObject);
});

let updateUser = (userObject) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/Json",
    },
    body: JSON.stringify(userObject),
  };

  fetch(commonUrl + `users/${userObject.id}`, options)
    .then((response) => response.json())
    .then((updatedUserObject) => {
      if (updatedUserObject.description == "Validation error") {
        window.alert(updatedUserObject.details);
      } else if (
        updatedUserObject.description == `uri=/users/${userObject.id}`
      ) {
        window.alert(`User not found with Id : ${userObject.id}`);
      } else {
        window.alert(`User updated.`);
      }
    });
};

// Get all users
async function main() {
  let data = await getAllUsers();
  appendUsers(data);
}

main();

// Get all users
async function getAllUsers() {
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

    const viewCell = document.createElement("td");
    const viewPostsButton = document.createElement("button");
    viewPostsButton.setAttribute("class", "tableButton");
    viewPostsButton.textContent = "Open";
    viewCell.appendChild(viewPostsButton);
    row.appendChild(viewCell);
    viewPostsButton.addEventListener("click", () => {
      let userId = idCell.textContent;
      getAllPostsByUserId(userId).then((data) => {
        console.log("data:", data);
      });
    });

    const actionCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.setAttribute("class", "tableButton");
    editButton.textContent = "Edit";
    editButton.style.backgroundColor = "green";
    editButton.style.border = "green";
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "tableButton");
    deleteButton.textContent = "Delete";
    deleteButton.style.backgroundColor = "red";
    deleteButton.style.border = "red";
    actionCell.append(editButton, " / ", deleteButton);
    row.appendChild(actionCell);
    editButton.addEventListener("click", () => {
      let userId = idCell.textContent;
      getUserById(userId).then((user) => {
        console.log("user:", user);
      });
    });

    deleteButton.addEventListener("click", () => {
      const confirmed = confirm(
        "Are you sure you want to delete this item? All the users posts also be deleted."
      );
      if (confirmed) {
        let userId = idCell.textContent;
        deleteUserById(userId).then((message) => {
          window.alert(message);
          main();
        });
      }
    });

    userTableBody.appendChild(row);
  });
};

async function deleteUserById(userId) {
  let response = await fetch(commonUrl + `users/${userId}`, {
    method: "DELETE",
  });
  if (response.status == 200) {
    let data = await response.text();
    return data;
  } else {
    let data = await response.json();
    window.alert(data.details);
  }
}

async function getAllPostsByUserId(userId) {
  let response = await fetch(commonUrl + `posts/users/${userId}`);
  let data = await response.json();
  if (response.status == 200) {
    return data;
  } else {
    window.alert(data.details);
  }
}

async function getUserById(userId) {
  let response = await fetch(commonUrl + `users/${userId}`);
  let data = await response.json();
  if (response.status == 200) {
    return data;
  } else {
    window.alert(data.details);
  }
}
