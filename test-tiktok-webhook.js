import fetch from "node-fetch";

// CONFIG - Update these with your values
const WEBHOOK_URL =
  "https://nfapcfclofdycraqyipe.supabase.co/functions/v1/tiktok-webhook";
const TIKTOK_TEST_USER_ID = "test_sender_123"; // Mock Sender ID
const BUSINESS_ACCOUNT_ID = "your_tiktok_open_id"; // Your TikTok open_id from tiktok_accounts table

// MOCK PAYLOAD - TikTok DM webhook format
const payload = {
  event: "receive_message",
  content: {
    from_user_id: TIKTOK_TEST_USER_ID,
    to_user_id: BUSINESS_ACCOUNT_ID,
    msg_id: "msg_test_" + Date.now(),
    msg_type: "text",
    text: "Hi, can you tell me about your product?",
    create_time: Math.floor(Date.now() / 1000),
  },
};

console.log(`🚀 Sending test TikTok webhook to: ${WEBHOOK_URL}`);
console.log("Payload:", JSON.stringify(payload, null, 2));

async function runTest() {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("\n✅ Response Status:", response.status);
    console.log("📦 Response Data:", data);

    if (response.status === 200) {
      console.log(
        "\n✨ Success! The TikTok webhook received and processed the event.",
      );
    } else {
      console.log("\n⚠️ Warning: Webhook returned non-200 status.");
    }
  } catch (error) {
    console.error("\n❌ Error sending request:", error.message);
  }
}

runTest();
