const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// Get your Bot Token and Chat ID from environment variables
// We'll set these in the next step (it's more secure!)
const BOT_TOKEN = functions.config().telegram.token;
const CHAT_ID = functions.config().telegram.chat_id;

// This is the function that will be triggered
exports.notifyAdminOnNewRequest = functions.firestore
  .document("pickupRequests/{requestId}")
  .onCreate(async (snapshot, context) => {
    // 1. Get the data from the new document
    const request = snapshot.data();
    const customer = request.customer;
    const device = request.device;

    // 2. Format a nice message
    // Using \n creates a new line in Telegram
    let message = `🔔 *New Pickup Request!*\n\n`;
    message += `*Customer:*\n`;
    message += `  Name: ${customer.name}\n`;
    message += `  Phone: ${customer.phone}\n`;
    if (customer.altPhone) {
      message += `  Alt Phone: ${customer.altPhone}\n`;
    }
    message += `  Address: ${customer.address}\n\n`;
    message += `*Device:*\n`;
    message += `  Model: ${device.brandName} ${device.modelName}\n`;
    message += `  Final Price: *₹${request.finalPrice.toLocaleString("en-IN")}*\n`;

    // 3. Send the message using the Telegram API
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
      await axios.post(url, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown", // This lets us use *bold*
      });
      console.log("Telegram notification sent!");
    } catch (error) {
      console.error("Error sending Telegram message:", error);
    }
  });