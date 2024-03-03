// In your server.js file, import express and create an app
const express = require("express");
const app = express();

const { Client } = require("spotify-api.js");
const client = Client.create({
  refreshToken: true,
  token: {
    clientID: "2fb52cb937c4463fa82e1158ba35daeb", // Your spotify application client id.
    clientSecret: "7515671af8db47b7a907fa5e0a640304", // Your spotify application client secret.
  },
});

app.use(express.static("public"));


app.get("/", async (req, res) => {
  try {
    res.sendFile("public/search.html", {root: __dirname});


} catch (error) {
    // Handle any errors, such as database or server issues
    console.error(error);
    res.status(500).send({ message: "An error occurred" });
  }
});


app.get("/api/getAccessToken", async (req, res) => {
  try{
    res.setHeader("Content-Type", "text/plain");

    console.log((await client).token);

    res.send((await client).token);

  } catch (err){
    console.log(err);
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
