export const sendUser = async function (url, userData) {
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(userData),
    });
    alert("Uspješno ste kreirali račun!");
  } catch (err) {
    // Temp handling
    console.error(err);
  }
};
