import React from "react";
import { motion } from "framer-motion";
import "./Features.css";

const features = [
  {
    image: "/phone.png",
    title: "24/7 Instant Responses",
    description:
      "Don't keep your customers waiting. Our rules engine responds to questions about prices, stock, and schedules in seconds.",
  },
  {
    image: "/charts.png",
    title: "Qualify Leads",
    description:
      "Automatically identify high-intent buyers and route them to your sales team or checkout page.",
  },
  {
    image: "/cart.png",
    title: "Recover Carts",
    description:
      "Send automated follow-ups to customers who abandoned their shopping carts on Instagram and TikTok.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Features = () => {
  return (
    <section className="features" id="product">
      <div className="features-container">
        <motion.h2
          className="features-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Everything you need to scale your sales
        </motion.h2>
        <motion.p
          className="features-subtitle"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          Enjoy customizable lists, team work tools, and smart tracking all in
          one place. Set tasks, get reminders, and see your progress simply and
          quickly.
        </motion.p>
        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={cardVariants}
            >
              <div className="feature-icon-wrapper">
                {feature.image ? (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="feature-floating-img"
                  />
                ) : (
                  <div className="feature-icon">{feature.icon}</div>
                )}
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
