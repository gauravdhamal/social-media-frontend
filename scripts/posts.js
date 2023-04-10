import navbar from "../components/navbar.js";

document.getElementById("navbar").innerHTML = navbar();

let commonUrl = "https://social-media-backend-production-a70f.up.railway.app/";

let createPostButton = document.getElementById("createPostButton");
let updatePostButton = document.getElementById("updatePostButton");

let createPostDiv = document.getElementById("createPostDiv");
let updatePostDiv = document.getElementById("updatePostDiv");

createPostButton.addEventListener("click", () => {
  updatePostDiv.style.display = "none";
  createPostDiv.style.display = "block";
});

updatePostButton.addEventListener("click", () => {
  updatePostDiv.style.display = "block";
  createPostDiv.style.display = "none";
});

let closeCreatePost = document.getElementById("closeCreatePost");
let closeUpdatePost = document.getElementById("closeUpdatePost");

closeCreatePost.addEventListener("click", () => {
  createPostDiv.style.display = "none";
});

closeUpdatePost.addEventListener("click", () => {
  updatePostDiv.style.display = "none";
});

// Create post data
let postPostForm = document.getElementById("postPostForm");

postPostForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);

  let content = formData.get("content");

  let postObject = {
    content: "someContent",
  };

  postObject.content = content;

  createPost(postObject);
});

// Create post POST request method.
let createPost = (postObject) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postObject),
  };

  fetch(commonUrl + `posts/`, options)
    .then((response) => {
      if (response.status == 201) {
        return response.json();
      } else {
        window.alert("Enter data");
      }
    })
    .then((savedPostObject) => {
      if (savedPostObject.description == "Validation error") {
        window.alert(savedPostObject.details);
      } else {
        window.alert(`Post created with Id : ${savedPostObject.id}`);
        main();
      }
      postPostForm.reset();
    })
    .catch((error) => console.error("error : ", error));
};

// Update post data
let postUpdateForm = document.getElementById("postUpdateForm");

postUpdateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);

  let id = formData.get("id");
  let content = formData.get("content");

  let postObject = {
    id: 0,
    content: "someContent",
  };

  postObject.id = id;
  postObject.content = content;

  updatePost(postObject);
});

// Update post PUT request method.
let updatePost = (postObject) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postObject),
  };

  fetch(commonUrl + `posts/${postObject.id}`, options)
    .then((response) => {
      return response.json();
    })
    .then((updatedPostObject) => {
      if (updatedPostObject.description == "Validation error") {
        window.alert(updatedPostObject.details);
      } else if (
        updatedPostObject.description == `uri=/posts/${postObject.id}`
      ) {
        window.alert(updatedPostObject.details);
      } else {
        window.alert(`Post updated.`);
        main();
      }
      postUpdateForm.reset();
    })
    .catch((error) => console.error("error : ", error));
};

// Get all posts
async function main() {
  let data = await getAllPosts();
  appendPosts(data);
}

main();

// Get all posts
async function getAllPosts() {
  let response = await fetch(commonUrl + `analytics/posts`);
  let data = await response.json();
  if (response.status == 200) {
    return data;
  } else {
    console.log(response);
  }
}

let updatePostDynamic = document.getElementById("updatePostDynamic");

let dynamicPostUpdateForm = document.getElementById("dynamicPostUpdateForm");

let closeUpdateUser = document.getElementById("closeUpdateUser");
closeUpdateUser.addEventListener("click", () => {
  updatePostDynamic.style.display = "none";
});

