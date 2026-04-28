"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.8,
  direction = "up"
}: AnimatedSectionProps) {
  
  const getVariants = () => {
    switch(direction) {
      case "up": return { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
      case "down": return { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } };
      case "left": return { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };
      case "right": return { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
      case "none": return { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } };
      default: return { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }} // Spring-like ease out
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "", delay = 0.1 }: { children: ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({ children, className = "", delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -15, 0],
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
