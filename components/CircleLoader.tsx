"use client";
import React from "react";
import { motion } from "framer-motion";

const CircleLoader = () => {
  const gradientBlobAnimate = {
    rotate: [0, 360],
    scale: [0, 1, 0.9, 1],
  };

  const mainCircleAppearTransition = {
    duration: 0.8,
    ease: "easeOut",
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        background: "white",
      }}
    >
      <div className="relative w-[250px] h-[250px] flex items-center justify-center">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "110px",
            height: "110px",

            background:
              "conic-gradient(from 0deg at 50% 50%, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
            filter: "blur(8px)",
            mixBlendMode: "normal",
            opacity: 0.7,
          }}
          initial={{ scale: 0 }}
          animate={gradientBlobAnimate}
          transition={mainCircleAppearTransition}
        />

        <motion.div
          className="absolute rounded-full z-10"
          style={{
            width: "100px",
            height: "100px",
            background:
              "radial-gradient(circle at center, #333 0%, #1a1a1a 50%, #000 100%)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0.9, 1] }}
          transition={mainCircleAppearTransition}
        />
      </div>
    </div>
  );
};

export default CircleLoader;
