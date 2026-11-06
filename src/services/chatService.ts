import { User, Chat, Message, AppSettings, MessageType } from '../types/messenger';

// High-fidelity avatars generated in Phase 1
export const SEED_USERS: User[] = [
  {
    id: 'user_alex',
    name: 'Alex Vance',
    handle: '@alexvance',
    avatarUrl: '/src/assets/images/avatar_alex_vance_1793956015466.jpg',
    status: 'online',
    bio: 'Lead System Architect · Crafting zero-latency communication tools.',
    email: 'alex.vance@wmessenger.internal',
    phone: '+1 (555) 234-8901',
    isVerified: true,
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    handle: '@elena_r',
    avatarUrl: '/src/assets/images/avatar_elena_rostova_1793956015329.jpg',
    status: 'online',
    bio: 'Principal Product Designer. Focused on spatial micro-interactions and dark-mode ergonomics.',
    email: 'elena.rostova@designlab.co',
    phone: '+1 (555) 491-0392',
    isVerified: true,
  },
  {
    id: 'user_marcus',
    name: 'Marcus Chen',
    handle: '@marcus_chen',
    avatarUrl: '/src/assets/images/avatar_marcus_chen_1793956015815.jpg',
    status: 'away',
    lastSeen: '15m ago',
    bio: 'Founder & Infrastructure Engineer. Building distributed consensus engines.',
    email: 'marcus@chencapital.io',
    phone: '+1 (555) 782-4419',
    isVerified: true,
  },
  {
    id: 'user_sophia',
    name: 'Sophia Alvarez',
    handle: '@sophia_a',
    avatarUrl: '/src/assets/images/avatar_sophia_alvarez_1793956015653.jpg',
    status: 'online',
    bio: 'AI & Cryptography Researcher. End-to-end multi-party encryption protocols.',
    email: 's.alvarez@cryptoresearch.org',
    phone: '+1 (555) 912-8830',
    isVerified: true,
  },
  {
    id: 'user_david',
    name: 'David Kim',
    handle: '@davidkim',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'offline',
    lastSeen: '2h ago',
    bio: 'DevOps & Cloud Systems. SRE for high-throughput WebSocket clusters.',
    email: 'david@wmessenger.internal',
    isVerified: false,
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  theme: 'dark',
  soundEnabled: true,
  notificationsEnabled: true,
  enterIsSend: true,
  readReceipts: true,
  twoFactorEnabled: true,
  chatWallpaper: 'navy',
  accentColor: 'blue',
};

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'chat_elena': [
    {
      id: 'm1_elena',
      chatId: 'chat_elena',
      senderId: 'user_elena',
      senderName: 'Elena Rostova',
      type: 'text',
      content: 'Hey Alex! I just reviewed the new W Messenger design system specs. The deep navy `#0A1329` combined with the electric cobalt accents looks phenomenal.',
      timestamp: '10:14 AM',
      rawTimestamp: Date.now() - 3600000 * 2,
      status: 'read',
      reactions: [
        { emoji: '🔥', count: 2, users: ['user_alex', 'user_elena'] },
        { emoji: '💙', count: 1, users: ['user_alex'] }
      ]
    },
    {
      id: 'm2_alex',
      chatId: 'chat_elena',
      senderId: 'user_alex',
      senderName: 'Alex Vance',
      type: 'text',
      content: 'Glad you like it Elena! We also wanted to ensure the origami W logo stands out with the faceted lighting across iOS, Android, and Desktop viewports.',
      timestamp: '10:18 AM',
      rawTimestamp: Date.now() - 3600000 * 1.8,
      status: 'read'
    },
    {
      id: 'm3_elena',
      chatId: 'chat_elena',
      senderId: 'user_elena',
      senderName: 'Elena Rostova',
      type: 'text',
      content: 'Here is the responsive layout inspection. Notice how the chat list seamlessly collapses on mobile while preserving full master-detail presence on desktop:',
      timestamp: '10:22 AM',
      rawTimestamp: Date.now() - 3600000 * 1.5,
      status: 'read'
    },
    {
      id: 'm4_elena',
      chatId: 'chat_elena',
      senderId: 'user_elena',
      senderName: 'Elena Rostova',
      type: 'voice',
      content: 'Voice note: 0:34',
      mediaMetadata: {
        durationSeconds: 34,
        fileName: 'design_review_note.wav'
      },
      timestamp: '10:23 AM',
      rawTimestamp: Date.now() - 3600000 * 1.4,
      status: 'read',
      reactions: [
        { emoji: '👍', count: 1, users: ['user_alex'] }
      ]
    },
    {
      id: 'm5_alex',
      chatId: 'chat_elena',
      senderId: 'user_alex',
      senderName: 'Alex Vance',
      type: 'text',
      content: 'Got it. I will enable the live device emulator bar at the top so any stakeholder can switch between iPhone 16 Pro, Pixel 9, and Desktop viewports in one click!',
      timestamp: '10:28 AM',
      rawTimestamp: Date.now() - 3600000 * 1.1,
      status: 'read'
    },
    {
      id: 'm6_elena',
      chatId: 'chat_elena',
      senderId: 'user_elena',
      senderName: 'Elena Rostova',
      type: 'text',
      content: 'Perfect! Feel free to send me any test messages here, I will reply in real time. 🚀',
      timestamp: '10:30 AM',
      rawTimestamp: Date.now() - 3600000 * 0.9,
      status: 'read'
    }
  ],
  'chat_marcus': [
    {
      id: 'm1_marcus',
      chatId: 'chat_marcus',
      senderId: 'user_marcus',
      senderName: 'Marcus Chen',
      type: 'text',
      content: 'Alex, the low-latency WebSocket gateway benchmarking is complete. We achieved sub-15ms round-trip delivery on encrypted payloads.',
      timestamp: '09:05 AM',
      rawTimestamp: Date.now() - 3600000 * 3.5,
      status: 'read'
    },
    {
      id: 'm2_marcus',
      chatId: 'chat_marcus',
      senderId: 'user_marcus',
      senderName: 'Marcus Chen',
      type: 'file',
      content: 'W_Messenger_Architecture_v2.pdf',
      mediaMetadata: {
        fileName: 'W_Messenger_Architecture_v2.pdf',
        fileSize: '4.8 MB'
      },
      timestamp: '09:07 AM',
      rawTimestamp: Date.now() - 3600000 * 3.4,
      status: 'read',
      reactions: [
        { emoji: '👏', count: 1, users: ['user_alex'] }
      ]
    },
    {
      id: 'm3_alex',
      chatId: 'chat_marcus',
      senderId: 'user_alex',
      senderName: 'Alex Vance',
      type: 'text',
      content: 'Exceptional work Marcus! The architecture is modular and ready for the distributed backend.',
      timestamp: '09:12 AM',
      rawTimestamp: Date.now() - 3600000 * 3.2,
      status: 'read'
    }
  ],
  'chat_sophia': [
    {
      id: 'm1_sophia',
      chatId: 'chat_sophia',
      senderId: 'user_sophia',
      senderName: 'Sophia Alvarez',
      type: 'text',
      content: 'Hi Alex, the Double Ratchet key exchange algorithm is integrated for end-to-end encryption. Every message has unique cryptographic PFS (Perfect Forward Secrecy).',
      timestamp: 'Yesterday',
      rawTimestamp: Date.now() - 86400000,
      status: 'read'
    },
    {
      id: 'm2_alex',
      chatId: 'chat_sophia',
      senderId: 'user_alex',
      senderName: 'Alex Vance',
      type: 'text',
      content: 'That elevates W Messenger to enterprise-grade privacy right from day one.',
      timestamp: 'Yesterday',
      rawTimestamp: Date.now() - 86400000 + 120000,
      status: 'read'
    }
  ],
  'chat_core_team': [
    {
      id: 'm1_core',
      chatId: 'chat_core_team',
      senderId: 'user_elena',
      senderName: 'Elena Rostova',
      type: 'text',
      content: 'Welcome everyone to the W Messenger Core Product sprint room! 🌟',
      timestamp: 'Yesterday',
      rawTimestamp: Date.now() - 86400000 * 1.5,
      status: 'read'
    },
    {
      id: 'm2_core',
      chatId: 'chat_core_team',
      senderId: 'user_marcus',
      senderName: 'Marcus Chen',
      type: 'text',
      content: 'All systems green across our edge distribution nodes. Ready for full deployment.',
      timestamp: 'Yesterday',
      rawTimestamp: Date.now() - 86400000 * 1.3,
      status: 'read'
    },
    {
      id: 'm3_core',
      chatId: 'chat_core_team',
      senderId: 'user_sophia',
      senderName: 'Sophia Alvarez',
      type: 'text',
      content: 'Security verification tests passed 100%. Zero known vulnerabilities.',
      timestamp: '11:45 AM',
      rawTimestamp: Date.now() - 3600000 * 1.2,
      status: 'read'
    }
  ],
  'chat_announcements': [
    {
      id: 'm1_ann',
      chatId: 'chat_announcements',
      senderId: 'w_system',
      senderName: 'W Messenger News',
      type: 'text',
      content: '⚡ Welcome to W Messenger v1.0! Experience ultra-responsive real-time communication crafted with modern ergonomics, multi-platform design, and privacy by design.',
      timestamp: 'Nov 06',
      rawTimestamp: Date.now() - 86400000 * 2,
      status: 'read'
    }
  ]
};

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_elena',
    type: 'direct',
    title: 'Elena Rostova',
    avatarUrl: '/src/assets/images/avatar_elena_rostova_1793956015329.jpg',
    participantIds: ['user_alex', 'user_elena'],
    participants: [SEED_USERS[0], SEED_USERS[1]],
    isPinned: true,
    unreadCount: 0,
    lastMessage: INITIAL_MESSAGES['chat_elena'][INITIAL_MESSAGES['chat_elena'].length - 1],
    description: 'Design Lead · Product UX & Visual Architecture',
  },
  {
    id: 'chat_marcus',
    type: 'direct',
    title: 'Marcus Chen',
    avatarUrl: '/src/assets/images/avatar_marcus_chen_1793956015815.jpg',
    participantIds: ['user_alex', 'user_marcus'],
    participants: [SEED_USERS[0], SEED_USERS[2]],
    isPinned: true,
    unreadCount: 0,
    lastMessage: INITIAL_MESSAGES['chat_marcus'][INITIAL_MESSAGES['chat_marcus'].length - 1],
    description: 'Founder & Distributed Systems Engineer',
  },
  {
    id: 'chat_core_team',
    type: 'group',
    title: 'W Messenger Core Team',
    participantIds: ['user_alex', 'user_elena', 'user_marcus', 'user_sophia', 'user_david'],
    participants: SEED_USERS,
    isPinned: false,
    unreadCount: 2,
    lastMessage: INITIAL_MESSAGES['chat_core_team'][INITIAL_MESSAGES['chat_core_team'].length - 1],
    description: 'Engineering, design, and architecture channel for W Messenger release.',
  },
  {
    id: 'chat_sophia',
    type: 'direct',
    title: 'Sophia Alvarez',
    avatarUrl: '/src/assets/images/avatar_sophia_alvarez_1793956015653.jpg',
    participantIds: ['user_alex', 'user_sophia'],
    participants: [SEED_USERS[0], SEED_USERS[3]],
    isPinned: false,
    unreadCount: 0,
    lastMessage: INITIAL_MESSAGES['chat_sophia'][INITIAL_MESSAGES['chat_sophia'].length - 1],
    description: 'Cryptography & Protocol Security Specialist',
  },
  {
    id: 'chat_announcements',
    type: 'channel',
    title: 'W Messenger Announcements',
    participantIds: ['user_alex'],
    participants: [SEED_USERS[0]],
    isPinned: false,
    unreadCount: 0,
    lastMessage: INITIAL_MESSAGES['chat_announcements'][INITIAL_MESSAGES['chat_announcements'].length - 1],
    description: 'Official product updates, release notes, and security advisories.',
  }
];

