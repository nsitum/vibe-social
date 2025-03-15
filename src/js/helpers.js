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

export const getUser = async function (url, username) {
  try {
    await fetch(`${url}${username}`);
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
    console.err(err);
  }
};
