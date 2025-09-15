"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scrollable from "@/src/components/Scrollable";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "/images/background/OR68WQ0.jpg",
  "/images/background/17450.jpg",
];

export default function Home() {
  const [imageIndex, setImageIndex] = useState(0);
  const refContainer1 = useRef(null);
  const refSection2 = useRef(null);
  const tc1 = useRef(null);
  const tc2 = useRef(null);
  const pc1 = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    // Effet scale sur tc1
    gsap.to(tc1.current, {
      scrollTrigger: {
        trigger: refContainer1.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
      scale: 1.4,
      ease: "power2.out",
       x: 100,
    });
    gsap.to(pc1.current, {
      scrollTrigger: {
        trigger: refContainer1.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
      scale: 1.4,
      ease: "power2.out",
       x: 150,
    });

    gsap.to(tc2.current, {
      scrollTrigger: {
        trigger: refContainer1.current,
        start: "top center",
        end: "bottom center",
        scrub: true,     
      },
      scale: 1.5,
      ease: "bounce.in",
      x: -100,
    });

    // Effet montée de la section2
    gsap.to(refSection2.current, {
      scrollTrigger: {
        trigger: refContainer1.current,
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
      y: "-100vh",
      ease: "power2.inOut",
    });
  });

  return (
    <Scrollable>
      {/* Section 1 */}
      <section
        ref={refContainer1}
        className="relative z-30 min-h-screen bg-white overflow-hidden"
      >
        <div className="relative h-[400px]">
          <div className="absolute inset-0">
            {images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt="image"
                fill
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  index === imageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-black opacity-40" />
          </div>
        </div>

        <Image
          ref={tc2}
          src="/images/phone/tel02_removebg-preview.png"
          alt="PC à vendre"
          width={300}
          height={300}
          className="absolute top-[20%] right-5 -translate-y-1/2 transition-transform duration-1000 ease-in-out"
        />
        <Image
          ref={pc1}
          src="/images/laptop/laptop_removebg-preview.png"
          alt="PC à vendre"
          width={300}
          height={300}
          className="absolute top-[10%] right-1/2 -translate-y-1/2 transition-transform duration-1000 ease-in-out"
        />
        <Image
          ref={tc1}
          src="/images/phone/tel01_removebg-preview.png"
          alt="PC à vendre"
          width={150}
          height={150}
          className="absolute top-[20%] left-5 -translate-y-1/2 transition-transform duration-1000 ease-in-out "
        />
      </section>

      {/* Section 2 qui monte par-dessus */}
      <section
        ref={refSection2}
        className="relative z-50 h-screen bg-gray-100 flex items-center justify-center"
      >
        <div className="text-4xl font-bold text-gray-800">Offres Spéciales 🔥</div>
      </section>
    </Scrollable>
  );
}
