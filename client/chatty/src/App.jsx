import React, { useState, useEffect, useRef } from 'react';

// Mock token storage (replace with localStorage in real app)
let tokenStorage = null;
import io from 'socket.io-client';
// Token helper functions
const getToken = () => tokenStorage;
const setToken = (token) => { tokenStorage = token; };
const removeToken = () => { tokenStorage = null; };
const socket = io('http://localhost:3000', {
  auth: {
    token: localStorage.getItem("token") // or from cookies
  }
});

// Mock data
const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', avatar: '👩‍💼', status: 'online' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', avatar: '👨‍💻', status: 'online' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', avatar: '👩‍🎨', status: 'away' },
  { id: 4, name: 'David Wilson', email: 'david@example.com', avatar: '👨‍🚀', status: 'offline' }
];

const mockGroups = [
  { id: 1, name: 'General Discussion', members: 24, lastMessage: 'Hey everyone!', avatar: '💬' },
  { id: 2, name: 'Tech Talk', members: 12, lastMessage: 'New React features...', avatar: '💻' },
  { id: 3, name: 'Random', members: 8, lastMessage: 'Coffee break time!', avatar: '☕' }
];

// Mock API functions
const mockAuth = async (email, password, isLogin = true) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email && password.length >= 6) {
    return { token: `mock_jwt_${Date.now()}`, user: { email, name: email.split('@')[0] } };
  }
  throw new Error(isLogin ? 'Invalid credentials' : 'Registration failed');
};

// Beautiful Login Component
const Login = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log(data)
      setToken(data.data.token); // Store JWT token in mock storage
      localStorage.setItem('token', data.data.token); // Store JWT token
      onLogin(); // Notify parent component
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-500 bg-opacity-10 rounded-full blur-xl animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-yellow-400 bg-opacity-10 rounded-full blur-xl animate-pulse delay-300"></div>
      
      <div className="relative bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-purple-100 text-sm">Sign in to continue your conversations</p>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="bg-blue-500 bg-opacity-20 border border-blue-400 text-blue-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex items-center">
            <span className="text-lg mr-2">✨</span>
            <div>
              <strong className="text-sm">Demo Credentials:</strong><br />
              <span className="text-xs">test@example.com / password123</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-purple-100 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={onSwitchToSignup}
              className="text-pink-400 hover:text-pink-300 font-medium underline transition-colors"
            >
              Create one here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Beautiful Signup Component
const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Store JWT token
    onSignup(); // Callback after successful signup
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-28 h-28 bg-emerald-500 bg-opacity-10 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute top-1/3 right-10 w-20 h-20 bg-cyan-400 bg-opacity-10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Us</h1>
          <p className="text-emerald-100 text-sm">Create your account to start chatting</p>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-5">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter your Username"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Create a password (6+ characters)"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-emerald-100 text-sm">
            Already have an account?{' '}
            <button 
              onClick={onSwitchToLogin}
              className="text-cyan-400 hover:text-cyan-300 font-medium underline transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

