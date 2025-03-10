"use client";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Sample slides
const slides = [
  { image: "/image2.png", title: "Innovative AI", desc: "AI-driven video generation like never before." },
  { image: "/image1.png", title: "Effortless Content", desc: "Create stunning marketing videos in seconds." },
  { image: "/image3.jpg", title: "Customization Power", desc: "Tailor your videos to match your brand’s identity." },
];

// Animation function
const animateSlide = (swiper) => {
  const activeSlide = swiper.slides[swiper.activeIndex];
  if (!activeSlide) return; // Prevents errors if swiper isn't ready

  const image = activeSlide.querySelector(".parallax-img");
  const text = activeSlide.querySelectorAll(".parallax-text");

  gsap.set(image, { scale: 1.2 });
  gsap.set(text, { opacity: 0, y: 50 });

  gsap.to(image, { scale: 1, duration: 1.5, ease: "power1.out" });
  gsap.to(text, { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power2.out" });
};

const VideoSlider = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.on("slideChange", () => animateSlide(swiperRef.current.swiper));
      animateSlide(swiperRef.current.swiper); // Animate first slide on load
    }
  }, []);

  return (
    <div className="relative m-2 shadow-[10x_10px_0px_0px_#333333] border-5 border-grey rounded-lg w-full mx-auto overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay]} // Added Autoplay
        navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-slide every 3s
        spaceBetween={10}
        slidesPerView={1}
        className="rounded-lg shadow-lg overflow-hidden"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[500px]">
              <div
                className="absolute inset-0 bg-cover bg-center parallax-img"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-black/10 flex flex-col justify-center items-center text-white p-6 text-center">
                <h2 className="text-5xl font-bold parallax-text">{slide.title}</h2>
                <p className="text-lg mt-2 parallax-text">{slide.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="custom-prev absolute top-1/2 -left-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
        <FaChevronLeft className="text-black text-xl" />
      </button>
      <button className="custom-next absolute top-1/2 -right-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
        <FaChevronRight className="text-black text-xl" />
      </button>
    </div>
  );
};

export default VideoSlider;
