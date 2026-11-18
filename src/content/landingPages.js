// Content for the non-branded, high-intent landing pages.
// Each entry is rendered by src/pages/landing/LandingPage.jsx and its
// metadata/schema is picked up automatically by src/seo/routes.js.

export const landingPages = {
  "instagram-dm-automation": {
    path: "/instagram-dm-automation",
    navLabel: "Instagram DM Automation",
    platform: "instagram",
    seo: {
      title: "Instagram DM Automation for E-commerce Shops | Zyllo",
      description:
        "Automate Instagram DMs for sales. Zyllo replies to comments and DMs in seconds, sends product links and follows up with AI. Built for e-commerce shops.",
    },
    hero: {
      eyebrow: "Instagram DM automation for e-commerce",
      h1: "Turn every Instagram comment and DM into a sale",
      sub: "Zyllo answers \"price?\", \"link?\" and \"do you ship?\" in seconds, sends the right product link by DM and follows up with shoppers who go quiet — 24/7, without you living in the inbox.",
      highlights: [
        "Comment-to-DM in under 2 seconds",
        "Official Meta API",
        "Set up in ~10 minutes",
      ],
    },
    pains: {
      h2: "Your Instagram inbox is leaking sales",
      intro:
        "Most shoppers who comment \"price?\" never come back if they don't get an answer fast. Every unanswered comment is a customer buying from someone else.",
      items: [
        {
          h3: "Leads die in the comments",
          body: "A Reel takes off and you get 300 comments asking for the price. By the time you reply manually, most of those buyers have scrolled away.",
        },
        {
          h3: "Slow replies kill impulse buys",
          body: "Instagram shopping is impulsive. A reply 3 hours later reaches someone who has already forgotten why they wanted the product.",
        },
        {
          h3: "No one follows up",
          body: "Shoppers ask about sizes, then go silent. Without a follow-up, warm leads quietly turn into lost sales.",
        },
      ],
    },
    chat: {
      h2: "What Instagram DM automation looks like with Zyllo",
      caption:
        "A shopper comments a keyword on your Reel. Zyllo replies publicly, opens the DM, answers the question and follows up — automatically.",
      messages: [
        { from: "user", text: "Commented \"LINK\" on your Reel" },
        {
          from: "bot",
          text: "Hey Maya! Here's the Linen Summer Dress 👗 Sizes XS–XL are in stock: yourshop.com/linen-dress",
        },
        { from: "user", text: "Do you ship to Texas?" },
        {
          from: "bot",
          text: "Yes! Free US shipping over $50, delivered in 3–5 days. Want me to hold a size M for you?",
        },
        { from: "bot", text: "(24h later) Still thinking about it? Your size M is still available ✨", muted: true },
      ],
    },
    steps: {
      h2: "How to automate Instagram DMs for sales in 3 steps",
      items: [
        {
          h3: "Connect your Instagram business account",
          body: "Log in with Meta in one click. Zyllo uses the official Instagram Messaging API — no passwords shared, no unofficial bots.",
        },
        {
          h3: "Pick a sales flow and add keywords",
          body: "Choose a template like \"comment → DM product link\" or \"price question → answer + checkout link\" and add your trigger words.",
        },
        {
          h3: "Let AI handle the follow-up",
          body: "Zyllo answers common questions, tags hot leads and nudges shoppers who go quiet, so you only step in when a human touch closes the sale.",
        },
      ],
    },
    benefits: {
      h2: "Built for Instagram shops, not generic chatbots",
      items: [
        {
          h3: "Comment-to-DM automation",
          body: "Auto-reply publicly and send a private DM with the product link whenever someone comments your keyword on a post or Reel.",
        },
        {
          h3: "Story mention & Story reply triggers",
          body: "Thank people who tag you in Stories or reply to them, and send a first-order discount while they're paying attention.",
        },
        {
          h3: "AI sales follow-ups",
          body: "Re-engage shoppers who asked a question and went silent, within Instagram's 24-hour messaging window.",
        },
        {
          h3: "Lead qualification & tags",
          body: "Tag buyers by intent (price, size, wholesale) and route high-value conversations to your team.",
        },
        {
          h3: "Abandoned cart recovery by DM",
          body: "Remind shoppers about the product they asked about, with a direct link back to checkout.",
        },
        {
          h3: "One inbox for Instagram & TikTok",
          body: "Manage automated and manual conversations from both platforms in a single dashboard.",
        },
      ],
    },
    comparison: {
      h2: "Manual replies vs. Zyllo Instagram automation",
      columns: ["Zyllo", "Manual replies", "Generic chatbot"],
      rows: [
        { label: "Average response time", values: ["< 2 seconds", "Hours", "Seconds"] },
        { label: "Works nights & weekends", values: ["Yes", "No", "Yes"] },
        { label: "E-commerce sales templates", values: ["Built-in", "—", "Build your own"] },
        { label: "Automatic follow-ups", values: ["AI-assisted", "If you remember", "Manual sequences"] },
        { label: "Setup time", values: ["~10 minutes", "—", "Hours to days"] },
      ],
    },
    faqs: [
      {
        question: "Is Instagram DM automation allowed?",
        answer:
          "Yes, when it runs through Meta's official Instagram Messaging API, like Zyllo does. Automation must respect Instagram's rules — for example, replying within the 24-hour messaging window after a user contacts you.",
      },
      {
        question: "Can Zyllo send a DM when someone comments on my post?",
        answer:
          "Yes. Comment-to-DM is Zyllo's core feature: when someone comments a keyword on a post or Reel, Zyllo can reply to the comment publicly and send them a private DM with the product link.",
      },
      {
        question: "Do I need an Instagram business account?",
        answer:
          "Yes. Instagram's messaging API is available to Professional (Business or Creator) accounts connected to a Facebook Page. Switching is free and takes a minute.",
      },
      {
        question: "Will automated DMs sound robotic?",
        answer:
          "You control the tone. Zyllo uses your own templates and product info, and AI-assisted replies are written to sound like your brand — short, friendly and helpful.",
      },
      {
        question: "How much does Zyllo cost?",
        answer:
          "Plans are planned to start at €29/month. Early-access members on the waitlist get launch pricing.",
      },
    ],
    finalCta: {
      h2: "Stop losing sales in your Instagram comments",
      body: "Join the early-access list and be among the first shops to automate Instagram DMs with Zyllo.",
    },
    related: ["tiktok-dm-automation", "manychat-alternative"],
    relatedPosts: ["how-to-automate-instagram-dms-for-ecommerce"],
  },

  "tiktok-dm-automation": {
    path: "/tiktok-dm-automation",
    navLabel: "TikTok DM Automation",
    platform: "tiktok",
    seo: {
      title: "TikTok DM Automation: Turn Comments into Sales | Zyllo",
      description:
        "TikTok comment-to-DM automation for shops. Zyllo replies to every comment, answers DMs and follows up with buyers so viral videos turn into orders.",
    },
    hero: {
      eyebrow: "TikTok DM & comment automation",
      h1: "Turn TikTok comments into sales on autopilot",
      sub: "When a video goes viral, hundreds of people ask \"where can I buy this?\". Zyllo replies to every comment, moves buyers into DMs and follows up — while the video is still trending.",
      highlights: [
        "Reply to every comment instantly",
        "Official TikTok business APIs",
        "Works alongside TikTok Shop",
      ],
    },
    pains: {
      h2: "Viral videos don't pay if comments go unanswered",
      intro:
        "TikTok traffic is huge but short-lived. The window between \"I want this\" and \"next video\" is a few seconds — and most shops miss it.",
      items: [
        {
          h3: "Comment floods you can't keep up with",
          body: "A video hits the For You page and 1,000 comments arrive overnight. Answering them by hand is impossible, so buyers go unanswered.",
        },
        {
          h3: "\"Link?\" comments that never convert",
          body: "Shoppers ask for the link in the comments, but TikTok doesn't make it easy to get it to them. Without a fast reply, the sale is gone.",
        },
        {
          h3: "Trending moments are short",
          body: "A video's peak can last 24–48 hours. If your replies arrive after that, you've paid for the attention without getting the orders.",
        },
      ],
    },
    chat: {
      h2: "TikTok comment-to-DM automation in action",
      caption:
        "A viewer comments on your video. Zyllo replies to the comment, sends the details by DM where available and follows up with interested buyers.",
      messages: [
        { from: "user", text: "Commented \"where can I buy this??\"" },
        {
          from: "bot",
          text: "Replied: \"Just sent you the link in DMs 💌\"",
          muted: true,
        },
        {
          from: "bot",
          text: "Hi! That's our Cloud Lip Tint in shade Peach 🍑 Shop it here: yourshop.com/cloud-tint",
        },
        { from: "user", text: "is it vegan?" },
        {
          from: "bot",
          text: "Yes — 100% vegan and cruelty-free. Use code TIKTOK10 for 10% off your first order!",
        },
      ],
    },
    steps: {
      h2: "How TikTok DM automation works with Zyllo",
      items: [
        {
          h3: "Connect your TikTok business account",
          body: "Authorize Zyllo through TikTok's official login. No passwords, no browser bots, no risk to your account.",
        },
        {
          h3: "Set keywords for comments and DMs",
          body: "Choose triggers like \"link\", \"price\" or \"how much\" and the reply each one should get — a public comment reply, a DM, or both.",
        },
        {
          h3: "Capture and follow up with buyers",
          body: "Zyllo answers product questions, shares your link or TikTok Shop product and follows up with shoppers who don't buy right away.",
        },
      ],
    },
    benefits: {
      h2: "Everything you need to sell from TikTok comments",
      items: [
        {
          h3: "Instant comment replies",
          body: "Reply to every relevant comment on every video, even when a post blows up at 3 a.m.",
        },
        {
          h3: "Comment-to-DM handoff",
          body: "Move interested buyers from public comments into a private conversation where you can actually close the sale.",
        },
        {
          h3: "Keyword-based flows",
          body: "Different keywords trigger different answers — price, shipping, sizing, ingredients or discount codes.",
        },
        {
          h3: "AI follow-ups",
          body: "Shoppers who asked but didn't buy get a timely, friendly nudge instead of being forgotten.",
        },
        {
          h3: "Lead tagging",
          body: "Know which videos and keywords generate real buyers, and which just generate views.",
        },
        {
          h3: "Instagram + TikTok together",
          body: "Run the same sales playbook on both platforms from one dashboard.",
        },
      ],
    },
    comparison: {
      h2: "Answering TikTok comments manually vs. with Zyllo",
      columns: ["Zyllo", "Manual replies", "Ignoring comments"],
      rows: [
        { label: "Comments answered on a viral video", values: ["All of them", "A fraction", "None"] },
        { label: "Reply speed", values: ["Seconds", "Hours", "Never"] },
        { label: "Follow-up with interested buyers", values: ["Automatic", "Rarely", "No"] },
        { label: "Your time per day", values: ["Minutes", "Hours", "0 — and 0 sales"] },
      ],
    },
    faqs: [
      {
        question: "Can you automate DMs on TikTok?",
        answer:
          "Yes, through TikTok's official business APIs. Zyllo can reply to comments automatically and, where TikTok's messaging API is available for your account and region, send and answer DMs. We'll confirm what's available for your account during onboarding.",
      },
      {
        question: "What is TikTok comment-to-DM automation?",
        answer:
          "It's a flow where a comment containing a keyword (like \"link\" or \"price\") automatically triggers a reply — publicly in the comments and privately in DMs — so interested viewers get the product details instantly.",
      },
      {
        question: "Does Zyllo work with TikTok Shop?",
        answer:
          "Zyllo works alongside TikTok Shop: your automated replies can point shoppers to your TikTok Shop products or to your own store.",
      },
      {
        question: "Is TikTok automation safe for my account?",
        answer:
          "Zyllo only uses TikTok's official APIs and permissions you approve. It doesn't use scraping, fake engagement or browser automation, which are the practices that put accounts at risk.",
      },
      {
        question: "Do I need a TikTok business account?",
        answer:
          "Yes, a TikTok Business account is required to connect to TikTok's business APIs. Switching is free in the TikTok app settings.",
      },
    ],
    finalCta: {
      h2: "Your next viral video should come with sales",
      body: "Join the Zyllo waitlist and get early access to TikTok comment and DM automation.",
    },
    related: ["instagram-dm-automation", "manychat-alternative"],
    relatedPosts: ["turn-tiktok-comments-into-sales-automated-dms"],
  },

  "manychat-alternative": {
    path: "/manychat-alternative",
    navLabel: "ManyChat Alternative",
    platform: "both",
    seo: {
      title: "ManyChat Alternative for E-commerce Shops | Zyllo",
      description:
        "A simpler ManyChat alternative for e-commerce: Instagram & TikTok DM automation with ready-made sales flows, AI follow-ups and flat pricing.",
    },
    hero: {
      eyebrow: "The ManyChat alternative for e-commerce",
      h1: "A simpler ManyChat alternative built for online shops",
      sub: "ManyChat is a powerful, general-purpose chatbot builder. Zyllo does one thing: turn Instagram and TikTok conversations into sales for e-commerce brands — with ready-made flows instead of a blank canvas.",
      highlights: [
        "Sales templates, not a flow builder",
        "Instagram + TikTok",
        "Flat plans from €29/mo",
      ],
    },
    pains: {
      h2: "Why e-commerce shops look for a ManyChat alternative",
      intro:
        "General chatbot builders are flexible — and that flexibility has a cost for small shops that just want more sales from their DMs.",
      items: [
        {
          h3: "Too much to set up",
          body: "Building flows node by node takes hours. Many shop owners give up before their first automation is live.",
        },
        {
          h3: "Built for every industry",
          body: "Templates for coaches, restaurants and creators aren't the same as flows built around products, sizes, stock and checkout links.",
        },
        {
          h3: "Costs that grow with your audience",
          body: "Pricing tied to contact count means your bill can climb every time a post goes viral — even if those contacts never buy.",
        },
      ],
    },
    chat: {
      h2: "Simple Instagram DM automation, ready in minutes",
      caption:
        "Pick a template, add your keyword and product link, switch it on. That's the whole setup.",
      messages: [
        { from: "user", text: "Commented \"PRICE\" on your post" },
        {
          from: "bot",
          text: "Hi Jordan! The Vintage Denim Jacket is $68 🧥 Only 3 left in size M: yourshop.com/denim",
        },
        { from: "user", text: "do you have it in L?" },
        {
          from: "bot",
          text: "Size L sold out this morning, but it's restocking Friday. Want a DM when it's back?",
        },
      ],
    },
    steps: {
      h2: "Switching from ManyChat to Zyllo",
      items: [
        {
          h3: "List the automations that actually drive sales",
          body: "Most shops rely on 3–5 flows: comment-to-DM, price questions, shipping questions, story mentions and follow-ups.",
        },
        {
          h3: "Recreate them from Zyllo templates",
          body: "Each of those flows exists as a ready-made Zyllo template. Add your keywords, links and tone — no node-building required.",
        },
        {
          h3: "Connect Instagram and TikTok",
          body: "Authorize your accounts through the official Meta and TikTok APIs and switch your flows on.",
        },
      ],
    },
    benefits: {
      h2: "What makes Zyllo different",
      items: [
        {
          h3: "E-commerce first",
          body: "Every template is built around products, prices, sizes, stock and checkout — not generic lead capture.",
        },
        {
          h3: "Instagram + TikTok in one place",
          body: "Run the same sales playbook across both platforms from one dashboard.",
        },
        {
          h3: "AI follow-ups included",
          body: "Re-engage shoppers who asked a question and went quiet, without building sequences by hand.",
        },
        {
          h3: "Flat, predictable pricing",
          body: "Plans are planned at a flat monthly price, so a viral post doesn't blow up your bill.",
        },
        {
          h3: "Setup in ~10 minutes",
          body: "Templates and smart defaults mean your first automation can be live the same afternoon.",
        },
        {
          h3: "Sales analytics",
          body: "See which posts, keywords and flows bring in buyers — not just how many messages were sent.",
        },
      ],
    },
    comparison: {
      h2: "Zyllo vs. ManyChat at a glance",
      columns: ["Zyllo", "ManyChat"],
      rows: [
        { label: "Built for", values: ["E-commerce shops on Instagram & TikTok", "Any business, many channels"] },
        { label: "Setup approach", values: ["Ready-made sales templates", "Flexible visual flow builder"] },
        { label: "Learning curve", values: ["Minutes", "Low for basics, steeper for complex flows"] },
        { label: "Pricing model", values: ["Flat plans from €29/mo", "Scales with your contact count"] },
        { label: "AI sales follow-ups", values: ["Included", "Available as a paid add-on"] },
        { label: "Channels", values: ["Instagram, TikTok", "Instagram, Messenger, WhatsApp, SMS and more"] },
        { label: "Availability", values: ["Early access (waitlist)", "Generally available"] },
      ],
      note: "Comparison based on publicly available information as of November 2026. ManyChat is a trademark of its respective owner; Zyllo is not affiliated with ManyChat. Check manychat.com for its current features and pricing.",
    },
    whenOther: {
      h2: "When ManyChat might be the better fit",
      body: "If you need WhatsApp, Messenger or SMS automation, run a non-e-commerce business, or want to design complex custom flows from scratch, a general-purpose builder like ManyChat is a solid choice. If you sell products on Instagram or TikTok and want more sales with less setup, Zyllo is built for you.",
    },
    faqs: [
      {
        question: "What is the best ManyChat alternative for e-commerce?",
        answer:
          "For shops that sell on Instagram and TikTok, the best alternative is a tool built around products and checkout rather than generic chat flows. Zyllo focuses only on e-commerce: comment-to-DM, product questions, AI follow-ups and cart recovery.",
      },
      {
        question: "Is Zyllo easier to use than ManyChat?",
        answer:
          "Zyllo is intentionally narrower. Instead of a blank flow canvas, you start from ready-made e-commerce templates, so most shops are live in about 10 minutes.",
      },
      {
        question: "Can I move my ManyChat automations to Zyllo?",
        answer:
          "There's no one-click import, but most shops only use a handful of sales flows, and each has a matching Zyllo template. Early-access members get hands-on help with the switch.",
      },
      {
        question: "Does Zyllo support WhatsApp or Messenger?",
        answer:
          "Not today. Zyllo focuses on Instagram and TikTok, where most social commerce conversations happen.",
      },
      {
        question: "How much does Zyllo cost compared to ManyChat?",
        answer:
          "Zyllo plans are planned at flat prices starting at €29/month, independent of how many contacts you have. Early-access members get launch pricing.",
      },
    ],
    finalCta: {
      h2: "Try the simpler way to automate Instagram & TikTok DMs",
      body: "Join the waitlist for early access and launch pricing.",
    },
    related: ["instagram-dm-automation", "tiktok-dm-automation"],
    relatedPosts: [
      "how-to-automate-instagram-dms-for-ecommerce",
      "turn-tiktok-comments-into-sales-automated-dms",
    ],
  },
};

export const landingPageList = Object.entries(landingPages).map(
  ([slug, page]) => ({ slug, ...page }),
);
