import React from 'react';

export default function CheckOptions({ onSelectOption }) {
  // Options array with name, icon (can be customized), description, and identifier
  const options = [
    { id: "image", label: "Check Image", description: "Upload or link an image for deepfake/malware check" },
    { id: "video", label: "Check Video", description: "Upload or link a video file" },
    { id: "text", label: "Check Text", description: "Submit suspicious text for analysis" },
    { id: "audio", label: "Check Audio", description: "Upload or link audio clips" },
    { id: "file", label: "Check File", description: "Upload any file type for inspection" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Choose what you want to check</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {options.map(({ id, label, description }) => (
          <button
            key={id}
            onClick={() => onSelectOption(id)}
            className="flex flex-col items-center justify-center p-6 bg-white shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={`Select option to ${label.toLowerCase()}`}
            type="button"
          >
            {/* Optional: Replace this with SVG/FontAwesome/Custom icon */}
            <div className="mb-4" aria-hidden="true">
              <svg
                className="w-12 h-12 text-indigo-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">{label}</span>
            <p className="mt-2 text-gray-600 text-center text-sm">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
