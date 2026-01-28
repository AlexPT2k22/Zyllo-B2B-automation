import React from "react";
import { motion } from "framer-motion";

/**
 * Reusable scroll animation wrapper component
 * Wraps children with fade-in and slide-up animation on scroll
 */

// Animation variants for different effects
export const fadeInUp = {
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

export const fadeInDown = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const fadeInLeft = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const fadeInRight = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Main ScrollReveal component
const ScrollReveal = ({
  children,
  variant = fadeInUp,
  className = "",
  delay = 0,
  once = true,
  amount = 0.2,
  ...props
}) => {
  const customVariant = delay
    ? {
        ...variant,
        visible: {
          ...variant.visible,
          transition: {
            ...variant.visible.transition,
            delay,
          },
        },
      }
    : variant;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={customVariant}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger container for animating lists of items
export const StaggerContainer = ({
  children,
  className = "",
  slow = false,
  once = true,
  amount = 0.1,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={slow ? staggerContainerSlow : staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger item to be used inside StaggerContainer
export const StaggerItem = ({
  children,
  variant = fadeInUp,
  className = "",
  ...props
}) => {
  return (
    <motion.div variants={variant} className={className} {...props}>
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
