# Hanzi Master - AI Chinese Tutor

An AI-powered Chinese character learning application that helps users practice writing Chinese characters with proper stroke order guidance.

## Features

- Interactive Chinese character writing canvas
- AI-powered stroke order verification
- Character information and usage examples
- Modern, responsive design

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API
- Hanzi Writer

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

## Deployment

This project is configured for deployment on Netlify:

1. Push the code to a GitHub repository
2. Connect the repository to Netlify
3. Set the environment variable `GEMINI_API_KEY` in Netlify settings
4. Netlify will automatically build and deploy the application

## Configuration Changes

### Tailwind CSS Setup

The project has been configured to use Tailwind CSS as a PostCSS plugin instead of the CDN version:

- Created `tailwind.config.js` with custom theme configuration
- Created `postcss.config.js` for PostCSS setup
- Added `index.css` with Tailwind directives
- Updated `package.json` with necessary dependencies
- Removed CDN script from `index.html`

This ensures optimal performance and production readiness.

## License

MIT