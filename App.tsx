import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, RefreshCw, Edit3, RotateCcw, PenTool } from 'lucide-react';
import HanziCanvas, { HanziCanvasHandle } from './components/HanziCanvas';
import InfoPanel from './components/InfoPanel';
import { fetchCharacterData } from './services/geminiService';
import { CharacterData } from './types';

const App: React.FC = () => {
  const [inputChar, setInputChar] = useState('');
  const [activeChar, setActiveChar] = useState<string>('永'); // Default character
  const [charData, setCharData] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HanziCanvasHandle>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const charToFetch = inputChar.trim().charAt(0) || activeChar;
    
    if (!charToFetch) return;

    // Determine if it is a Chinese character (Basic range)
    if (!charToFetch.match(/[\u4e00-\u9fa5]/)) {
      setError("Please enter a valid Chinese character.");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveChar(charToFetch);
    setInputChar(''); // Clear input after search

    try {
      const data = await fetchCharacterData(charToFetch);
      setCharData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve character data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar / Info Panel */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-stone-200 flex flex-col h-screen sticky top-0 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-stone-200 bg-rice-paper">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              value={inputChar}
              onChange={(e) => setInputChar(e.target.value)}
              placeholder="Enter a character..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cinnabar focus:border-transparent transition-all"
              maxLength={1}
            />
            <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
          </form>
          {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <InfoPanel data={charData} isLoading={loading} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 text-center text-xs text-stone-400 bg-stone-50">
          Powered by Gemini & Hanzi Writer
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-stone-50 overflow-y-auto min-h-screen">
        
        <div className="max-w-2xl w-full flex flex-col items-center space-y-8">
          
          {/* Header for Mobile (Hidden on Desktop usually, but good for context) */}
          <div className="md:hidden text-center">
             <h2 className="text-3xl font-serif font-bold text-ink-black">{activeChar}</h2>
          </div>

          {/* Canvas Container */}
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-stone-200 to-stone-300 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <HanziCanvas 
              ref={canvasRef} 
              character={activeChar} 
              size={Math.min(window.innerWidth - 40, 400)} // Responsive size
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-lg">
            
            <button 
              onClick={() => canvasRef.current?.animate()}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md hover:border-cinnabar hover:text-cinnabar transition-all duration-200"
            >
              <Play size={18} />
              <span className="font-medium">Animate</span>
            </button>

            <button 
              onClick={() => canvasRef.current?.loop()}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md hover:border-cinnabar hover:text-cinnabar transition-all duration-200"
            >
              <RefreshCw size={18} />
              <span className="font-medium">Loop</span>
            </button>

            <button 
              onClick={() => canvasRef.current?.quiz()}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md hover:border-cinnabar hover:text-cinnabar transition-all duration-200 group"
            >
              <Edit3 size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Practice</span>
            </button>

            <button 
              onClick={() => canvasRef.current?.stop()}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md hover:bg-stone-50 transition-all duration-200 text-stone-600"
            >
              <RotateCcw size={18} />
              <span className="font-medium">Reset</span>
            </button>
          </div>

          {/* Instructions / Hints */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 w-full max-w-lg text-sm text-blue-800 flex items-start space-x-3">
            <PenTool size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">How to use:</p>
              <ul className="list-disc list-inside space-y-1 opacity-80">
                <li>Watch the animation to learn stroke order.</li>
                <li>Click <b>Practice</b> to write on the grid.</li>
                <li>Search for any Chinese character to load its data.</li>
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;