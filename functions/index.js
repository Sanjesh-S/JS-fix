const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const BOT_TOKEN = functions.config().telegram.token;
const CHAT_ID = functions.config().telegram.chat_id;

// This is the function that will be triggered
exports.notifyAdminOnNewRequest = functions.firestore
  .document("pickupRequests/{requestId}")
  .onCreate(async (snapshot, context) => {
    
    // 1. Get the data from the new document
    const request = snapshot.data();
    if (!request) {
      console.log("No data in snapshot.");
      return;
    }

    // --- Safely get all parts of the data ---
    const customer = request.customer || {};
    const device = request.device || {};
    
    // ===================================================
    // THE FIX: Get the new 'schedule' data
    // ===================================================
    const schedule = request.schedule || {};
    // ===================================================

    const price = request.finalPrice || 0;

    // 2. Format a nice message
    let message = `🔔 *New Pickup Request!*\n\n`;
    message += `*Customer:*\n`;
    message += `  Name: ${customer.name || "N/A"}\n`;
    message += `  Phone: ${customer.phone || "N/A"}\n`;
    if (customer.altPhone) {
      message += `  Alt Phone: ${customer.altPhone}\n`;
    }
    message += `  Address: ${customer.address || "N/A"}\n`;
    message += `  City: ${customer.city || "N/A"}\n\n`; // Added city
    
    message += `*Device:*\n`;
    message += `  Model: ${device.brandName || ""} ${device.modelName || "N/As"}\n`;
    message += `  Final Price: *₹${price.toLocaleString("en-IN")}*\n\n`;

    // ===================================================
    // THE FIX: Add the schedule info to the message
    // ===================================================
    message += `*Pickup Slot:*\n`;
    message += `  Date: ${schedule.dateLabel || "Not specified"}\n`;
    message += `  Time: ${schedule.slot || "Not specified"}\n`;
    // ===================================================

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