import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const NUMBER_HEIGHT = 32; // Height of each number in pixels (adjust based on font-size)

function Digit({ place, value, height = NUMBER_HEIGHT, className }) {
  let number = place; // The target digit

  // We want to animate to this number.
  // We'll create a column of 0-9. with repeats for smooth looping if needed,
  // but for simple "slide down" effect:
  // If we go from 0 to 5, we slide to y position of 5.

  // To make it look like it's "spinning", we can just position the strip.
  // The strip is 0 1 2 3 4 5 6 7 8 9

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 15,
    mass: 1,
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const y = useTransform(spring, (latest) => {
    // latest is the number value (e.g. 5.4 -> 5)
    // We want to map this to pixels.
    // Index 0 is at y=0. Index 9 is at y = -9 * height.
    return latest * -height;
  });

  return (
    <div
      style={{ height }}
      className={cn("relative overflow-hidden w-[0.6em]", className)}
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div
            key={i}
            style={{ height }}
            className="flex justify-center items-center"
          >
            {i}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function CountUp({ value, className, decimalPlaces = 0 }) {
  // Format the number to get the string we want to display (e.g. "1,234.56")
  const formattedValue = Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);

  // Split into characters
  const chars = formattedValue.split("");

  // Height trick: We need to know the line-height/font-size to set the container height.
  // For simplicity, we can use a wrapper that measures itself or accepts a prop.
  // Or we can rely on standard line-heights.
  // Assuming text-2xl is ~32px line-height usually.

  return (
    <div className={cn("flex items-center overflow-hidden", className)}>
      {chars.map((char, index) => {
        if (/[0-9]/.test(char)) {
          // It's a number, animate it
          return (
            <Digit
              key={index}
              value={parseInt(char)}
              className="tabular-nums"
            />
          );
        } else {
          // It's a separator (comma, dot), render static
          return <span key={index}>{char}</span>;
        }
      })}
    </div>
  );
}
