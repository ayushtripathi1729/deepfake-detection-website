import React, { useState, useEffect, useRef } from "react";

const newsItems = [
  "AI impersonation scams surge by 148% in 2025—experts warn",
  "Deepfake video scam costs man ₹66 lakh in India",
  "TikTok influencer targeted with deepfake nude images",
  "NSW criminalizes non-consensual deepfake content",
  "US elections face threat from deepfake campaigns",
  "New AI tools launched to counter deepfake porn",
  "Bollywood stars voice cloned in deepfake scam",
  "EU introduces strict regulations against deepfake content",
];

export default function Home() {
  const tickerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        if (tickerRef.current) {
          tickerRef.current.scrollTop += 1;
          if (
            tickerRef.current.scrollTop >=
            tickerRef.current.scrollHeight - tickerRef.current.clientHeight
          ) {
            tickerRef.current.scrollTop = 0;
          }
        }
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center mb-8 text-indigo-900">
        Deepfake Detection & Cybersecurity Awareness
      </h1>

      <section className="mb-14" aria-label="What are Deepfakes">
        <h2 className="text-3xl font-semibold mb-4">What are Deepfakes?</h2>
        <p className="max-w-4xl mx-auto">
          Deepfakes are synthetic media where a person in an existing image or
          video is replaced with someone else's likeness using deep learning
          techniques. These can be used maliciously to spread misinformation,
          impersonate, or conduct scams.
        </p>
      </section>

      <section className="mb-14" aria-label="Threats and Malware">
        <h2 className="text-3xl font-semibold mb-4">Threats & Malware</h2>
        <p className="max-w-4xl mx-auto">
          Along with deepfakes, various types of malware and cyber-attacks
          threaten digital security. These attacks can compromise data, privacy,
          and the integrity of digital media.
        </p>
      </section>

      <section className="mb-14" aria-label="Current laws against Deepfakes">
        <h2 className="text-3xl font-semibold mb-4">Current Laws Against Deepfakes</h2>
        <p className="max-w-4xl mx-auto">
          Governments worldwide are enacting laws to combat the misuse of deepfake
          technology, including criminalizing non-consensual creation of explicit
          deepfake content and misinformation campaigns.
        </p>
      </section>

      <section
        className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto"
        aria-label="Latest News"
      >
        <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-indigo-700">
          Latest News
        </h3>
        <div
          ref={tickerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="h-40 overflow-hidden space-y-3 text-gray-700"
          tabIndex={0}
          aria-live="polite"
          role="list"
        >
          {newsItems.map((item, idx) => (
            <p key={idx} className="cursor-default select-none" role="listitem">
              {item}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
