import React from "react";
import { motion } from "framer-motion";

import image1 from "../assets/logos/image1.jpg";
import image2 from "../assets/logos/image2.jpg";
import image3 from "../assets/logos/image3.jpg";
import image4 from "../assets/logos/image4.png";
import image5 from "../assets/logos/image5.png";

const discoverItems = [
  {
    title: "Understanding Deepfake Technology",
    desc: "A beginner-friendly guide on how deepfake models are trained and work.",
    img: image1,
    link: "https://medium.com",
  },
  {
    title: "Recent Deepfake Scam in India",
    desc: "How a corporate employee lost money after a deepfake call.",
    img: image2,
    link: "https://bbc.com",
  },
  {
    title: "Meta's Deepfake Detection AI",
    desc: "Meta launches state-of-the-art models for deepfake detection in 2025.",
    img: image3,
    link: "https://about.fb.com",
  },
  {
    title: "Legal Frameworks on Deepfakes",
    desc: "An overview of current laws and regulations combating deepfakes.",
    img: image4,
    link: "https://lawfareblog.com",
  },
  {
    title: "AI Tools to Counter Deepfake Porn",
    desc: "New AI-based tools helping detect and prevent deepfake pornography.",
    img: image5,
    link: "https://washingtonpost.com",
  },
];

export default function Discover() {
  return (
    <section className="min-h-screen py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900">
          Discover: Research, News & Articles
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {discoverItems.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow focus:outline-none focus:ring-4 focus:ring-indigo-300"
              aria-label={`Read: ${item.title}`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  {item.title}
                </h2>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
