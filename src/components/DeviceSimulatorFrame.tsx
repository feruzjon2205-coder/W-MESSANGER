import React from 'react';
import { DeviceFrameType } from '../types/messenger';
import { Monitor, Smartphone, Tablet, Sparkles } from 'lucide-react';

interface DeviceSimulatorFrameProps {
  currentFrame: DeviceFrameType;
  onFrameChange: (frame: DeviceFrameType) => void;
  children: React.ReactNode;
}

export const DeviceSimulatorFrame: React.FC<DeviceSimulatorFrameProps> = ({
  currentFrame,
  onFrameChange,
  children,
}) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Device Switcher Bar */}
      <header className="h-11 shrink-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Viewport
          </span>
          <span className="hidden sm:inline text-xs text-slate-500">· Multi-Platform Preview</span>
        </div>

        {/* Device selector segmented control */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950/80 border border-slate-800/80 rounded-lg">
          <button
            onClick={() => onFrameChange('responsive')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              currentFrame === 'responsive'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Fluid Responsive Web Layout"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fluid Web</span>
          </button>

          <button
            onClick={() => onFrameChange('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              currentFrame === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop Browser / Electron App"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => onFrameChange('ios')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              currentFrame === 'ios'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Apple iOS iPhone 16 Pro Viewport"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iOS</span>
          </button>

          <button
            onClick={() => onFrameChange('android')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              currentFrame === 'android'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Google Android Pixel Viewport"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
          <span className="hidden md:inline font-mono text-[11px] text-slate-400">Encrypted · Sub-15ms</span>
        </div>
      </header>

      {/* Frame Container */}
      <main className="flex-1 overflow-hidden flex items-center justify-center bg-radial from-slate-900 to-slate-950 p-0 sm:p-2">
        {currentFrame === 'responsive' && (
          <div className="w-full h-full overflow-hidden bg-slate-950 flex flex-col">
            {children}
          </div>
        )}

        {currentFrame === 'desktop' && (
          <div className="w-full max-w-6xl h-full max-h-[860px] rounded-2xl border border-slate-800 shadow-2xl shadow-blue-950/40 bg-slate-950 flex flex-col overflow-hidden">
            {/* Desktop window titlebar */}
            <div className="h-8 bg-slate-900/90 border-b border-slate-800/80 px-3 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50" />
              </div>
              <span className="text-[11px] font-medium text-slate-400">W Messenger Desktop</span>
              <div className="w-12" />
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              {children}
            </div>
          </div>
        )}

        {currentFrame === 'ios' && (
          <div className="relative w-[385px] h-[780px] max-h-[96%] rounded-[48px] p-3.5 bg-slate-900 ring-1 ring-slate-700/60 shadow-2xl shadow-blue-950/60 flex flex-col shrink-0">
            {/* Outer phone metal edge */}
            <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-slate-950 border border-slate-800/80 flex flex-col">
              {/* iOS Status Bar with Dynamic Island */}
              <div className="h-10 bg-slate-950 shrink-0 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 select-none z-20">
                <span>9:41</span>
                {/* Dynamic Island pill */}
                <div className="w-24 h-5 bg-black rounded-full border border-slate-800/50 flex items-center justify-end px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-[10px]">5G</span>
                  <div className="w-4 h-2 border border-slate-300 rounded-[2px] p-0.5 flex items-center">
                    <div className="w-full h-full bg-slate-300 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Screen Content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {children}
              </div>

              {/* iOS Home Bar Indicator */}
              <div className="h-4 bg-slate-950 shrink-0 flex items-center justify-center select-none z-20">
                <div className="w-32 h-1 bg-slate-400/40 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {currentFrame === 'android' && (
          <div className="relative w-[390px] h-[790px] max-h-[96%] rounded-[42px] p-3 bg-slate-900 ring-1 ring-slate-700/60 shadow-2xl shadow-blue-950/60 flex flex-col shrink-0">
            {/* Outer phone bezel */}
            <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-slate-950 border border-slate-800/80 flex flex-col">
              {/* Android Status Bar with centered punch hole */}
              <div className="h-8 bg-slate-950 shrink-0 px-5 flex items-center justify-between text-[11px] font-medium text-slate-400 select-none z-20">
                <span>10:00</span>
                {/* Camera punch hole */}
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span>LTE</span>
                  <span>98%</span>
                </div>
              </div>

              {/* Screen Content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {children}
              </div>

              {/* Android Gesture Bar */}
              <div className="h-4 bg-slate-950 shrink-0 flex items-center justify-center select-none z-20">
                <div className="w-20 h-1 bg-slate-500/40 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
