"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Optional delay before animation starts
};

export default function Reveal({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element enters the viewport, trigger animation and stop observing
        if (entry.isIntersecting) {
          // Optional: small timeout if you want a delay
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Matches original template settings
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay]);

  // We use the 'animation-fadeInUp' class which you already have in your globals.css
  // from when you pasted the Noir CSS.
  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? "animate-fadeInUp opacity-100" : "opacity-0 translate-y-10"}`}
      style={{ transition: "opacity 0.8s ease-out, transform 0.8s ease-out" }}
    >
      {children}
    </div>
  );
}