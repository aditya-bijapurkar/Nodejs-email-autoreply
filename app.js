// Author: Aditya Bijapurkar

// modules imported for creating an express application
const express = require("express");
require("dotenv").config();
const { authenticateUser } = require("./authenticate");
const { filterEmails, sendReplies } = require("./controllers");

const port = process.env.PORT;
const app = express();

app.get("/", async (req, res) => {
  // uses google-auth to verify a user
  const auth = await authenticateUser();
  console.log("checking emails");

  // main function is called randomly every 45-120 seconds
  async function main() {
    setInterval(async () => {
      const messages = await filterEmails(auth);
      await sendReplies(auth, messages);
    }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);
  }

  main();

  res.sendFile("D:/email autoreply-nodejs/home.html");
});

// starting express application
app.listen(port, () => {
  console.log(`docker image is running on container port: ${port}`);
});
