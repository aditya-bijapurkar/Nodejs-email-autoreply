// gmail variable is created using googleapis which takes authenticated token as a parameter giving access to mailbox functionality to the variable
const { google } = require("googleapis");

// emails which have the query as 'unread' are only added to the return array
const filterEmails = async (auth) => {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    q: "is:unread",
  });

  return response.data.messages || [];
};

// creating label for all mails handeled by the node application
const createLabel = async (auth) => {
  const gmail = google.gmail({ version: "v1", auth });

  // try creating new label
  try {
    const response = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: "openinapp-test",
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    return response.data.id;
  } catch (error) {
    // if the label already exists, we can ignore this
    if (error.code === 409) {
      const response = await gmail.users.labels.list({
        userId: "me",
      });
      const label = response.data.labels.find(
        (label) => label.name === "openinapp-test"
      );
      return label.id;
    }
    // other error than conflicting label
    else {
      throw error;
    }
  }
};

// first check if mails have been replied before, if not then create a reply-email and send it
const sendReplies = async (auth, messages) => {
  const gmail = google.gmail({ version: "v1", auth });

  // label required to tag new emails
  const labelId = await createLabel(auth);

  if (messages && messages.length > 0)
    for (const message of messages) {
      const messageData = await gmail.users.messages.get({
        auth,
        userId: "me",
        id: message.id,
      });

      const email = messageData.data;

      // this boolean variable checks if mail has been replied to before
      const replied = email.payload.headers.some(
        (header) => header.name === "In-Reply-To"
      );

      if (!replied) {
        // creating a reply-message
        const replyMessage = {
          userId: "me",
          resource: {
            raw: Buffer.from(
              `To: ${
                email.payload.headers.find((header) => header.name === "From")
                  .value
              }\r\n` +
                `Subject: Re: ${
                  email.payload.headers.find(
                    (header) => header.name === "Subject"
                  ).value
                }\r\n` +
                `Content-Type: text/plain; charset="UTF-8"\r\n` +
                `Content-Transfer-Encoding: 7bit\r\n\r\n` +
                `This is an auto-generated email from Gmail API.\n The owner of this account will get in touch ASAP.\nThankyou for your patience!\r\n`
            ).toString("base64"),
          },
        };

        // sending the reply using gmail api
        await gmail.users.messages.send(replyMessage);

        console.log("reply sent successfully");
      }

      // adding this mail to the custom label and removing from the 'INBOX' section.
      gmail.users.messages.modify({
        auth,
        userId: "me",
        id: message.id,
        resource: {
          addLabelIds: [labelId],
          removeLabelIds: ["INBOX"],
        },
      });
    }
};

module.exports = {
  filterEmails,
  sendReplies,
};