class ChatService {
  private currentUser: User = SEED_USERS[0];
  private chats: Chat[] = [];
  private messages: Record<string, Message[]> = {};
  private settings: AppSettings = INITIAL_SETTINGS;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedUser = localStorage.getItem('wm_current_user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }

      const savedChats = localStorage.getItem('wm_chats');
      if (savedChats) {
        this.chats = JSON.parse(savedChats);
      } else {
        this.chats = [...INITIAL_CHATS];
      }

      const savedMessages = localStorage.getItem('wm_messages');
      if (savedMessages) {
        this.messages = JSON.parse(savedMessages);
      } else {
        this.messages = { ...INITIAL_MESSAGES };
      }

      const savedSettings = localStorage.getItem('wm_settings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }
    } catch {
      this.chats = [...INITIAL_CHATS];
      this.messages = { ...INITIAL_MESSAGES };
      this.settings = INITIAL_SETTINGS;
    }
  }

  private persist() {
    try {
      localStorage.setItem('wm_current_user', JSON.stringify(this.currentUser));
      localStorage.setItem('wm_chats', JSON.stringify(this.chats));
      localStorage.setItem('wm_messages', JSON.stringify(this.messages));
      localStorage.setItem('wm_settings', JSON.stringify(this.settings));
    } catch {
      // storage quota or fallback
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.persist();
    this.listeners.forEach(l => l());
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.notify();
  }

  public getChats(): Chat[] {
    return this.chats;
  }

  public getChat(chatId: string): Chat | undefined {
    return this.chats.find(c => c.id === chatId);
  }

  public getMessages(chatId: string): Message[] {
    return this.messages[chatId] || [];
  }

  public getSettings(): AppSettings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.notify();
  }

