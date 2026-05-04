import { useState, useEffect } from 'react';
import { Download, Sparkles, Loader2, Image as ImageIcon, LogIn, LogOut, Settings2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import pixelLogo from './assets/logo.png';

const STYLES = [
  { id: 'minimalist', name: 'Minimalist', prompt: ', minimalist aesthetic, soft lighting, 8k resolution, clean composition, peaceful atmosphere' },
  { id: 'cyberpunk', name: 'Cyberpunk', prompt: ', cyberpunk style, neon lights, dark futuristic city, high contrast, 8k' },
  { id: 'ghibli', name: 'Ghibli Anime', prompt: ', studio ghibli anime style, beautiful painted background, vibrant colors, magical atmosphere' },
  { id: 'watercolor', name: 'Watercolor', prompt: ', beautiful watercolor painting, loose strokes, dreamy pastel colors, artistic' },
  { id: 'cinematic', name: 'Cinematic', prompt: ', cinematic lighting, photorealistic, 85mm lens, movie still, highly detailed' },
  { id: 'pixel', name: 'Pixel Art', prompt: ', 16-bit pixel art style, retro video game, highly detailed, isometric' },
  { id: 'ink', name: 'B&W Ink', prompt: ', black and white ink drawing, stippling, hatching, detailed crosshatching, manga sketch style, monochrome' },
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const tokenFromHash = hashParams.get('api_key');
    
    if (tokenFromHash) {
      setApiKey(tokenFromHash);
      localStorage.setItem('pollinations_api_key', tokenFromHash);
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      const savedToken = localStorage.getItem('pollinations_api_key');
      if (savedToken) setApiKey(savedToken);
    }
  }, []);

  const handleLogin = () => {
    const params = new URLSearchParams({ redirect_uri: window.location.href });
    window.location.href = `https://enter.pollinations.ai/authorize?${params.toString()}`;
  };

  const handleLogout = () => {
    setApiKey(null);
    localStorage.removeItem('pollinations_api_key');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setImageUrl(null);

    const fullPrompt = `${prompt.trim()}${selectedStyle.prompt}`;
    const seed = Math.floor(Math.random() * 1000000);
    
    console.log(`[Generate] Starting generation...`);
    console.log(`[Generate] Prompt: "${fullPrompt}"`);
    console.log(`[Generate] Auth status: ${apiKey ? 'Logged In (BYOP)' : 'Anonymous (Free)'}`);
    
    try {
      const url = `https://gen.pollinations.ai/image/${encodeURIComponent(fullPrompt)}?width=1080&height=1920&model=flux&nologo=true&seed=${seed}`;
      console.log(`[Generate] Fetching URL: ${url}`);
      
      const response = await fetch(url, { 
        headers: {
          'Authorization': `Bearer ${apiKey}`
        } 
      });
      console.log(`[Generate] Response received. Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'No error body');
        console.error(`[Generate] API Error (${response.status}):`, errorBody);
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      console.log(`[Generate] Reading blob...`);
      const blob = await response.blob();
      console.log(`[Generate] Success! Blob size: ${blob.size} bytes`);
      setImageUrl(window.URL.createObjectURL(blob));
    } catch (error) {
      console.error('[Generate] Critical Error:', error);
      alert(`Errore nella generazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}. Assicurati di avere ancora "pollen" nel tuo account.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    setIsDownloading(true);
    try {
      if (imageUrl.startsWith('blob:')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `zenwall-${prompt.replace(/\s+/g, '-').slice(0, 20).toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `zenwall-${prompt.replace(/\s+/g, '-').slice(0, 20).toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Failed to download image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-purple-500/30 relative overflow-hidden flex flex-col">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-6 relative z-20">
        <div className="flex items-center gap-3">
          <img src={pixelLogo} alt="ZenWall Logo" className="w-10 h-10 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <span className="font-pixel text-2xl tracking-widest text-purple-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1">ZENWALL</span>
        </div>
        
        {apiKey ? (
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all backdrop-blur-md">
            <LogOut className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">Disconnect</span>
          </button>
        ) : (
          <button onClick={handleLogin} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 rounded-full text-sm font-medium transition-all backdrop-blur-md group">
            <Zap className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="text-purple-200 group-hover:text-purple-100 transition-colors">BYOP Login</span>
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
        
        {/* Left Column: Form & Controls */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
              Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Stunning</span><br />
              Wallpapers
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light max-w-md">
              Turn your imagination into premium 9:16 vertical art in seconds. Powered by Pollinations AI.
            </p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleGenerate} className="w-full max-w-md space-y-6"
          >
            {/* Input Field */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-[#111] border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A tranquil neon city in the rain..."
                  className="w-full bg-transparent px-4 py-3 focus:outline-none text-gray-100 placeholder-gray-600 font-medium"
                  disabled={isGenerating}
                />
                {apiKey ? (
                  <button
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Login to Create
                  </button>
                )}
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-2">
                <Settings2 className="w-3 h-3" /> Select Style
              </label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map(style => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedStyle.id === style.id 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                        : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-gray-300'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.form>
        </div>

        {/* Right Column: Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[300px] sm:max-w-[340px] aspect-[9/16]">
            {/* Phone Frame Glow */}
            <div className="absolute -inset-1 bg-gradient-to-b from-purple-500/30 to-blue-500/30 rounded-[2.5rem] blur-xl opacity-50" />
            
            {/* Phone Frame */}
            <div className="relative w-full h-full bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
              
              {!imageUrl && !isGenerating && (
                <div className="flex flex-col items-center text-gray-600 gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm font-medium">Ready to create</p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md z-10 flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-purple-500 rounded-full border-t-transparent animate-spin" />
                    <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                  </div>
                  <p className="text-sm font-medium text-purple-300 animate-pulse">Synthesizing pixels...</p>
                </div>
              )}

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={prompt}
                  className={`w-full h-full object-cover transition-opacity duration-1000 ${isGenerating && !apiKey ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setIsGenerating(false)}
                />
              )}

              {/* Download Button */}
              <AnimatePresence>
                {imageUrl && !isGenerating && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    onClick={handleDownload} disabled={isDownloading}
                    className="absolute bottom-6 mx-auto px-6 py-3 bg-black/50 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-bold hover:bg-black/70 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20 group"
                  >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />}
                    {isDownloading ? 'Saving...' : 'Save Image'}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
        <p>© 2026 ZenWall AI. All rights reserved.</p>
        <a 
          href="https://pollinations.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
        >
          <span className="font-semibold text-gray-300">Built with pollinations.ai</span>
        </a>
      </footer>
    </div>
  );
}
