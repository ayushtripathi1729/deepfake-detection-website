# Deepfake Detection Frontend

This is the frontend React application for the Deepfake Detection website.  
It provides user interfaces for uploading and checking images, videos, texts, audio, and files for deepfake or malware detection.

## Features

- Responsive UI using React and Tailwind CSS
- Navigation with React Router
- Pages include Home, About Us, Discover, and media-specific upload/check pages
- Integration with backend APIs to perform detection
- Animated and interactive elements via Framer Motion

## Project Structure

- `public/` - Contains `index.html` and static assets
- `src/components/` - React component files (Navbar, Home, AboutUs, Discover, Upload pages, etc.)
- `src/utils/api.js` - API helper functions for backend calls
- `src/index.css` - Global Tailwind CSS imports and custom styles
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

## Requirements

- Node.js and npm installed
- Backend API running and accessible at `/api/check/*`

## Getting Started

1. Install dependencies:

npm install

text

2. Start the development server:

npm start

text

The app will be accessible at `http://localhost:3000`.

## Build for Production

To create an optimized production build:

npm run build

text

## Notes

- Make sure the backend server is running and accessible to handle detection requests.
- Team member photos and blog images should be placed under `public/assets/` folders.
- Tailwind CSS is used extensively, so build tools with PostCSS support are required.

## License

MIT License
This README provides essential info to get started with the frontend app and an overview of its structure.

Let me know if you want a backend README or other documentation!Here is a detailed file structure for your deepfake detection website project, organized into frontend and backend parts.

Frontend File Structure
text
frontend/
│
├── public/
│   ├── index.html                 # Base HTML file, loads React app
│   └── favicon.ico                # Site favicon
│
├── src/
│   ├── assets/                   # Images, icons, fonts used in app
│   │    ├── team/                # Team member photos
│   │    └── logos/               # Logos if any
│   │
│   ├── components/               # React components categorized by use
│   │    ├── Navbar.jsx           # Navigation bar component
│   │    ├── Home.jsx             # Homepage content component
│   │    ├── AboutUs.jsx          # About Us page with team profiles
│   │    ├── Discover.jsx         # Discover page with articles/blogs
│   │    ├── CheckOptions.jsx     # Component with buttons for image/video/text/audio/file check navigation
│   │    ├── UploadImage.jsx      # Upload interface and results for images
│   │    ├── UploadVideo.jsx      # Upload interface and results for videos
│   │    ├── UploadText.jsx       # Upload interface and results for text checking
│   │    ├── UploadAudio.jsx      # For audio uploads and results
│   │    └── UploadFile.jsx       # For generic file uploads
│   │
│   ├── utils/                    # Utility functions and API calls
│   │    └── api.js               # Functions to call backend APIs
│   │
│   ├── App.jsx                   # Main React app routing between pages
│   ├── index.js                  # React DOM render entry point
│   ├── index.css                 # Global CSS including Tailwind import directives
│   └── tailwind.css              # Tailwind base CSS (optional separate file if desired)
│
├── package.json                 # Project dependencies and scripts
├── tailwind.config.js           # Tailwind CSS config file
├── postcss.config.js            # PostCSS config with Tailwind, autoprefixer
└── README.md                    # Project overview (optional)
