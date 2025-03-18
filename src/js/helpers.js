export const sendUser = async function (url, userData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(userData),
    });
    const createdUser = await res.json();
    return createdUser;
  } catch (err) {
    throw err;
  }
};

export const getUser = async function (url, id) {
  try {
    const res = await fetch(`${url}users/${id}`);
    const user = await res.json();
    return user;
  } catch (err) {
    throw err;
  }
};

export const getAllUsers = async function (url) {
  try {
    const res = await fetch(url + "users");
    const users = res.json();
    return users;
  } catch (err) {
    console.error(err);
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
    const createdPost = await res.json();
    return createdPost;
  } catch (err) {
    console.error(err);
  }
};

export const getAllPosts = async function (url) {
  try {
    const res = await fetch(url + "posts");
    const posts = res.json();
    return posts;
  } catch (err) {
    console.error(err);
  }
};
