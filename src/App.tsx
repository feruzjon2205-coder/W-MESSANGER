/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Chat, AppSettings, DeviceFrameType } from './types/messenger';
import { chatService } from './services/chatService';
import { DeviceSimulatorFrame } from './components/DeviceSimulatorFrame';
import { AuthScreen } from './components/AuthScreen';
import { ChatListSidebar } from './components/ChatListSidebar';
import { ChatArea } from './components/ChatArea';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { NewChatModal } from './components/NewChatModal';
import { CallModal } from './components/CallModal';
import { WLogo } from './components/WLogo';
import { MessageSquarePlus, ShieldCheck, Zap, Globe, Smartphone } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => chatService.getCurrentUser());
  const [chats, setChats] = useState<Chat[]>(() => chatService.getChats());
  const [activeChatId, setActiveChatId] = useState<string | null>('chat_elena');
  const [settings, setSettings] = useState<AppSettings>(() => chatService.getSettings());
  const [currentFrame, setCurrentFrame] = useState<DeviceFrameType>('responsive');

  // Modals
  const [profileModalUser, setProfileModalUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<{ contact: User; type: 'voice' | 'video' } | null>(null);

  // Subscribe to reactive chat service updates
  useEffect(() => {
    const unsubscribe = chatService.subscribe(() => {
      setChats([...chatService.getChats()]);
      setSettings({ ...chatService.getSettings() });
      setCurrentUser(chatService.getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  // Ensure dark class is applied initially
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  // Authentication callbacks
  const handleLoginSuccess = (user: User) => {
    chatService.setCurrentUser(user);
    setCurrentUser(user);
    // Auto-select first chat
    const available = chatService.getChats();
    if (available.length > 0) {
      setActiveChatId(available[0].id);
    }
  };

  const handleLogout = () => {
    setIsSettingsOpen(false);
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updated: User) => {
    chatService.setCurrentUser(updated);
    setProfileModalUser(null);
  };

  const handleChatCreated = (newChat: Chat) => {
    setActiveChatId(newChat.id);
  };

  // If not authenticated, render login/register screen inside device simulator
  if (!currentUser) {
    return (
      <DeviceSimulatorFrame currentFrame={currentFrame} onFrameChange={setCurrentFrame}>
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      </DeviceSimulatorFrame>
    );
  }

  // Determine mobile view state (for phone frames or narrow browser screens)
  const isMobileFramed = currentFrame === 'ios' || currentFrame === 'android';

  return (
    <DeviceSimulatorFrame currentFrame={currentFrame} onFrameChange={setCurrentFrame}>
      <div className="w-full h-full flex overflow-hidden bg-slate-950 text-slate-100">
        {/* Chat List Sidebar:
            - Always visible on desktop / wide responsive screen
            - On mobile frames or narrow screen: visible only if no activeChatId is focused
        */}
        <div className={`h-full ${
          isMobileFramed
            ? activeChatId ? 'hidden' : 'w-full'
            : activeChatId ? 'hidden md:flex' : 'w-full md:flex'
        }`}>
          <ChatListSidebar
            chats={chats}
            activeChatId={activeChatId}
            currentUser={currentUser}
            settings={settings}
            onSelectChat={(id) => setActiveChatId(id)}
            onOpenNewChat={() => setIsNewChatOpen(true)}
            onOpenProfile={() => setProfileModalUser(currentUser)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>

        {/* Conversation Area:
            - Visible when activeChat is selected
            - On desktop, if no chat is selected, show modern empty welcome state
        */}
        <div className={`flex-1 h-full min-w-0 ${
          isMobileFramed
            ? activeChatId ? 'flex' : 'hidden'
            : activeChatId ? 'flex' : 'hidden md:flex'
        }`}>
          {activeChat ? (
            <ChatArea
              chat={activeChat}
              currentUser={currentUser}
              settings={settings}
              onBackToList={() => setActiveChatId(null)}
              onOpenProfile={(user) => setProfileModalUser(user)}
              onStartCall={(contact, type) => setActiveCall({ contact, type })}
            />
          ) : (
            /* Desktop Empty Welcome Viewport */
            <div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-center select-none relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-md flex flex-col items-center">
                <WLogo size="xl" showText={false} className="mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome to W Messenger
                </h2>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                  Select a conversation from the sidebar or start a new encrypted private chat.
                </p>

                <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6 text-left">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <ShieldCheck className="w-5 h-5 text-blue-400 mb-2" />
                    <span className="block text-xs font-semibold text-slate-200">End-to-End Encrypted</span>
                    <span className="text-[11px] text-slate-500">Double Ratchet PFS architecture</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <Zap className="w-5 h-5 text-emerald-400 mb-2" />
                    <span className="block text-xs font-semibold text-slate-200">Zero Latency</span>
                    <span className="text-[11px] text-slate-500">Real-time sub-15ms message sync</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <Smartphone className="w-5 h-5 text-indigo-400 mb-2" />
                    <span className="block text-xs font-semibold text-slate-200">Multi-Device</span>
                    <span className="text-[11px] text-slate-500">Seamless iOS, Android & Desktop</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                    <Globe className="w-5 h-5 text-cyan-400 mb-2" />
                    <span className="block text-xs font-semibold text-slate-200">Cloud Sync</span>
                    <span className="text-[11px] text-slate-500">Decentralized edge nodes</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewChatOpen(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Start a New Conversation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {profileModalUser && (
        <ProfileModal
          user={profileModalUser}
          isCurrentUser={profileModalUser.id === currentUser.id}
          onClose={() => setProfileModalUser(null)}
          onSave={handleUpdateProfile}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          currentUser={currentUser}
          onUpdateSettings={(newSet) => chatService.updateSettings(newSet)}
          onLogout={handleLogout}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isNewChatOpen && (
        <NewChatModal
          currentUser={currentUser}
          onClose={() => setIsNewChatOpen(false)}
          onChatCreated={handleChatCreated}
        />
      )}

      {activeCall && (
        <CallModal
          contact={activeCall.contact}
          callType={activeCall.type}
          onEndCall={() => setActiveCall(null)}
        />
      )}
    </DeviceSimulatorFrame>
  );
}