  public markAsRead(chatId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat && chat.unreadCount > 0) {
      chat.unreadCount = 0;
      this.notify();
    }
  }

  public togglePinChat(chatId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.isPinned = !chat.isPinned;
      this.notify();
    }
  }

  public toggleMuteChat(chatId: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.isMuted = !chat.isMuted;
      this.notify();
    }
  }

  public deleteChat(chatId: string) {
    this.chats = this.chats.filter(c => c.id !== chatId);
    delete this.messages[chatId];
    this.notify();
  }

  public sendMessage(
    chatId: string,
    content: string,
    type: MessageType = 'text',
    mediaUrl?: string,
    mediaMetadata?: Message['mediaMetadata'],
    replyToMessage?: Message['replyToMessage']
  ): Message {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      chatId,
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      senderAvatar: this.currentUser.avatarUrl,
      type,
      content,
      mediaUrl,
      mediaMetadata,
      timestamp: timeString,
      rawTimestamp: Date.now(),
      status: 'sending',
      replyToMessage,
      reactions: []
    };

    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
    }
    this.messages[chatId].push(newMsg);

    // Update chat last message
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex >= 0) {
      this.chats[chatIndex].lastMessage = newMsg;
      // Move chat to top of list if not pinned order
      const chat = this.chats.splice(chatIndex, 1)[0];
      this.chats.unshift(chat);
    }

    this.notify();

    // Simulate network progression: sending -> sent -> delivered -> read
    setTimeout(() => {
      newMsg.status = 'sent';
      this.notify();
    }, 350);

    setTimeout(() => {
      newMsg.status = 'delivered';
      this.notify();
    }, 850);

    setTimeout(() => {
      newMsg.status = 'read';
      this.notify();
    }, 1600);

    // If talking to a simulated bot or contact (like Elena or Marcus), trigger an intelligent reply!
    this.triggerSimulatedReply(chatId, content);

    return newMsg;
  }

  private triggerSimulatedReply(chatId: string, userText: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (!chat || chat.type === 'channel') return;

    // Determine respondent
    let respondent = chat.participants.find(p => p.id !== this.currentUser.id);
    if (!respondent) {
      respondent = SEED_USERS[1]; // Elena default
    }

    // Set typing indicator
    setTimeout(() => {
      if (chat) {
        chat.typingUsers = [respondent!.name];
        this.notify();
      }
    }, 1000);

    // Send response after typing delay
    setTimeout(() => {
      if (!chat) return;
      chat.typingUsers = [];

      const replies: string[] = [
        `Received! Testing the real-time pipeline in W Messenger. "${userText.slice(0, 30)}..." arrived cleanly.`,
        `That sounds great! The navy & blue UI hierarchy looks exceptionally crisp here.`,
        `Confirmed! Our encryption keys verified this packet. Sub-millisecond rendering looks super smooth.`,
        `Nice message! Are you testing on mobile preview or desktop browser right now?`,
        `Checked! All responsive viewports are syncing in real time.`
      ];

      const replyContent = replies[Math.floor(Math.random() * replies.length)];
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const incomingMsg: Message = {
        id: 'msg_reply_' + Date.now(),
        chatId,
        senderId: respondent!.id,
        senderName: respondent!.name,
        senderAvatar: respondent!.avatarUrl,
        type: 'text',
        content: replyContent,
        timestamp: timeString,
        rawTimestamp: Date.now(),
        status: 'read',
        reactions: []
      };

      if (!this.messages[chatId]) {
        this.messages[chatId] = [];
      }
      this.messages[chatId].push(incomingMsg);
      chat.lastMessage = incomingMsg;
      this.notify();

      // Play soft simulated message receive sound if enabled
      if (this.settings.soundEnabled) {
        this.playSoftNotificationSound();
      }
    }, 2800);
  }

  public addReaction(chatId: string, messageId: string, emoji: string) {
    const msgs = this.messages[chatId];
    if (!msgs) return;
    const msg = msgs.find(m => m.id === messageId);
    if (!msg) return;

    if (!msg.reactions) {
      msg.reactions = [];
    }

    const existingReaction = msg.reactions.find(r => r.emoji === emoji);
    const userId = this.currentUser.id;

    if (existingReaction) {
      if (existingReaction.users.includes(userId)) {
        // Toggle off
        existingReaction.users = existingReaction.users.filter(u => u !== userId);
        existingReaction.count = existingReaction.users.length;
        if (existingReaction.count === 0) {
          msg.reactions = msg.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        // Add
        existingReaction.users.push(userId);
        existingReaction.count = existingReaction.users.length;
      }
    } else {
      msg.reactions.push({
        emoji,
        count: 1,
        users: [userId]
      });
    }

    this.notify();
  }

  public createNewChat(targetUser: User): Chat {
    // Check if direct chat already exists
    const existing = this.chats.find(
      c => c.type === 'direct' && c.participantIds.includes(targetUser.id)
    );
    if (existing) {
      return existing;
    }

    const newChat: Chat = {
      id: 'chat_' + targetUser.id + '_' + Date.now(),
      type: 'direct',
      title: targetUser.name,
      avatarUrl: targetUser.avatarUrl,
      participantIds: [this.currentUser.id, targetUser.id],
      participants: [this.currentUser, targetUser],
      unreadCount: 0,
      description: targetUser.bio || 'Direct private conversation on W Messenger.'
    };

    this.chats.unshift(newChat);
    this.messages[newChat.id] = [
      {
        id: 'sys_' + Date.now(),
        chatId: newChat.id,
        senderId: 'system',
        senderName: 'System',
        type: 'system',
        content: `Encrypted direct session initiated with ${targetUser.name}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rawTimestamp: Date.now(),
        status: 'read'
      }
    ];

    this.notify();
    return newChat;
  }

  public createGroupChat(title: string, selectedUsers: User[], description?: string): Chat {
    const newChat: Chat = {
      id: 'group_' + Date.now(),
      type: 'group',
      title,
      participantIds: [this.currentUser.id, ...selectedUsers.map(u => u.id)],
      participants: [this.currentUser, ...selectedUsers],
      unreadCount: 0,
      description: description || 'Group conversation on W Messenger.'
    };

    this.chats.unshift(newChat);
    this.messages[newChat.id] = [
      {
        id: 'sys_' + Date.now(),
        chatId: newChat.id,
        senderId: 'system',
        senderName: 'System',
        type: 'system',
        content: `${this.currentUser.name} created group "${title}" with ${selectedUsers.length + 1} members.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rawTimestamp: Date.now(),
        status: 'read'
      }
    ];

    this.notify();
    return newChat;
  }

  public resetToDefault() {
    this.currentUser = SEED_USERS[0];
    this.chats = [...INITIAL_CHATS];
    this.messages = { ...INITIAL_MESSAGES };
    this.settings = INITIAL_SETTINGS;
    this.notify();
  }

  private playSoftNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // AudioContext unavailable or blocked
    }
  }
}

export const chatService = new ChatService();
