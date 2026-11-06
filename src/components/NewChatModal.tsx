import React, { useState } from 'react';
import { User, Chat } from '../types/messenger';
import { SEED_USERS, chatService } from '../services/chatService';
import { X, Search, UserPlus, Users, Check, ShieldCheck } from 'lucide-react';

interface NewChatModalProps {
  currentUser: User;
  onClose: () => void;
  onChatCreated: (chat: Chat) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  currentUser,
  onClose,
  onChatCreated,
}) => {
  const [tab, setTab] = useState<'direct' | 'group'>('direct');
  const [search, setSearch] = useState('');
  const [groupTitle, setGroupTitle] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const availableContacts = SEED_USERS.filter(u => u.id !== currentUser.id);

  const filteredContacts = availableContacts.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.handle.toLowerCase().includes(search.toLowerCase()) ||
    u.bio?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartDirectChat = (targetUser: User) => {
    const chat = chatService.createNewChat(targetUser);
    onChatCreated(chat);
    onClose();
  };

  const handleToggleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupTitle.trim()) return;
    if (selectedUserIds.length === 0) return;

    const selectedUsers = availableContacts.filter(u => selectedUserIds.includes(u.id));
    const newGroup = chatService.createGroupChat(groupTitle.trim(), selectedUsers);
    onChatCreated(newGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              {tab === 'direct' ? <UserPlus className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            </div>
            <h2 className="text-sm font-bold text-slate-100">
              {tab === 'direct' ? 'New Conversation' : 'Create Group Chat'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80">
          <div className="flex p-0.5 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setTab('direct')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'direct'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Direct Message
            </button>
            <button
              type="button"
              onClick={() => setTab('group')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'group'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              New Group
            </button>
          </div>
        </div>

        {/* Group Title input if in group mode */}
        {tab === 'group' && (
          <div className="p-3 border-b border-slate-800 bg-slate-950/30">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Group Subject & Name
            </label>
            <input
              type="text"
              value={groupTitle}
              onChange={e => setGroupTitle(e.target.value)}
              placeholder="e.g. Mobile Engineering Team"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
            {selectedUserIds.length > 0 && (
              <span className="block text-[11px] text-blue-400 mt-1.5 font-medium">
                {selectedUserIds.length} members selected
              </span>
            )}
          </div>
        )}

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts by name or @handle..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {filteredContacts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No contacts matching "{search}".
            </div>
          ) : (
            filteredContacts.map(contact => {
              const isSelected = selectedUserIds.includes(contact.id);
              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    if (tab === 'direct') {
                      handleStartDirectChat(contact);
                    } else {
                      handleToggleSelectUser(contact.id);
                    }
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    tab === 'group' && isSelected
                      ? 'bg-blue-600/15 border-blue-500/40 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={contact.avatarUrl}
                        alt={contact.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                        contact.status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{contact.name}</span>
                        {contact.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-blue-400">{contact.handle}</span>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                        {contact.bio}
                      </p>
                    </div>
                  </div>

                  {tab === 'group' && (
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer for group creation */}
        {tab === 'group' && (
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {selectedUserIds.length === 0 ? 'Select members above' : `${selectedUserIds.length} member(s)`}
            </span>
            <button
              type="button"
              disabled={!groupTitle.trim() || selectedUserIds.length === 0}
              onClick={handleCreateGroup}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Create Group</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
