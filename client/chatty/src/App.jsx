import React, { useState, useEffect, useRef, use } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfileUI from './pages/ProfileUi';
// Token helper functions
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');


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

// Login Component
function Login({ onLogin, onSwitchToSignup }) {
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
      console.log(data);
      setToken(data.data.token);
      onLogin();
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
}

// Signup Component
function Signup({ onSignup, onSwitchToLogin }) {
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: name, // Backend expects this
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    // Save token if backend returns one (you can modify backend to return a token too)
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    onSignup(); // Proceed to login/dashboard
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
  );
}

// Chat Component
function Chat({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatType, setChatType] = useState('private');
  const [showSidebar, setShowSidebar] = useState(true);
  const [socket, setSocket] = useState(null);
  const currentUserIdRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      console.log('Decoded JWT payload:', jsonPayload);
      const { id } = JSON.parse(jsonPayload);
      console.log(id)
      setCurrentUserId(id);
      currentUserIdRef.current = id;
      console.log('Current user ID set:', id);
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    const newSocket = io('http://localhost:3000', {
      auth: {
        token: token
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      setConnected(true);
    });
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });
    


    newSocket.on('new_message', (message) => {
      console.log('Received new message:', message);
      console.log('Current user ID:', currentUserId);
      
      if (message.sender.id !== currentUserIdRef || 
          (activeChat && message.chatId === activeChat.id)) {
        setMessages(prev => {
          const messageExists = prev.some(m => m.id === message.id);
          if (messageExists) return prev;

          return [...prev, {
            id: message.id,
            text: message.text,
            sender: message.sender.id,
            senderName: message.sender.name,
            senderEmail: message.sender.email,
            timestamp: new Date(message.timestamp),
            chatId: message.chatId,
            chatType: message.chatType
          }];
        });
        
      
      }
    
    });

    newSocket.on('error_message', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  
  },[]); // ✅ depend on currentUserId
//   useEffect(() => {
//     if (!currentUserId) return; // 🚨 wait until it's set

//   socket.on('new_message', (data) => {
//     console.log("Received new message:", data);
//     console.log("Current user ID:", currentUserId);

//     setMessages((prev) => [...prev, data]);
//   });

//   return () => {
//     socket.off('new_message');
//   };
  
// }, [currentUserId]); // ✅ depend on currentUserId


  // Scroll to bottom when messages change
  

  useEffect(() => {
  console.log('Messages updated:', messages);
}, [messages]);

  useEffect(() => {
  if (!socket || !activeChat) return;

  // Emit request to server for message history
  socket.emit('get_message_history', {
    chatId: activeChat.id,
    chatType: chatType,
  });

  // Receive message history from server
  const handleHistory = (fetchedMessages) => {
    console.log('History received:', fetchedMessages);

    setMessages(
      fetchedMessages.map((msg) => ({
        id: msg._id,
        text: msg.text,
        sender: msg.sender.id,
        senderName: msg.sender.name,
        senderEmail: msg.sender.email,
        chatId: msg.chatId,
        chatType: msg.chatType,
        timestamp: new Date(msg.timestamp),
      }))
    );
  };

  const handleError = (err) => {
    console.error('Error loading history:', err.message);
  };

  socket.on('message_history', handleHistory);
  socket.on('error_message', handleError);

  // Clean up listeners on unmount or dependency change
  return () => {
    socket.off('message_history', handleHistory);
    socket.off('error_message', handleError);
  };
}, [socket, activeChat]);
// Only runs once when socket & activeChat are ready


// runs once when socket & activeChat are both set



  const selectPrivateChat = (user) => {
    setActiveChat(user);
    setChatType('private');
    setMessages([
      { 
        id: Date.now(), 
        text: `Started a private conversation with ${user.name}`, 
        sender: "system", 
        timestamp: new Date() 
      }
    ]);
  };

  const selectGroupChat = (group) => {
    setActiveChat(group);
    setChatType('group');
    setMessages([
      { 
        id: Date.now(), 
        text: `Joined ${group.name} group chat`, 
        sender: "system", 
        timestamp: new Date() 
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat || !socket || !connected || !currentUserId) {
      console.log('Cannot send message:', { 
        hasMessage: !!newMessage.trim(), 
        hasActiveChat: !!activeChat, 
        hasSocket: !!socket, 
        isConnected: connected,
        hasUserId: !!currentUserId
      });
      return;
    }

    const messageData = {
      text: newMessage.trim(),
      chatId: activeChat.id,
      chatType: chatType,
      timestamp: new Date().toISOString()
    };

    // Emit message to server
    socket.emit('send_message', messageData);
    console.log('Message sent:', messageData);

    // Don't add message to state here - wait for server confirmation
    // This prevents duplicate messages
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} bg-gray-800 transition-all duration-300 overflow-hidden`}>
        {/* Sidebar content */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Chats</h2>
            <button 
              onClick={() => setShowSidebar(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Private Chats */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Private Messages</h3>
            <div className="space-y-2">
              {mockUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => selectPrivateChat(user)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChat?.id === user.id ? 'bg-purple-600' : 'hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl mr-3">{user.avatar}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs opacity-75">{user.status}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Group Chats */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Group Chats</h3>
            <div className="space-y-2">
              {mockGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => selectGroupChat(group)}
                  className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                    activeChat?.id === group.id && activeChat?.type === 'group'
                      ? 'bg-purple-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <span className="text-xl mr-3">{group.avatar}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{group.name}</p>
                    <p className="text-xs opacity-75">{group.members} members</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setShowSidebar(true)}
              className="text-gray-400 hover:text-white mr-4 lg:hidden"
            >
              ☰
            </button>
            {activeChat ? (
              <div className="flex items-center">
                <span className="text-2xl mr-3">{activeChat.avatar}</span>
                <div>
                  <h2 className="text-white font-semibold">{activeChat.name}</h2>
                  <p className="text-sm text-gray-400">
                    {chatType === 'private' ? 'Private Chat' : `${activeChat.members} members`}
                  </p>
                </div>
              </div>
            ) : (
              <h2 className="text-white font-semibold">Select a chat to start messaging</h2>
            )}
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
          >

            Logout
          </button>
          

        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              

              {message.sender != currentUserId && (
                <div className="mr-3 mt-1">
                  <span className="text-xl">👤</span>
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
                {message.sender != currentUserId && message.senderName && (
                  <p className="text-xs text-purple-300 mb-1 font-medium">{message.senderName}</p>
                )}
                <p className="text-sm">{message.text}</p>
                
                <p className="text-xs mt-1 opacity-70">
                  {new Date (message.timestamp).toLocaleTimeString()}
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
                disabled={!connected}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !connected}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {!connected ? '⌛' : '➤'}
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
}

// Main App Component
function App() {
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
    removeToken();
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const renderView = () => {
    if (currentView === 'chat' && !getToken()) {
      return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentView('signup')} />;
    }

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
     <Router>
    <div className="App">
      {/* {renderView()} */}
      
      <Routes>
        
        {/* {!isAuthenticated && ( */}
          <Route
            path="/profile"
            element={<ProfileUI />}
          />
        {/* )} */}

      </Routes>
        
    
    </div>
    </Router>
  );
}

export default App;