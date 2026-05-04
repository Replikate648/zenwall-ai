<div align="center">
<h1>ZenWall AI</h1>
<p>Minimalist, peaceful wallpapers for your mobile device.</p>
</div>

## About ZenWall AI
ZenWall AI is a simple, elegant web app that generates high-quality, 9:16 vertical wallpapers using the **Pollinations.ai** Image API. 
It features multiple artistic styles and an integration with **Bring Your Own Pollen (BYOP)** so users can connect their Pollinations accounts for private, unthrottled generation.

![Built With pollinations.ai](https://img.shields.io/badge/Built%20With-pollinations.ai-black?style=for-the-badge&logo=sparkles)

### Features
- **Style Selection:** Choose between Minimalist, Cyberpunk, Ghibli Anime, Watercolor, and Cinematic.
- **BYOP Integration:** Connect your Pollinations.ai account to use your own Pollen and avoid rate limits.
- **Instant Download:** One-click download of the generated 1080x1920 image directly to your device.
- **Responsive UI:** Beautiful, smooth animations powered by `lucide-react` and `motion`.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Pollinations.ai Submission Details
This app uses the Pollinations.ai API to generate images via the Flux model.
- **API endpoints used:** 
  - Free tier: `GET https://pollinations.ai/p/[prompt]`
  - BYOP tier: `POST https://image.pollinations.ai/prompt/[prompt]` (authenticated with Bearer token)
- **Authentication:** OAuth2 Redirect Flow (`enter.pollinations.ai/authorize`)
