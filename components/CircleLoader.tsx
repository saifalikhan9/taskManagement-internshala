"use client";
import React from "react";
import { motion } from "framer-motion";

const CircleLoader = () => {
  // Define animation variants for the background glowing blobs
  // (Note: blobVariants are now only for the single gradient blob)
  const gradientBlobAnimate = {
    rotate: [0, 360], // Continuous rotation of the gradient
    scale: [0, 1, 0.9, 1], // Subtle pulsating effect
  };



  const mainCircleAppearTransition = {
    duration: 0.8,
    ease: "easeOut",
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        // Solid white background for the entire page
        background: "white",
      }}
    >
      {/* Container for the glowing blobs and black circle */}
      {/* Removed bg-white here to ensure no conflict with inner elements */}
      <div className="relative w-[250px] h-[250px] flex items-center justify-center">
        {/*
          The single blurred conic gradient div
        */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "110px", // Increased size for better visibility on white
            height: "110px",
            // The conic gradient simulating RGB
            background:
              "conic-gradient(from 0deg at 50% 50%, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
            filter: "blur(8px)", // Reverted to a high blur amount for the glow
            // For a white background, 'screen' makes things disappear.
            // 'overlay' can work, or simply 'normal' with adjusted colors/opacity.
            // Let's try 'normal' first and rely on blur for glow,
            // or 'overlay' if it gives a good effect.
            mixBlendMode: "normal", // Changed to normal. Screen won't work on white.
            opacity: 0.7, // Keep some transparency
          }}
          initial={{ scale: 0 }}
          animate={gradientBlobAnimate} // Use the defined animation properties
          transition={mainCircleAppearTransition}
        />

        {/* The central black circle - placed last to be on top */}
        <motion.div
          className="absolute rounded-full z-10" // Ensure it's on top with z-index
          style={{
            width: "100px",
            height: "100px",
            background:
              "radial-gradient(circle at center, #333 0%, #1a1a1a 50%, #000 100%)", // Radial gradient for black circle
          }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0.9, 1] }} // Keep this entry animation
          transition={mainCircleAppearTransition}
        />
      </div>
    </div>
  );
};

export default CircleLoader;
