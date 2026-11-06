import React, { useState } from 'react';
import { Chat, User, AppSettings } from '../types/messenger';
import { WLogo } from './WLogo';
import { 
  Search, Plus, Settings, Pin, VolumeX, ShieldCheck, 
  Check, CheckCheck, Users, MessageSquare, MoreVertical, Trash2
} from 'lucide-react';
import { chatService } from '../services/chatService';

interface ChatListSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  currentUser: User;
  settings: AppSettings;
  onSelectChat: (chatId: string) => void;
  onOpenNewChat: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

type FilterTab = 'all' | 'direct' | 'groups' | 'unread';

export const ChatListSidebar: React.FC<ChatListSidebarProps> = ({
  chats,
  activeChatId,
  currentUser,
  onSelectChat,
  onOpenNewChat,
  onOpenProfile,
  onOpenSettings,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [contextMenuChatId, setContextMenuChatId] = useState<string | null>(null);

  // Filter chats by tab and search
  const filteredChats = chats.filter(chat => {
    // Search match
    const titleMatch = chat.title.toLowerCase().includes(search.toLowerCase());
    const messageMatch = chat.lastMessage?.content.toLowerCase().includes(search.toLowerCase()) ?? false;
    const matchesSearch = !search.trim() || titleMatch || messageMatch;

    if (!matchesSearch) return false;

    // Tab match
    if (activeTab === 'direct') return chat.type === 'direct';
    if (activeTab === 'groups') return chat.type === 'group' || chat.type === 'channel';
    if (activeTab === 'unread') return chat.unreadCount > 0;
    return true;
  });

  // Separate pinned vs standard
  const pinnedChats = filteredChats.filter(c => c.isPinned);
  const regularChats = filteredChats.filter(c => !c.isPinned);

  const handleTogglePin = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    chatService.togglePinChat(chatId);
    setContextMenuChatId(null);
  };

  const handleToggleMute = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    chatService.toggleMuteChat(chatId);
    setContextMenuChatId(null);
  };

  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (confirm('Delete this chat?')) {
      chatService.deleteChat(chatId);
    }
    setContextMenuChatId(null);
  };

  const renderChatItem = (chat: Chat) => {
    const isActive = chat.id === activeChatId;
    const isDirect = chat.type === 'direct';
    const otherParticipant = chat.participants.find(p => p.id !== currentUser.id) || chat.participants[0];
    const isOnline = isDirect && otherParticipant?.status === 'online';

    return (
      <div
        key={chat.id}
        onClick={() => {
          onSelectChat(chat.id);
          chatService.markAsRead(chat.id);
        }}
        className={`group relative px-3 py-3 mx-2 my-0.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
          isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
            : 'hover:bg-slate-900/80 text-slate-300'
        }`}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          {chat.avatarUrl ? (
            <img
              src={chat.avatarUrl}
              alt={chat.title}
              className="w-12 h-12 rounded-2xl object-cover bg-slate-800 ring-1 ring-slate-800 group-hover:ring-slate-700"
            />
          ) : (
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base ${
              isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-blue-400'
            }`}>
              {chat.type === 'group' ? <Users className="w-5 h-5" /> : chat.title.charAt(0)}
            </div>
          )}

          {/* Online status dot */}
          {isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 ring-1 ring-emerald-500/30" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5 truncate pr-1">
              <span className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-100'}`}>
                {chat.title}
              </span>
              {otherParticipant?.isVerified && isDirect && (
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-400'}`} />
              )}
              {chat.isMuted && (
                <VolumeX className="w-3 h-3 text-slate-500 shrink-0" />
              )}
            </div>

            {/* Time */}
            {chat.lastMessage && (
              <span className={`text-[11px] font-mono tabular-nums shrink-0 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                {chat.lastMessage.timestamp}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* Snippet / Typing */}
            <div className="text-xs truncate pr-2">
              {chat.typingUsers && chat.typingUsers.length > 0 ? (
                <span className={`font-medium animate-pulse flex items-center gap-1 ${isActive ? 'text-blue-100' : 'text-blue-400'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  <span>{chat.typingUsers[0]} is typing...</span>
                </span>
              ) : chat.draft ? (
                <span className="text-amber-400 font-medium">Draft: {chat.draft}</span>
              ) : chat.lastMessage ? (
                <span className={`truncate flex items-center gap-1 ${isActive ? 'text-blue-100/90' : 'text-slate-400'}`}>
                  {chat.lastMessage.senderId === currentUser.id && (
                    <span className="shrink-0 inline-flex">
                      {chat.lastMessage.status === 'read' ? (
                        <CheckCheck className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                      ) : chat.lastMessage.status === 'delivered' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </span>
                  )}
                  <span className="truncate">
                    {chat.lastMessage.type === 'voice' ? '🎙️ Voice message' :
                     chat.lastMessage.type === 'file' ? '📎 Attachment' :
                     chat.lastMessage.content}
                  </span>
                </span>
              ) : (
                <span className="text-slate-500 italic">No messages yet</span>
              )}
            </div>

            {/* Badge or Pin */}
            <div className="flex items-center gap-1.5 shrink-0">
              {chat.isPinned && (
                <Pin className={`w-3 h-3 ${isActive ? 'text-blue-200' : 'text-slate-500'}`} />
              )}
              {chat.unreadCount > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                }`}>
                  {chat.unreadCount}
                </span>
              )}

              {/* Action Menu Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setContextMenuChatId(contextMenuChatId === chat.id ? null : chat.id);
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-800/80 transition-opacity ${
                    isActive ? 'hover:bg-blue-700 text-white' : 'text-slate-400'
                  }`}
                  title="More actions"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {contextMenuChatId === chat.id && (
                  <div 
                    className="absolute right-0 top-6 z-40 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 text-xs text-slate-200 animate-in fade-in"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => handleTogglePin(e, chat.id)}
                      className="w-full px-3 py-1.5 text-left hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Pin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{chat.isPinned ? 'Unpin Chat' : 'Pin to Top'}</span>
                    </button>
                    <button
                      onClick={(e) => handleToggleMute(e, chat.id)}
                      className="w-full px-3 py-1.5 text-left hover:bg-slate-800 flex items-center gap-2"
                    >
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      <span>{chat.isMuted ? 'Unmute' : 'Mute'}</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, chat.id)}
                      className="w-full px-3 py-1.5 text-left hover:bg-rose-500/20 text-rose-300 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 h-full flex flex-col bg-slate-950 border-r border-slate-800/80 select-none shrink-0">
      {/* Top Brand Bar */}
      <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <WLogo size="sm" showText={true} />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenNewChat}
            className="w-8 h-8 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 flex items-center justify-center transition-all shadow-sm"
            title="New Chat or Group"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
            title="Settings & Privacy"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chats, contacts, or messages..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-xs text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-3 pb-2 shrink-0">
        <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800/80 rounded-xl">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'direct', label: 'Direct' },
              { key: 'groups', label: 'Groups' },
              { key: 'unread', label: 'Unread' },
            ] as const
          ).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List Feed */}
      <div className="flex-1 overflow-y-auto py-1">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 px-6 text-center text-slate-500">
            <MessageSquare className="w-8 h-8 text-slate-600 mb-2 opacity-50" />
            <span className="text-xs font-medium text-slate-400">No conversations found</span>
            <span className="text-[11px] text-slate-600 mt-0.5">Try searching for a contact or start a new chat</span>
          </div>
        ) : (
          <>
            {pinnedChats.length > 0 && (
              <div className="mb-2">
                <div className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Pin className="w-2.5 h-2.5" />
                  <span>Pinned</span>
                </div>
                {pinnedChats.map(renderChatItem)}
              </div>
            )}

            {regularChats.length > 0 && (
              <div>
                {pinnedChats.length > 0 && (
                  <div className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Conversations
                  </div>
                )}
                {regularChats.map(renderChatItem)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Current User Bottom Bar */}
      <div className="h-16 px-3 border-t border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/90 backdrop-blur-md">
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-900 text-left transition-colors flex-1 min-w-0 mr-2"
          title="Edit Profile"
        >
          <div className="relative shrink-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-blue-500/40"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950" />
          </div>
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1 truncate">
              <span className="text-xs font-bold text-slate-100 truncate">{currentUser.name}</span>
              {currentUser.isVerified && (
                <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" />
              )}
            </div>
            <span className="text-[10px] font-mono text-blue-400 truncate block">
              {currentUser.handle}
            </span>
          </div>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
