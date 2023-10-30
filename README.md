# Nodejs-email-autoreply

This application uses google APIs and google-auth to monitor emails

Steps:
  1. Create a google account
  2. Create a google cloud project on https://console.cloud.google.com/
  3. Go to 'API and services' section
  4. Go to 'credentials' and generate new credentials for 'OAuth Client Id'
  5. Select application type as 'web application'
  6. Go back to credentials tab and check 'OAuth 2.0 Client IDs'
  7. Download the file in json format and rename as 'credentials.json' and save it in the root directory of the project
  8. CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN are needed for this to work

  9. Make a .env file
  10. assign a port number where this application will run, (ex: PORT=8000)
  11. application is now ready to run
      
