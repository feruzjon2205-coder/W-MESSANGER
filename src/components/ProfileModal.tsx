import React, { useState } from 'react';
import { User, UserStatus } from '../types/messenger';
import { SEED_USERS } from '../services/chatService';
import { X, Check, Camera, ShieldCheck, Mail, Phone, AtSign, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
  isCurrentUser: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onClose,
  onSave,
  isCurrentUser,
}) => {
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [bio, setBio] = useState(user.bio || '');
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [phone, setPhone] = useState(user.phone || '+1 (555) 234-8901');
  const [email, setEmail] = useState(user.email || '');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  const handleSave = () => {
    onSave({
      ...user,
      name,
      handle: handle.startsWith('@') ? handle : '@' + handle,
      bio,
      status,
      avatarUrl,
      phone,
      email,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 p-4 relative flex items-start justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>W Messenger Profile</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar and Primary Identity */}
        <div className="px-6 pb-6 pt-0 overflow-y-auto space-y-5 -mt-12">
          <div className="flex items-end justify-between">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl bg-slate-800"
              />
              {isCurrentUser && (
                <button
                  type="button"
                  onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform active:scale-95"
                  title="Change Avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Selector */}
            {isCurrentUser ? (
              <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
                {(['online', 'away', 'busy', 'offline'] as UserStatus[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-all ${
                      status === st
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="capitalize">{user.status}</span>
              </div>
            )}
          </div>

          {/* Quick Avatar Gallery Drawer */}
          {isEditingAvatar && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl animate-in slide-in-from-top-2">
              <span className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Profile Photo:
              </span>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {SEED_USERS.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(u.avatarUrl);
                      setIsEditingAvatar(false);
                    }}
                    className={`relative shrink-0 rounded-xl overflow-hidden ring-2 transition-all ${
                      avatarUrl === u.avatarUrl ? 'ring-blue-500 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={u.avatarUrl} alt={u.name} className="w-12 h-12 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form / Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
              {isCurrentUser ? (
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <div className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  <span>{name}</span>
                  {user.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Username Handle</label>
              {isCurrentUser ? (
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={handle.replace(/^@/, '')}
                    onChange={e => setHandle(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              ) : (
                <span className="text-sm font-mono text-blue-400">{handle}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">About / Bio</label>
              {isCurrentUser ? (
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell contacts about your role or availability..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              ) : (
                <p className="text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {bio || 'No status bio provided.'}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{email || 'Not connected'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Encrypted Phone</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isCurrentUser ? 'Cancel' : 'Close'}
            </button>
            {isCurrentUser && (
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
