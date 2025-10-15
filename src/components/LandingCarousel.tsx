import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  { src: "/bg-desktop-light.png", alt: "App Screenshot 1" },
  { src: "/bg-desktop-dark.png", alt: "App Screenshot 2" },
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

  const handleClick = () => {
    setIndex((i) => (i + 1) % images.length);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center cursor-pointer"
      onClick={handleClick}
      style={{ minHeight: 338, width: 600 }}
    >
      <div className="relative w-full h-[338px]">
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={600}
            height={338}
            priority={i === 0}
            className={`absolute left-0 top-0 rounded-xl shadow-2xl transition-all duration-500 w-full h-full ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ transition: 'opacity 0.5s' }}
          />
        ))}
      </div>
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
