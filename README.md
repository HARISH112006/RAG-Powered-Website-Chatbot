# RAG-Powered Website Chatbot

A React-based chatbot interface designed to simulate Retrieval Augmented Generation (RAG). Users can upload a PDF and ask questions to receive AI-generated answers.

## Features
- **PDF Upload**: Drag-and-drop or click to upload PDF files.
- **Interactive Chat**: Ask questions about the uploaded document.
- **Simulated RAG**: Mimics the delay and response of a real AI backend.
- **Responsive Design**: Built with Tailwind CSS for a seamless mobile and desktop experience.

## Tech Stack
- **Frontend**: React (JSX), Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)

## Getting Started

### Prerequisites
- Node.js installed

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure
- `/src`
  - `/components` - UI Building blocks (Header, Upload, Chat)
  - `/hooks` - Custom logic (e.g., `useChat`)
  - `App.jsx` - Main application layout
  - `main.jsx` - Entry point
