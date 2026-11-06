import React from 'react';
import { AppSettings, User } from '../types/messenger';
import { 
  X, Moon, Sun, Bell, Volume2, ShieldCheck, Send, CheckCircle2, 
  Smartphone, Laptop, LogOut, Palette, RefreshCw, Lock
} from 'lucide-react';
import { chatService } from '../services/chatService';

interface SettingsModalProps {
  settings: AppSettings;
  currentUser: User;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  currentUser,
  onUpdateSettings,
  onLogout,
  onClose,
}) => {
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleResetData = () => {
    if (confirm('Reset all chats and restore default mock conversations?')) {
      chatService.resetToDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Settings & Privacy</h2>
              <p className="text-xs text-slate-400">Manage account, preferences, and security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Account Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-100">{currentUser.name}</span>
                  {currentUser.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <span className="text-xs font-mono text-blue-400">{currentUser.handle}</span>
                <span className="block text-[11px] text-slate-500">{currentUser.email}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                Active Session
              </span>
            </div>
          </div>

          {/* Section: Appearance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span>Interface & Appearance</span>
            </h3>
            <div className="space-y-2 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              {/* Theme toggle */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                    {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-200">Theme</span>
                    <span className="text-[11px] text-slate-500">
                      {settings.theme === 'dark' ? 'Dark Navy Mode (Optimized for OLED & low light)' : 'Crisp Light Mode'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>

              {/* Wallpaper choice */}
              <div className="pt-3 border-t border-slate-800/80">
                <span className="block text-xs font-medium text-slate-300 mb-2">Chat Backdrop Theme</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['midnight', 'navy', 'slate', 'clean'] as const).map(w => (
                    <button
                      key={w}
                      onClick={() => onUpdateSettings({ chatWallpaper: w })}
                      className={`p-2 rounded-xl text-center text-xs capitalize border transition-all ${
                        settings.chatWallpaper === w
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300 font-semibold shadow-sm'
                          : 'border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Chat & Behavior */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>Messaging & Privacy</span>
            </h3>
            <div className="space-y-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              {/* Sound */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="block text-xs font-medium text-slate-200">Message Audio Chimes</span>
                    <span className="text-[11px] text-slate-500">Play subtle sine tone on received message</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={e => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Read Receipts */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="block text-xs font-medium text-slate-200">Read Receipts (Double Blue Ticks)</span>
                    <span className="text-[11px] text-slate-500">Allow contacts to see when you have read messages</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.readReceipts}
                  onChange={e => onUpdateSettings({ readReceipts: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Enter is Send */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <Send className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="block text-xs font-medium text-slate-200">Press Enter to Send</span>
                    <span className="text-[11px] text-slate-500">Shift+Enter creates a new line</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enterIsSend}
                  onChange={e => onUpdateSettings({ enterIsSend: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: Linked Devices */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-400" />
              <span>Active Linked Devices</span>
            </h3>
            <div className="space-y-2 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="block text-xs font-medium text-slate-200">W Messenger Web (Current Client)</span>
                    <span className="text-[10px] text-emerald-400">Online · IP 192.168.1.1</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">This Device</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="block text-xs font-medium text-slate-200">iPhone 16 Pro (iOS App)</span>
                    <span className="text-[10px] text-slate-500">Active 12m ago · Munich, DE</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">v1.0.4</span>
              </div>
            </div>
          </div>

          {/* Data Reset & Logout Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetData}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore Sample Conversations</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of W Messenger</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