let appendPosts = (arrayOfPosts) => {
  let postTableBody = document.getElementById("postTableBody");
  postTableBody.innerHTML = "";
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

    const viewCell = document.createElement("td");
    const viewUserButton = document.createElement("button");
    viewUserButton.setAttribute("class", "tableButton");
    viewUserButton.textContent = "Get User";
    viewCell.append(viewUserButton);
    row.appendChild(viewCell);
    viewUserButton.addEventListener("click", () => {
      let postId = idCell.textContent;
      getUserByPostId(postId).then((user) => {
        if (user == undefined) {
          window.alert(`No any user assigned to post : ${postId}`);
        } else {
          console.log("user:", user);
        }
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
      updatePostDynamic.style.display = "block";
      let postId = idCell.textContent;
      getPostById(postId).then((post) => {
        oldcontent.innerText = post.content;
        dynamicPostUpdateForm.addEventListener("submit", (event) => {
          event.preventDefault();

          let formData = new FormData(event.target);

          let content = formData.get("newcontent");

          let postObject = {
            id: 0,
            content: "someContent",
          };

          postObject.id = post.id;
          postObject.content = content;

          updatePost(postObject);
          content.textContent = "";
        });
      });
    });

    deleteButton.addEventListener("click", () => {
      const confirmed = confirm("Are you sure you want to delete this item?");
      if (confirmed) {
        let postId = idCell.textContent;
        deletePost(postId).then((message) => {
          window.alert(message);
          main();
        });
      }
    });

    const likeUnlikeCell = document.createElement("td");
    const likeButton = document.createElement("button");
    likeButton.setAttribute("class", "tableButton");
    likeButton.textContent = "Like";
    likeButton.style.backgroundColor = "green";
    likeButton.style.border = "green";
    const unlikeButton = document.createElement("button");
    unlikeButton.setAttribute("class", "tableButton");
    unlikeButton.textContent = "Unlike";
    unlikeButton.style.backgroundColor = "red";
    unlikeButton.style.border = "red";
    likeUnlikeCell.append(likeButton, " / ", unlikeButton);
    row.appendChild(likeUnlikeCell);
    likeButton.addEventListener("click", () => {
      let postId = idCell.textContent;
      likePostById(postId).then((message) => {
        main();
      });
    });

    unlikeButton.addEventListener("click", () => {
      let postId = idCell.textContent;
      unlikePostById(postId).then((message) => {
        main();
      });
    });

    const addUserCell = document.createElement("td");
    const inputUserId = document.createElement("input");
    inputUserId.setAttribute("id", "tableInput");
    const addUserButton = document.createElement("button");
    addUserButton.setAttribute("class", "tableButton");
    inputUserId.setAttribute("type", "number");
    inputUserId.placeholder = "Enter UserID...";
    addUserButton.textContent = "Add";
    addUserCell.append(inputUserId, addUserButton);
    row.appendChild(addUserCell);
    addUserButton.addEventListener("click", () => {
      let userId = inputUserId.value;
      let postId = idCell.textContent;
      console.log(userId);
      if (!userId) {
        window.alert(`Enter userId to continue...`);
      } else {
        asignPostToUser(postId, userId).then((message) => {
          if (message != undefined) {
            window.alert(message);
          }
        });
        inputUserId.value = "";
      }
    });

    postTableBody.appendChild(row);
  });
};

async function getUserByPostId(postId) {
  let response = await fetch(commonUrl + `posts/user/${postId}`);
  if (response.status == 200) {
    let data = await response.json();
    return data;
  }
}

async function likePostById(postId) {
  let response = await fetch(commonUrl + `posts/${postId}/like`, {
    method: "POST",
  });
  if (response.status == 202) {
    let data = await response.text();
    window.alert(`Post liked.`);
    return data;
  }
}

async function unlikePostById(postId) {
  let response = await fetch(commonUrl + `posts/${postId}/unlike`, {
    method: "POST",
  });
  if (response.status == 202) {
    let data = await response.text();
    window.alert(`Post unliked.`);
    return data;
  } else {
    let data = await response.json();
    window.alert(data.details);
  }
}

async function deletePost(postId) {
  let response = await fetch(commonUrl + `posts/${postId}`, {
    method: "DELETE",
  });
  if (response.status == 202) {
    let data = await response.text();
    return data;
  } else {
    let data = await response.json();
    if (data.description == `uri=/posts/${postId}`) {
      window.alert(data.details);
    }
  }
}

async function getPostById(postId) {
  let response = await fetch(commonUrl + `posts/${postId}`);
  if (response.status == 200) {
    let data = await response.json();
    return data;
  }
}

async function asignPostToUser(postId, userId) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  };

  let response = await fetch(commonUrl + `posts/${postId}/${userId}`, options);
  if (response.status == 202) {
    let data = await response.text();
    return data;
  } else {
    let data = await response.json();
    window.alert(data.details);
  }
}
