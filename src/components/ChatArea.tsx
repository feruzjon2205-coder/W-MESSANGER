import React, { useState, useRef, useEffect } from 'react';
import { Chat, User, Message, AppSettings, MessageType } from '../types/messenger';
import { chatService } from '../services/chatService';
import { 
  ArrowLeft, Phone, Video, Search, MoreVertical, 
  Smile, Paperclip, Send, Mic, Play, Pause, 
  Check, CheckCheck, Reply, X, ShieldCheck, 
  Image as ImageIcon, FileText, Download, Users
} from 'lucide-react';

interface ChatAreaProps {
  chat: Chat;
  currentUser: User;
  settings: AppSettings;
  onBackToList: () => void;
  onOpenProfile: (user: User) => void;
  onStartCall: (contact: User, type: 'voice' | 'video') => void;
}

const EMOJI_PALETTE = ['❤️', '👍', '🔥', '😂', '😮', '🚀', '🎉', '👏', '✨', '💙', '🙌', '👀', '💯', '⚡', '☕', '🌟'];

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  currentUser,
  settings,
  onBackToList,
  onOpenProfile,
  onStartCall,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [activeVoiceAudioId, setActiveVoiceAudioId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeMediaPreview, setActiveMediaPreview] = useState<string | null>(null);
  const [inChatSearch, setInChatSearch] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync messages from chat service
  useEffect(() => {
    const updateMsgs = () => {
      setMessages(chatService.getMessages(chat.id));
    };
    updateMsgs();
    const unsubscribe = chatService.subscribe(updateMsgs);
    return () => unsubscribe();
  }, [chat.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, chat.typingUsers]);

  // Simulated Voice recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const otherParticipant = chat.participants.find(p => p.id !== currentUser.id) || chat.participants[0];
  const isDirect = chat.type === 'direct';

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    chatService.sendMessage(
      chat.id,
      inputText.trim(),
      'text',
      undefined,
      undefined,
      replyTarget ? {
        id: replyTarget.id,
        senderName: replyTarget.senderName,
        snippet: replyTarget.content.slice(0, 50)
      } : undefined
    );

    setInputText('');
    setReplyTarget(null);
    setShowEmojiPicker(false);
  };

  const handleSendVoiceMessage = () => {
    setIsRecording(false);
    chatService.sendMessage(
      chat.id,
      `Voice note: 0:${recordingSeconds.toString().padStart(2, '0')}`,
      'voice',
      undefined,
      {
        durationSeconds: recordingSeconds,
        fileName: 'audio_message.wav'
      }
    );
  };

  const handleSimulateAttachment = (type: 'image' | 'file') => {
    setShowAttachMenu(false);
    if (type === 'image') {
      chatService.sendMessage(
        chat.id,
        'Shared design preview screenshot',
        'image',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        {
          fileName: 'ui_preview_dark.png',
          fileSize: '1.2 MB'
        }
      );
    } else {
      chatService.sendMessage(
        chat.id,
        'W_Messenger_Specification.pdf',
        'file',
        undefined,
        {
          fileName: 'W_Messenger_Specification.pdf',
          fileSize: '3.4 MB'
        }
      );
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    chatService.addReaction(chat.id, messageId, emoji);
  };

  const toggleVoicePlayback = (msgId: string) => {
    if (activeVoiceAudioId === msgId) {
      setActiveVoiceAudioId(null);
    } else {
      setActiveVoiceAudioId(msgId);
      // Auto-stop after 3.5s simulation
      setTimeout(() => {
        setActiveVoiceAudioId(null);
      }, 3500);
    }
  };

  const filteredMessages = messages.filter(m => 
    !inChatSearch.trim() || m.content.toLowerCase().includes(inChatSearch.toLowerCase())
  );

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Chat Top Header */}
      <header className="h-16 px-3 sm:px-5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur-md z-10 select-none">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Back Button */}
          <button
            onClick={onBackToList}
            className="md:hidden p-2 -ml-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to chat list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div 
            onClick={() => isDirect && onOpenProfile(otherParticipant)}
            className="relative cursor-pointer shrink-0"
          >
            {chat.avatarUrl ? (
              <img
                src={chat.avatarUrl}
                alt={chat.title}
                className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center">
                {chat.type === 'group' ? <Users className="w-5 h-5" /> : chat.title.charAt(0)}
              </div>
            )}
            {isDirect && otherParticipant?.status === 'online' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 ring-1 ring-emerald-500/20" />
            )}
          </div>

          {/* Title & Status */}
          <div 
            onClick={() => isDirect && onOpenProfile(otherParticipant)}
            className="cursor-pointer min-w-0 truncate"
          >
            <div className="flex items-center gap-1.5 truncate">
              <h2 className="text-sm font-bold text-slate-100 truncate">{chat.title}</h2>
              {isDirect && otherParticipant?.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              )}
            </div>
            <div className="text-[11px] truncate">
              {chat.typingUsers && chat.typingUsers.length > 0 ? (
                <span className="text-blue-400 font-medium animate-pulse">
                  {chat.typingUsers[0]} is typing...
                </span>
              ) : isDirect ? (
                otherParticipant?.status === 'online' ? (
                  <span className="text-emerald-400 font-medium">Online</span>
                ) : (
                  <span className="text-slate-500">{otherParticipant?.lastSeen || 'Offline'}</span>
                )
              ) : (
                <span className="text-slate-500">{chat.participants.length} members</span>
              )}
            </div>
          </div>
        </div>

        {/* Top Action Icons */}
        <div className="flex items-center gap-1 shrink-0">
          {showSearchBox ? (
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 animate-in fade-in">
              <input
                type="text"
                autoFocus
                placeholder="Find in chat..."
                value={inChatSearch}
                onChange={e => setInChatSearch(e.target.value)}
                className="w-28 sm:w-40 text-xs bg-transparent text-slate-100 focus:outline-none placeholder-slate-500"
              />
              <button
                onClick={() => { setShowSearchBox(false); setInChatSearch(''); }}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchBox(true)}
              className="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
              title="Search conversation"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {isDirect && (
            <>
              <button
                onClick={() => onStartCall(otherParticipant, 'voice')}
                className="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-colors"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => onStartCall(otherParticipant, 'video')}
                className="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-colors"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => isDirect && onOpenProfile(otherParticipant)}
            className="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
            title="Chat Info"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Message Feed Canvas */}
      <div 
        className={`flex-1 overflow-y-auto p-4 space-y-3.5 ${
          settings.chatWallpaper === 'midnight'
            ? 'bg-slate-950'
            : settings.chatWallpaper === 'navy'
            ? 'bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950'
            : settings.chatWallpaper === 'slate'
            ? 'bg-slate-900/60'
            : 'bg-black'
        }`}
      >
        {/* Encryption Advisory Banner */}
        <div className="flex justify-center my-3 select-none">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Messages in this room are end-to-end encrypted with Double Ratchet.</span>
          </div>
        </div>

        {filteredMessages.map((msg, index) => {
          const isSentByMe = msg.senderId === currentUser.id;
          const isSystem = msg.type === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="text-[11px] text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800/40">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col group ${isSentByMe ? 'items-end' : 'items-start'}`}
            >
              {/* Group chat sender header */}
              {chat.type === 'group' && !isSentByMe && (
                <span className="text-[11px] font-semibold text-blue-400 ml-3 mb-0.5">
                  {msg.senderName}
                </span>
              )}

              {/* Message Bubble + Action Hover trigger */}
              <div className="relative max-w-[85%] sm:max-w-[70%]">
                <div
                  className={`rounded-2xl px-4 py-2.5 shadow-md transition-all ${
                    isSentByMe
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-slate-900 text-slate-100 border border-slate-800/80 rounded-bl-xs'
                  }`}
                >
                  {/* Reply Reference if present */}
                  {msg.replyToMessage && (
                    <div className={`p-2 rounded-lg mb-2 text-xs border-l-2 ${
                      isSentByMe ? 'bg-blue-700/60 border-white text-blue-100' : 'bg-slate-950 border-blue-400 text-slate-300'
                    }`}>
                      <span className="font-semibold block text-[10px]">{msg.replyToMessage.senderName}</span>
                      <span className="truncate block opacity-80">{msg.replyToMessage.snippet}</span>
                    </div>
                  )}

                  {/* Body Content based on type */}
                  {msg.type === 'text' && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  )}

                  {msg.type === 'image' && (
                    <div>
                      {msg.mediaUrl && (
                        <div 
                          onClick={() => setActiveMediaPreview(msg.mediaUrl!)}
                          className="rounded-xl overflow-hidden mb-2 cursor-pointer relative group/img"
                        >
                          <img
                            src={msg.mediaUrl}
                            alt="Media"
                            className="w-full max-h-72 object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                            Click to expand
                          </div>
                        </div>
                      )}
                      <p className="text-xs">{msg.content}</p>
                    </div>
                  )}

                  {msg.type === 'voice' && (
                    <div className="flex items-center gap-3 py-1 min-w-[200px]">
                      <button
                        type="button"
                        onClick={() => toggleVoicePlayback(msg.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isSentByMe ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                        }`}
                      >
                        {activeVoiceAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <div className="flex-1">
                        {/* Audio Waveform preview */}
                        <div className="flex items-center gap-0.5 h-6">
                          {[40, 70, 30, 90, 60, 40, 80, 50, 100, 30, 60, 80, 45, 90, 35, 75].map((h, i) => (
                            <span
                              key={i}
                              style={{ height: `${h}%` }}
                              className={`w-1 rounded-full transition-all ${
                                activeVoiceAudioId === msg.id
                                  ? 'bg-emerald-400 animate-pulse'
                                  : isSentByMe
                                  ? 'bg-blue-200'
                                  : 'bg-slate-500'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-[10px] font-mono ${isSentByMe ? 'text-blue-100' : 'text-slate-400'}`}>
                          0:34 · Voice Message
                        </span>
                      </div>
                    </div>
                  )}

                  {msg.type === 'file' && (
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-white/10">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold truncate">{msg.mediaMetadata?.fileName || msg.content}</span>
                        <span className="text-[10px] text-slate-300 opacity-80">{msg.mediaMetadata?.fileSize || '2.4 MB'}</span>
                      </div>
                      <button
                        onClick={() => alert(`Simulated download: ${msg.mediaMetadata?.fileName}`)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Timestamp & Status footer */}
                  <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-mono tabular-nums ${
                    isSentByMe ? 'text-blue-200' : 'text-slate-400'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {isSentByMe && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-300/80" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-blue-300/60" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Action Bar: Reply & Reactions */}
                <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10 ${
                  isSentByMe ? 'right-full mr-2' : 'left-full ml-2'
                }`}>
                  <button
                    onClick={() => setReplyTarget(msg)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shadow-md transition-colors"
                    title="Reply"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shadow-lg">
                    {['❤️', '👍', '🔥'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(msg.id, emoji)}
                        className="px-1.5 py-0.5 text-xs hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Displayed Reactions badges */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`flex items-center gap-1 mt-1 flex-wrap ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                    {msg.reactions.map(r => (
                      <button
                        key={r.emoji}
                        onClick={() => handleAddReaction(msg.id, r.emoji)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                          r.users.includes(currentUser.id)
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] font-mono tabular-nums font-semibold">{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live typing bubble */}
        {chat.typingUsers && chat.typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-blue-400 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-2xl w-fit animate-in fade-in">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span>{chat.typingUsers[0]} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Banner if replying */}
      {replyTarget && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-xs truncate">
            <Reply className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-slate-200">Replying to {replyTarget.senderName}: </span>
              <span className="text-slate-400 truncate">{replyTarget.content}</span>
            </div>
          </div>
          <button
            onClick={() => setReplyTarget(null)}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-40 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl w-64 animate-in fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Quick Emojis</span>
            <button onClick={() => setShowEmojiPicker(false)} className="text-slate-400 hover:text-slate-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2 text-lg">
            {EMOJI_PALETTE.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText(t => t + emoji);
                  inputRef.current?.focus();
                }}
                className="hover:scale-125 transition-transform text-center py-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachments Menu Popover */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-12 z-40 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl w-48 animate-in fade-in text-xs text-slate-200 space-y-1">
          <button
            onClick={() => handleSimulateAttachment('image')}
            className="w-full px-3 py-2 text-left hover:bg-slate-800 rounded-xl flex items-center gap-2.5 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <span>Send Photo / Graphic</span>
          </button>
          <button
            onClick={() => handleSimulateAttachment('file')}
            className="w-full px-3 py-2 text-left hover:bg-slate-800 rounded-xl flex items-center gap-2.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Send Document / PDF</span>
          </button>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <footer className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800/80 shrink-0">
        {isRecording ? (
          <div className="flex items-center justify-between bg-slate-950 border border-rose-500/30 rounded-2xl p-2.5 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping ml-2" />
              <span className="text-xs font-mono text-rose-400 font-semibold">
                Recording audio: 0:{recordingSeconds.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecording(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendVoiceMessage}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Note</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* Emoji toggle */}
            <button
              type="button"
              onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachMenu(false); }}
              className={`p-2.5 rounded-xl transition-colors ${
                showEmojiPicker ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Add Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Attach button */}
            <button
              type="button"
              onClick={() => { setShowAttachMenu(!showAttachMenu); setShowEmojiPicker(false); }}
              className={`p-2.5 rounded-xl transition-colors ${
                showAttachMenu ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Attach File or Photo"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && settings.enterIsSend) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write a message in W Messenger..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Send or Voice Record Button */}
            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95 shrink-0"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRecording(true)}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                title="Record Voice Note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        )}
      </footer>

      {/* Lightbox Image Preview Modal */}
      {activeMediaPreview && (
        <div 
          onClick={() => setActiveMediaPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={activeMediaPreview}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setActiveMediaPreview(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 text-sm font-semibold"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
