const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");

// defines permissions which is set on the authentication token
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com",
];

exports.authenticateUser = async () => {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "credentials.json"),
    scopes: SCOPES,
  });

  return auth;
};
