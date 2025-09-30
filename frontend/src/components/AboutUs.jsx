import React from "react";
import srishti from "../assets/team/srishti.jpg";
import aditya from "../assets/team/aditya.jpg";
import ayush from "../assets/team/ayush.jpg";
import ashish from "../assets/team/ashish.jpg";
import priyanshu from "../assets/team/priyanshu.jpg";
import anubhav from "../assets/team/anubhav.jpg";

const teamMembers = [
  {
    name: "Srishti Kumari",
    role: "Team Leader",
    bio: "Skilled in project management and AI/ML, driving innovative solutions and seamless team collaboration.",
    photo: srishti,
    linkedin: "https://www.linkedin.com/in/srishti-kumari-30b8b9387/",
  },
  {
    name: "Aditya Chaurasiya",
    role: "Full Stack Developer",
    bio: "Proficient in end-to-end web development and scalable software solutions.",
    photo: aditya,
    linkedin: "https://www.linkedin.com/in/aditya-chaurasiya-679b51374/",
  },
  {
    name: "Anubhav Kumar Yadav",
    role: "Full Stack Developer",
    bio: "Expert in integrating interfaces and backend services across platforms.",
    photo: anubhav,
    linkedin: "https://www.linkedin.com/in/anubhav-kumar-yadav-5815ba291/",
  },
  {
    name: "Priyanshu Singh",
    role: "UI/UX Designer",
    bio: "Creative in designing engaging, user-centered digital experiences.",
    photo: priyanshu,
    linkedin: "https://www.instagram.com/iam_priyanshu.07/",
  },
  {
    name: "Rajak Ashish Rakesh",
    role: "DevOps Expert",
    bio: "Automation and cloud infrastructure specialist ensuring robust deployment pipelines.",
    photo: ashish,
    linkedin: "https://www.instagram.com/ashish_rajak_0903/",
  },
  {
    name: "Ayush Tripathi",
    role: "Cyber Security Specialist",
    bio: "Focused on securing applications and networks against evolving threats.",
    photo: ayush,
    linkedin: "https://linkedin.com/in/ayushtripathi1729",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Team Name and Header */}
        <h1 className="text-5xl font-extrabold mb-10 text-center text-indigo-900">
          The DEEP BUSTERS
        </h1>

        {/* Mission Section */}
        <section className="mb-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Restoring trust in digital content by fighting misinformation,
            scams, and deepfakes using cutting-edge AI-powered detection and
            active defense.
          </p>
        </section>

        {/* Team Member Cards */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow"
              >
                <img
                  src={member.photo}
                  alt={`${member.name} photo`}
                  className="rounded-full w-32 h-32 object-cover shadow-md mb-5"
                />
                <h3 className="text-xl font-bold text-indigo-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-700 text-sm mb-4">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:text-indigo-700 underline"
                >
                  Contact
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Proposed Solution */}
        <section className="mb-20 max-w-5xl mx-auto bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-900 text-center">
            Our Solution: MaayaBreaker
          </h2>
          <p className="mb-4 text-gray-800 font-semibold">
            AI-Powered Deepfake & Misinformation Detection System
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>
              Multi-platform (Website, App, Browser Extension) for detection &
              protection
            </li>
            <li>Multi-modal analysis: Image, Video, Audio, Text, Links & Files</li>
            <li>
              Detects AI deepfakes, manual edits, phishing links, malicious files
              & fake messages
            </li>
            <li>
              Provides heatmaps, real-time alerts, and explainable results to
              build trust
            </li>
            <li>
              Active defense: blocks fake calls, OTP floods & phishing attempts
              instantly
            </li>
            <li>
              Hybrid AI + forensic approach with feedback learning → accuracy
              improves over time
            </li>
          </ul>

          <p className="mb-4 text-gray-800 font-semibold">How It Addresses the Problem</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>Fights scams, misinformation, fake media</li>
            <li>Gives instant authenticity check</li>
            <li>Scam call alerts & fake voice detection</li>
            <li>Builds user awareness & trust</li>
          </ul>

          <p className="mb-4 text-gray-800 font-semibold">Innovation & Uniqueness</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>Multi-Modal Detection (all media types)</li>
            <li>Real-Time Defense Across devices</li>
            <li>Scalable self-learning AI + Explainable AI Outputs</li>
            <li>Full Digital Immune Ecosystem (Web/App/Plugin)</li>
            <li>Self Learning, Adaptive system</li>
          </ul>

          <p className="mb-4 text-gray-800 font-semibold">Potential Impact</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>Restores global trust in digital content</li>
            <li>Shields users from scams, frauds & fake news</li>
            <li>Establishes universal standard for authenticity</li>
            <li>Supports law enforcement, journalism & governance</li>
            <li>Lays foundation for global AI accountability</li>
          </ul>

          <p className="mb-4 text-gray-800 font-semibold">Benefits</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Social: Heatmaps + explainable AI help people verify truth,
              protecting democracy & culture
            </li>
            <li>
              Economic: Fake call/link/file blocking reduces fraud losses &
              builds digital business trust
            </li>
            <li>
              Security: Real-time deepfake/audio/OTP spam detection prevents
              crimes, cyberattacks & political misuse
            </li>
            <li>
              Educational: News/blogs on deepfake misuse spread awareness &
              teach safe online practices
            </li>
            <li>
              Environmental: Unified platform avoids multiple redundant tools,
              saving digital resources
            </li>
            <li>
              Visionary: Multi-modal detection (image, video, audio, text,
              links)
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
