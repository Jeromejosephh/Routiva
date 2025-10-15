import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  { src: "/bg-desktop-light.png", alt: "App Screenshot 1" },
  { src: "/bg-desktop-dark.png", alt: "App Screenshot 2" },
  // Add more images here as needed
];

export default function LandingCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIndex((i) => (i + 1) % images.length);
  };

  return (
    <div className="relative flex flex-col items-center justify-center cursor-pointer" onClick={handleClick} style={{ minHeight: 338 }}>
      <Image
        src={images[index].src}
        alt={images[index].alt}
        width={600}
        height={338}
        className="rounded-xl shadow-2xl transition-all duration-500"
        priority
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full border border-blue-400 ${i === index ? 'bg-blue-600' : 'bg-white dark:bg-gray-800'}`}
            style={{ display: 'inline-block' }}
          />
        ))}
      </div>
    </div>
  );
}
