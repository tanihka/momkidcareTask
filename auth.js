const { OAuth2Client } = require('google-auth-library');

// OAuth2 client configuration
const oauth2Client = new OAuth2Client({
  clientId: '15679233869-etaov50t6439586756jsd9p4e0bicvq7.apps.googleusercontent.com',
  clientSecret: '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',
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
  access_token: 'ya29.a0AfB_byDEmsxYl29fBElEaUrcHhBIQ7mQHavMddwFJ07ocuIxnp8wMiOaOVnWzi16A0YiINznmMclwewr50nsae4X27qLYMCsgWU1pBODN_muCgyVBeasSbT5Fkb1TCYj_fNBFuxufNqrCenUMpgWjpVHERbATKtrCqfe3AaCgYKAWoSARESFQGOcNnCX_VIsndwcRuuXpdqBWKC-w0173',
  refresh_token: '1//04an1a2UFujdyCgYIARAAGAQSNwF-L9IrCiM92OLF5Yztpl2N61VC9P-MuOiFnKUui6AecTdglr0rHAZwRRKfE252yQqi83PYyL0',
});


const expirationTime = oauth2Client.credentials.expiry_date || 0;
const currentTime = new Date().getTime();

if (currentTime >= expirationTime) {
  refreshAccessToken();
}

module.exports = oauth2Client;



