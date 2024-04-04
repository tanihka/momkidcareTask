const { google } = require('googleapis');
const oauth2Client = require('./auth'); 
const mongoose = require('mongoose');
const Email = require('./model/email'); 
const cron = require('node-cron'); 

// Create a Gmail API client
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });


cron.schedule('*/30 * * * * *', async () => {
  console.log('Checking for new emails...');
  await fetchAndStoreLatestEmail();
});

async function fetchAndStoreLatestEmail() {
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 1,
      q: 'in:inbox', 
    });

    const latestEmail = response.data.messages[0];

    if (latestEmail) {
      const emailContent = await gmail.users.messages.get({
        userId: 'me',
        id: latestEmail.id,
      });

      // Extract email data from emailContent
      const sender = emailContent.data.payload.headers.find(header => header.name === 'From').value;
      const subject = emailContent.data.payload.headers.find(header => header.name === 'Subject').value;
      const body = emailContent.data.snippet;
      const date = new Date(parseInt(emailContent.data.internalDate));

      // Extract messageId
      const messageId = emailContent.data.id;

      // Check if an email with the same messageId already exists in the database
      const existingEmail = await Email.findOne({ messageId });

      if (!existingEmail) {
        // Create a new Email document and save it to the database
        const newEmail = new Email({
          sender,
          subject,
          body,
          date,
          messageId,
        });

        await newEmail.save();

        console.log('Email saved to the database.');

        // Extract and forward the relevant data
        const extractedData = extractDataFromBody(body);
        if (extractedData) {
          await forwardExtractedData(sender, extractedData, subject);
        }
      } else {
        console.log('Email already exists in the database. Skipping.');
      }
    } else {
      console.log('No emails found in the inbox.');
    }
  } catch (error) {
    console.error('Error fetching and storing the latest email:', error);
  }
}

// Function to extract relevant data from email body
function extractDataFromBody(body) {
  try {
    
    const keyValuePairs = body.split(/\s*,\s*|\n/);

    const parsedData = {};
    
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split(/\s*:\s*/);
      if (key && value) {
        if (/phone\s*no/i.test(key)) {
          const phoneNumber = value.split(/\s+/)[0]; 
          parsedData['Phone no'] = phoneNumber;
        } else if (/name/i.test(key)) {
          parsedData['Name'] = value;
        } else {
          parsedData[key] = value;
        }
      }
    });

    return parsedData;
  } catch (error) {
    console.error('Error extracting data from email body:', error);
    return null;
  }
}

// Function to forward relevant extracted data to another address
async function forwardExtractedData(sender, extractedData, subject) {
  try {
  
    const { Name, 'Phone no': phoneNumber } = extractedData;
    const forwardedBody = `Name: ${Name?Name:'Name is not provided'}, Phone no: ${phoneNumber?phoneNumber:'Phone no. is not provided'}`;

    const forwardedSubject = `Fwd: ${subject}`;
    const forwardedEmail = `To: taanishkag078@gmail.com\nSubject: ${forwardedSubject}\n\n${forwardedBody}`;

    const forwardedEmailResponse = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: Buffer.from(forwardedEmail).toString('base64'),
      },
    });

    if (forwardedEmailResponse.status === 200) {
      console.log(`Email forwarded to: taanishkag078@gmail.com`);
    } else {
      console.error('Error forwarding email:', forwardedEmailResponse.statusText);
    }
  } catch (error) {
    console.error('Error forwarding email:', error);
  }
}

module.exports = fetchAndStoreLatestEmail;
