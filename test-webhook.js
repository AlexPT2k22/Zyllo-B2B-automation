import fetch from "node-fetch";

// CONFIG
const WEBHOOK_URL =
  "https://nfapcfclofdycraqyipe.supabase.co/functions/v1/instagram-webhook";
const INSTAGRAM_TEST_USER_ID = "17841460066408109"; // Mock Sender ID
const BUSINESS_ACCOUNT_ID = "25437298245952100"; // ID from your screenshot

// MOCK PAYLOAD - Matching Meta's Test Webhook format
// Meta's test webhook sends messages via the "changes" array
const payload = {
  object: "instagram",
  entry: [
    {
      id: "25437298245952100",
      time: Date.now(),
      changes: [
        {
          field: "messages",
          value: {
            sender: { id: "17841460066408109" },
            recipient: { id: "25437298245952100" },
            timestamp: String(Math.floor(Date.now() / 1000)), // Meta sends as string
            message: {
              mid: "m_mid.test_" + Date.now(),
              text: "Hi, can you tell me about your product?",
            },
          },
        },
      ],
    },
  ],
};

console.log(`🚀 Sending test webhook to: ${WEBHOOK_URL}`);
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
        "\n✨ Success! The webhook received and processed the event.",
      );
    } else {
      console.log("\n⚠️ Warning: Webhook returned non-200 status.");
    }
  } catch (error) {
    console.error("\n❌ Error sending request:", error.message);
  }
}

runTest();
