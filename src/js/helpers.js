export const sendUser = async function (url, userData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Something went wrong");

    const createdUser = await res.json();
    return createdUser;
  } catch (err) {
    throw err;
  }
};

export const updateUserLikes = async function (url, userId, postsLiked) {
  try {
    const res = await fetch(url + "users/" + userId, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ postsLiked }),
    });
    if (!res.ok) throw new Error("Something went wrong");

    const userLikes = await res.json();
    return userLikes;
  } catch (err) {
    throw err;
  }
};

export const getUser = async function (url, id) {
  try {
    const res = await fetch(url + "users/" + id);
    if (!res.ok) return false;
    const user = await res.json();
    return user;
  } catch (err) {
    throw err;
  }
};

export const getAllUsers = async function (url) {
  try {
    const res = await fetch(url + "users");
    if (!res.ok) throw new Error("Something went wrong");

    const users = res.json();
    return users;
  } catch (err) {
    throw err;
  }
};

export const updateUser = async function (url, user) {
  try {
    console.log(user);
    const res = await fetch(url + "users/" + user.id, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        username: user.username,
        email: user.email,
        ...(user.newPassword && { password: user.newPassword }),
      }),
    });
    if (!res.ok) throw new Error("Something went wrong");
  } catch (err) {
    throw err;
  }
};

export const sendPost = async function (url, data) {
  try {
    const res = await fetch(url + "posts", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Something went wrong");

    const createdPost = await res.json();
    return createdPost;
  } catch (err) {
    throw err;
  }
};

export const getOnePost = async function (url, id) {
  try {
    const res = await fetch(url + "posts/" + id);
    if (!res.ok) throw new Error("Something went wrong");

    const post = res.json();
    return post;
  } catch (err) {
    throw err;
  }
};

export const getAllPosts = async function (url) {
  try {
    const res = await fetch(url + "posts");
    if (!res.ok) throw new Error("Something went wrong");

    const posts = res.json();
    return posts;
  } catch (err) {
    throw err;
  }
};

export const editOnePost = async function (url, editedPost) {
  try {
    const res = await fetch(url + "posts/" + editedPost.id, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(editedPost),
    });
    if (!res.ok) throw new Error("Something went wrong");

    const post = res.json();
    return post;
  } catch (err) {
    throw err;
  }
};

export const deleteOnePost = async function (url, id) {
  try {
    const res = await fetch(url + "posts/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
    });
    if (!res.ok) throw new Error("Something went wrong");
  } catch (err) {
    throw err;
  }
};

export const addAComment = async function (url, data) {
  try {
    const res = await fetch(url + "comments", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Something went wrong");

    const comment = await res.json();
    return comment;
  } catch (err) {
    throw err;
  }
};

export const addCommentToPost = async function (url, comments, id) {
  try {
    const res = await fetch(url + "posts/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ comments }),
    });
    if (!res.ok) throw new Error("Something went wrong");
  } catch (err) {
    throw err;
  }
};

export const getAllComments = async function (url) {
  try {
    const res = await fetch(url + "comments");
    if (!res.ok) throw new Error("Something went wrong");

    const comments = await res.json();
    return comments;
  } catch (err) {
    throw err;
  }
};

export const deleteComment = async function (url, id) {
  try {
    const res = await fetch(url + "comments/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
      },
    });
    if (!res.ok) throw new Error("Something went wrong");
  } catch (err) {
    throw err;
  }
};

export const updateCommentUser = async function (url, id, commentUser) {
  try {
    const res = await fetch(url + "comments/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ authorUser: commentUser }),
    });
    if (!res.ok) throw new Error("Something went wrong");
  } catch (err) {
    throw err;
  }
};

export const getPostsCommentsAndUsers = async function (url1, url2) {
  const postsPromise = fetch(url1 + "posts").then((res) => res.json());
  const commentsPromise = fetch(url2 + "comments").then((res) => res.json());
  const usersPromise = fetch(url1 + "users").then((res) => res.json());

  const [posts, comments, users] = await Promise.all([
    postsPromise,
    commentsPromise,
    usersPromise,
  ]);
  return [posts, comments, users];
};

export const uploadPicture = async function (url, picture) {
  try {
    const res = await fetch(url, {
      method: "POST",
      body: picture,
    });
    if (!res.ok) throw new Error("Something went wrong");

    const data = await res.json();
    if (data.success) return data;
    else throw new Error("Error uploading a picture");
  } catch (err) {
    throw err;
  }
};

export const updateUserProfilePicture = async function (url, id, pictureUrl) {
  try {
    const res = await fetch(url + "users/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        pictureUrl,
      }),
    });
    if (!res.ok) throw new Error("Something went wrong");
  } catch (err) {
    throw err;
  }
};
