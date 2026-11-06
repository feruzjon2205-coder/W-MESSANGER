import React, { useState, useEffect } from 'react';
import { User } from '../types/messenger';
import { Mic, MicOff, Video, VideoOff, Volume2, PhoneOff, ShieldCheck } from 'lucide-react';

interface CallModalProps {
  contact: User;
  callType: 'voice' | 'video';
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  contact,
  callType,
  onEndCall,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm sm:max-w-md h-[560px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Call Security Badge */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">End-to-End Encrypted</span>
          </div>
          <span className="font-mono text-emerald-400 font-semibold">{formatTimer(seconds)}</span>
        </div>

        {/* Center Contact Profile or Video Feed */}
        <div className="flex flex-col items-center justify-center my-auto text-center">
          {isVideoEnabled ? (
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img
                src={contact.avatarUrl}
                alt={contact.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white">{contact.name}</span>
              </div>
              <div className="absolute top-3 right-3 w-20 h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-lg">
                <div className="w-full h-full bg-blue-950/80 flex items-center justify-center text-[10px] text-blue-300">
                  You
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative mb-5">
                <img
                  src={contact.avatarUrl}
                  alt={contact.name}
                  className="w-28 h-28 rounded-3xl object-cover ring-4 ring-blue-500/30 shadow-2xl"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 ring-2 ring-emerald-500/20" />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{contact.name}</h2>
              <span className="text-xs font-mono text-blue-400 mb-2">{contact.handle}</span>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>W Messenger High-Definition Audio</span>
              </p>
            </>
          )}
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isMuted ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              !isVideoEnabled ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-blue-600/30 border border-blue-500 text-blue-300'
            }`}
            title={isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isSpeaker ? 'bg-slate-800 hover:bg-slate-700 text-blue-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}
            title="Speakerphone"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            onClick={onEndCall}
            className="w-14 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
