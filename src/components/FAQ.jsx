import React, { useState } from "react";
import { motion } from "framer-motion";
import "./FAQ.css";

const faqs = [
  {
    question: "Will I get banned from Instagram?",
    answer:
      "No. Zyllo uses the Official Meta API, which is the same technology used by major brands and verified business tools. Your account is 100% safe and compliant with Instagram's terms of service.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "Not at all! Zyllo is designed for business owners, not developers. Our visual rule builder lets you set up automated responses in minutes with zero technical knowledge.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. There are no long-term contracts or hidden fees. You can cancel your subscription at any time from your dashboard, and you won't be charged again.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "Most users are fully set up in under 10 minutes. Just connect your Instagram or TikTok account, define your keywords, and you're ready to automate.",
  },
  {
    question: "Does Zyllo work with TikTok too?",
    answer:
      "Yes! Zyllo supports both Instagram and TikTok business accounts. You can manage comments and DMs from both platforms in one unified dashboard.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="faq-container">
        <motion.h2
          className="faq-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Frequently asked questions
        </motion.h2>
        <motion.div
          className="faq-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
              variants={itemVariants}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">
                <div className="faq-answer-inner">{faq.answer}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
