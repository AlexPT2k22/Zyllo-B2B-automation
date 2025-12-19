import { forwardRef, useState, createContext, useContext } from "react"
import { motion } from "framer-motion"

/**
 * Simple Store with React Context
 * Replaces Framer's createStore
 */
const StoreContext = createContext(null)

export function StoreProvider({ children, initialBackground = "#0099FF" }) {
  const [background, setBackground] = useState(initialBackground)
  
  return (
    <StoreContext.Provider value={{ background, setBackground }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

/**
 * Generate random hex color
 */
export const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
}

/**
 * HOC that rotates component 90 degrees
 * Animates over 2 seconds
 */
export function withRotate(Component) {
  const MotionComponent = motion.create(Component)
  
  return forwardRef(function RotatedComponent(props, ref) {
    return (
      <MotionComponent
        ref={ref}
        {...props}
        animate={{ rotate: 90 }}
        transition={{ duration: 2 }}
      />
    )
  })
}

/**
 * HOC that scales component on hover
 * Scales to 1.05x on hover
 */
export function withHover(Component) {
  const MotionComponent = motion.create(Component)
  
  return forwardRef(function HoverComponent(props, ref) {
    return (
      <MotionComponent 
        ref={ref} 
        {...props} 
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      />
    )
  })
}

/**
 * HOC that changes background to random color on click
 * Uses the store to persist color across components
 */
export function withRandomColor(Component) {
  const MotionComponent = motion.create(Component)
  
  return forwardRef(function RandomColorComponent(props, ref) {
    const { background, setBackground } = useStore()

    return (
      <MotionComponent
        ref={ref}
        {...props}
        animate={{ backgroundColor: background }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          setBackground(randomColor())
          props.onClick?.(e)
        }}
        style={{ 
          ...props.style,
          cursor: 'pointer'
        }}
      />
    )
  })
}

/**
 * Pre-built motion components for common elements
 * Usage: <MotionDiv whileHover={{ scale: 1.05 }} />
 */
export const MotionDiv = motion.div
export const MotionButton = motion.button
export const MotionSpan = motion.span
export const MotionSection = motion.section

/**
 * Reusable animation variants
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}
