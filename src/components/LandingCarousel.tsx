import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  { src: "/landingpage1.png", alt: "Landing Page 1" },
  { src: "/landingpage2.png", alt: "Landing Page 2" },
  { src: "/landingpage3.png", alt: "Landing Page 3" },
  { src: "/landingpage4.png", alt: "Landing Page 4" },
  { src: "/landingpage5.png", alt: "Landing Page 5" },
  { src: "/landingpage6.png", alt: "Landing Page 6" },
  { src: "/landingpage7.png", alt: "Landing Page 7" },
  { src: "/landingpage8.png", alt: "Landing Page 8" },
  { src: "/landingpage9.png", alt: "Landing Page 9" },
  { src: "/landingpage10.png", alt: "Landing Page 10" },
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
          const opacity = 1 - relIndex * 0.18; // fade out each layer
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
