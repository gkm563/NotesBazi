"use client";

import { motion } from "framer-motion";

export function LogoAnimation({ src }: { src: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="h-20 w-20 md:h-24 md:w-24 rounded-2xl flex items-center justify-center overflow-hidden mb-6 mx-auto bg-white/10 backdrop-blur-sm border border-white/20"
    >
      <img src={src} alt="College Logo" className="h-full w-full object-contain" />
    </motion.div>
  );
}
