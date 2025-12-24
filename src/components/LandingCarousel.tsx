'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  { src: "/landingpage1.jpg", alt: "Landing Page 1" },
  { src: "/landingpage2.jpg", alt: "Landing Page 2" },
  { src: "/landingpage3.jpg", alt: "Landing Page 3" },
  { src: "/landingpage4.jpg", alt: "Landing Page 4" },
  { src: "/landingpage5.jpg", alt: "Landing Page 5" },
  { src: "/landingpage6.jpg", alt: "Landing Page 6" },
];

export default function LandingCarousel() {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ minHeight: 338, width: 600 }}>
      <div className="relative w-full h-[338px]">
        {images.map((img, i) => {
          // Calculate stacking order
          const relIndex = (i - index + images.length) % images.length;
          // Only show top 5 images for performance
          if (relIndex > 4) return null;
          // Calculate translate and opacity
          const translateY = 64 + relIndex * 48; // shift all images down by 64px
          // Custom opacity per layer: 100%, 40%, 30%, 20%, 10%
          const opacityMap = [1, 0.4, 0.3, 0.2, 0.1];
          const opacity = opacityMap[relIndex] || 0;
          const z = 10 - relIndex;
          return (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={600}
              height={338}
              priority={relIndex === 0}
              style={{
                transform: `translateY(${translateY}px)`,
                opacity,
                zIndex: z,
                transition: 'opacity 0.5s, transform 0.5s',
              }}
              className={`absolute left-0 top-0 rounded-xl shadow-2xl w-full h-full`}
            />
          );
        })}
      </div>
    </div>
  );
}