// Chat Interface with Private/Group Chat Features
const Chat = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatType, setChatType] = useState('group'); // 'private' or 'group'
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      { id: 1, text: "Welcome to the chat! Select a user or group to start messaging.", sender: "system", timestamp: new Date() }
    ]);
  }, []);

  // Mock socket connection
  useEffect(() => {
    const connectSocket = () => {
      setConnected(true);
      
      const interval = setInterval(() => {
        if (activeChat && Math.random() > 0.85) {
          const mockMessages = [
            "Hey there! 👋",
            "How's your day going?",
            "Just finished a great project!",
            "Anyone up for a coffee break? ☕",
            "This new feature looks amazing!",
            "Great job on the presentation today!",
            "Looking forward to the weekend 🎉"
          ];
          
          const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
          
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            text: mockMessages[Math.floor(Math.random() * mockMessages.length)],
            sender: "other",
            senderName: randomUser.name,
            senderAvatar: randomUser.avatar,
            timestamp: new Date()
          }]);
        }
      }, 10000);

      return () => {
        clearInterval(interval);
        setConnected(false);
      };
    };

    const cleanup = connectSocket();
    return cleanup;
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  


  const selectPrivateChat = (user) => {
    setActiveChat(user);
    setChatType('private');
    setMessages([
      { id: 1, text: `Started a private conversation with ${user.name}`, sender: "system", timestamp: new Date() }
    ]);
  };

  const selectGroupChat = (group) => {
    setActiveChat(group);
    setChatType('group');
    setMessages([
      { id: 1, text: `Joined ${group.name} group chat`, sender: "system", timestamp: new Date() }
    ]);
  };
  const handleSendMessage = () => {
  if (!newMessage.trim() || !activeChat) return;

  const messageData = {
    text: newMessage.trim(),
    chatId: activeChat.id,               // ID of the user or group
    chatType: chatType,                 // 'private' or 'group'
    timestamp: new Date().toISOString() // Optional for client display
  };

  // Emit message to server via socket
  socket.emit('send_message', messageData);

  // Optimistically add message to local state
  setMessages(prev => [
    ...prev,
    {
      id: Date.now(),
      text: messageData.text,
      sender: 'me',
      timestamp: new Date()
    }
  ]);

  setNewMessage('');
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }
  // Handle socket message reception

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Chats</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">{connected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setChatType('private')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                chatType === 'private' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              👥 Private
            </button>
            <button
              onClick={() => setChatType('group')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                chatType === 'group' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              💬 Groups
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatType === 'private' ? (
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-400 mb-3">DIRECT MESSAGES</h3>
              {mockUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => selectPrivateChat(user)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChat?.id === user.id ? 'bg-purple-600' : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="relative">
                    <span className="text-2xl">{user.avatar}</span>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                      user.status === 'online' ? 'bg-green-500' : 
                      user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.name}</p>
                    <p className="text-gray-400 text-xs capitalize">{user.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-400 mb-3">GROUP CHANNELS</h3>
              {mockGroups.map(group => (
                <div
                  key={group.id}
                  onClick={() => selectGroupChat(group)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChat?.id === group.id ? 'bg-purple-600' : 'hover:bg-gray-700'
                  }`}
                >
                  <span className="text-2xl">{group.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{group.name}</p>
                    <p className="text-gray-400 text-xs truncate">{group.members} members</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👤</span>
              <div>
                <p className="text-white font-medium">You</p>
                <p className="text-green-400 text-xs">● Online</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-400 hover:text-white transition-colors lg:hidden"
            >
              ☰
            </button>
            {activeChat ? (
              <>
                <span className="text-2xl">{activeChat.avatar}</span>
                <div>
                  <h3 className="text-white font-medium">{activeChat.name}</h3>
                  <p className="text-gray-400 text-xs">
                    {chatType === 'private' 
                      ? `${activeChat.status}` 
                      : `${activeChat.members} members`
                    }
                  </p>
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-white font-medium">Select a chat</h3>
                <p className="text-gray-400 text-xs">Choose a user or group to start messaging</p>
              </div>
            )}
          </div>
          
          {activeChat && (
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-white transition-colors p-2">📞</button>
              <button className="text-gray-400 hover:text-white transition-colors p-2">📹</button>
              <button className="text-gray-400 hover:text-white transition-colors p-2">ℹ️</button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'other' && (
                <div className="mr-3 mt-1">
                  <span className="text-xl">{message.senderAvatar}</span>
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'me'
                    ? 'bg-purple-600 text-white'
                    : message.sender === 'system'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-800 text-white'
                } shadow-lg`}
              >
                {message.sender === 'other' && message.senderName && (
                  <p className="text-xs text-purple-300 mb-1 font-medium">{message.senderName}</p>
                )}
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {activeChat ? (
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex space-x-3">
              <button className="text-gray-400 hover:text-white transition-colors">📎</button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${activeChat.name}...`}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="text-gray-400 hover:text-white transition-colors">😊</button>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ➤
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="text-center text-gray-400">
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      setCurrentView('chat');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('chat');
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    setCurrentView('chat');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const renderView = () => {
    if (currentView === 'chat' && !getToken()) {
      return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentView('signup')} />;
    }
    // if(getToken()){
    //   return <Chat onLogout={handleLogout} />;
    // }

    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentView('signup')} />;
      case 'signup':
        return <Signup onSignup={handleSignup} onSwitchToLogin={() => setCurrentView('login')} />;
      case 'chat':
        return <Chat onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentView('signup')} />;
    }
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
};

export default App;