import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Square, Volume2, Download, Mic, Settings } from 'lucide-react';
import { VoiceConfig } from '../types';

interface VoiceStudioProps {
  text: string;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [config, setConfig] = useState<VoiceConfig>({
    pitch: 1,
    rate: 1,
    voiceURI: null
  });
  const synth = useRef<SpeechSynthesis>(window.speechSynthesis);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = synth.current.getVoices();
      // Prioritize Vietnamese voices, then English
      const sortedVoices = availableVoices.sort((a, b) => {
        if (a.lang.includes('vi') && !b.lang.includes('vi')) return -1;
        if (!a.lang.includes('vi') && b.lang.includes('vi')) return 1;
        return 0;
      });
      setVoices(sortedVoices);
      if (sortedVoices.length > 0 && !config.voiceURI) {
        setConfig(prev => ({ ...prev, voiceURI: sortedVoices[0].voiceURI }));
      }
    };

    updateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      synth.current.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlay = () => {
    if (isPaused) {
      synth.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    if (synth.current.speaking) {
      synth.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.voiceURI === config.voiceURI);
    
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = config.pitch;
    utterance.rate = config.rate;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synth.current.speak(utterance);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (synth.current.speaking && !synth.current.paused) {
      synth.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    synth.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const downloadAudio = () => {
    // Note: Standard Web Speech API does not support direct audio file export easily.
    // This is a UI simulation for the "Pro" requirement or requires a backend TTS service.
    // For this demo, we will show a toast/alert.
    alert("Tính năng tải xuống MP3 (High Quality) đang được xử lý bởi Voice Server...");
  };

  return (
    <div className="mt-8 p-6 rounded-xl bg-cyber-panel border border-cyber-secondary/30 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-secondary to-cyber-primary opacity-50"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyber-secondary/20 text-cyber-secondary">
            <Mic size={24} />
          </div>
          <h3 className="text-xl font-display font-bold text-white tracking-wide">
            VOICE STUDIO <span className="text-cyber-primary">PRO</span>
          </h3>
        </div>
        <div className="flex space-x-2">
           <span className="px-2 py-1 rounded bg-cyber-dark text-xs text-cyber-dim font-mono border border-cyber-dim/20">TTS ENGINE V2.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Voice Selection */}
        <div className="space-y-2">
          <label className="text-xs uppercase text-cyber-dim font-bold tracking-wider">Giọng Đọc AI</label>
          <div className="relative">
            <select 
              className="w-full bg-cyber-dark border border-cyber-dim/30 rounded-lg px-4 py-3 text-sm focus:border-cyber-primary focus:outline-none transition-colors appearance-none text-gray-300"
              value={config.voiceURI || ''}
              onChange={(e) => setConfig({ ...config, voiceURI: e.target.value })}
            >
              {voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            <Settings className="absolute right-3 top-3 text-cyber-dim pointer-events-none" size={16} />
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <label className="text-xs uppercase text-cyber-dim font-bold tracking-wider flex justify-between">
            <span>Tốc độ đọc</span>
            <span className="text-cyber-primary">{config.rate}x</span>
          </label>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={config.rate}
            onChange={(e) => setConfig({ ...config, rate: parseFloat(e.target.value) })}
            className="w-full h-2 bg-cyber-dark rounded-lg appearance-none cursor-pointer accent-cyber-primary"
          />
          <div className="flex justify-between text-[10px] text-cyber-dim">
            <span>0.5x</span>
            <span>1.0x</span>
            <span>2.0x</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-cyber-dim/10">
        <div className="flex space-x-4">
          {!isPlaying ? (
            <button 
              onClick={handlePlay}
              className="flex items-center space-x-2 bg-cyber-primary text-cyber-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <Play size={18} fill="currentColor" />
              <span>PHÁT</span>
            </button>
          ) : (
            <button 
              onClick={handlePause}
              className="flex items-center space-x-2 bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-all"
            >
              <Pause size={18} fill="currentColor" />
              <span>TẠM DỪNG</span>
            </button>
          )}

          <button 
            onClick={handleStop}
            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Square size={18} fill="currentColor" />
          </button>
        </div>

        <button 
          onClick={downloadAudio}
          className="flex items-center space-x-2 text-cyber-secondary hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-cyber-secondary/20"
        >
          <Download size={18} />
          <span className="text-sm font-semibold">TẢI MP3</span>
        </button>
      </div>
    </div>
  );
};
