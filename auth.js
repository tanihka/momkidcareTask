const { OAuth2Client } = require('google-auth-library');

// OAuth2 client configuration
const oauth2Client = new OAuth2Client({
  clientId: 'ADD_YOUR_ID',
  clientSecret: 'ADD_YOUR_SECRET',
  redirectUri: 'http://localhost:3000/callback', 
});

// Function to refresh the access token
async function refreshAccessToken() {
  try {
    const credentials = await oauth2Client.refreshAccessToken();
    const newAccessToken = credentials.credentials.access_token;
    // Set the new access token
    oauth2Client.setCredentials({ access_token: newAccessToken });
    console.log('Access token refreshed successfully.');
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
}

// Setting access and refresh tokens
oauth2Client.setCredentials({
  access_token: 'YOURS_ACCESS_TOKEN',
  refresh_token: 'YOURS_REFRESH_TOKEN',
});


const expirationTime = oauth2Client.credentials.expiry_date || 0;
const currentTime = new Date().getTime();

if (currentTime >= expirationTime) {
  refreshAccessToken();
}

module.exports = oauth2Client;



