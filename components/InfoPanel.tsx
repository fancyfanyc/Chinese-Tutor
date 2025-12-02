import React from 'react';
import { CharacterData } from '../types';
import { BookOpen, PenTool, Share2, Info } from 'lucide-react';

interface InfoPanelProps {
  data: CharacterData | null;
  isLoading: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4 animate-pulse">
        <div className="w-16 h-16 bg-stone-200 rounded-full"></div>
        <div className="h-4 w-3/4 bg-stone-200 rounded"></div>
        <div className="h-4 w-1/2 bg-stone-200 rounded"></div>
        <p>Consulting the ancient scrolls...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-stone-400">
        <BookOpen size={48} className="mb-4 opacity-50" />
        <p>Enter a character to begin learning.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-serif text-stone-800">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-baseline space-x-4">
          <h1 className="text-6xl font-bold text-ink-black">{data.char}</h1>
          <div className="flex flex-col">
             <span className="text-2xl text-cinnabar font-medium tracking-wide">
              {data.pinyin.join(', ')}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full w-fit mt-1 ${
              data.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
              data.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {data.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Definitions */}
      <div>
        <h3 className="text-sm uppercase tracking-widest text-stone-500 mb-2 font-sans">Definition</h3>
        <ul className="list-disc pl-5 space-y-1">
          {data.definitions.map((def, idx) => (
            <li key={idx} className="text-lg leading-relaxed">{def}</li>
          ))}
        </ul>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 bg-stone-100 p-4 rounded-lg">
        <div>
          <span className="text-xs text-stone-500 block font-sans uppercase">Radical</span>
          <span className="text-xl font-medium">{data.radical}</span>
        </div>
        <div>
          <span className="text-xs text-stone-500 block font-sans uppercase">Strokes</span>
          <span className="text-xl font-medium">{data.strokeCount}</span>
        </div>
      </div>

      {/* Etymology */}
      <div>
        <div className="flex items-center space-x-2 text-stone-500 mb-2">
          <Info size={16} />
          <h3 className="text-sm uppercase tracking-widest font-sans">Etymology</h3>
        </div>
        <p className="text-stone-600 italic text-sm leading-relaxed border-l-2 border-cinnabar pl-3">
          {data.etymology}
        </p>
      </div>

      {/* Examples */}
      <div>
         <h3 className="text-sm uppercase tracking-widest text-stone-500 mb-3 font-sans">Common Usage</h3>
         <div className="space-y-3">
           {data.examples.map((ex, idx) => (
             <div key={idx} className="bg-white border border-stone-200 p-3 rounded shadow-sm">
               <div className="flex justify-between items-baseline mb-1">
                 <span className="text-lg font-bold text-ink-black">{ex.chinese}</span>
                 <span className="text-sm text-stone-500 font-sans">{ex.pinyin}</span>
               </div>
               <p className="text-sm text-stone-600 font-sans">{ex.english}</p>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default InfoPanel;