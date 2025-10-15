import React, { useState, useEffect, useRef, use } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfileUI from './pages/ProfileUi';
import DarkModeToggle from './components/DarkModeToggle';
import config from './config/config.js';
// Token helper functions
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');


// Mock data with unread messages
const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', avatar: '👩‍💼', status: 'online', lastMessage: 'Hey, how are you?', lastMessageTime: '2m', unreadCount: 3, isOnline: true },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', avatar: '👨‍💻', status: 'online', lastMessage: 'Thanks for the help!', lastMessageTime: '5m', unreadCount: 0, isOnline: true },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', avatar: '👩‍🎨', status: 'away', lastMessage: 'See you tomorrow', lastMessageTime: '1h', unreadCount: 1, isOnline: false },
  { id: 4, name: 'David Wilson', email: 'david@example.com', avatar: '👨‍🚀', status: 'offline', lastMessage: 'Great work!', lastMessageTime: '2h', unreadCount: 0, isOnline: false },
  { id: 5, name: 'Emma Watson', email: 'emma@example.com', avatar: '👩‍🎭', status: 'online', lastMessage: 'Can we meet later?', lastMessageTime: '10m', unreadCount: 2, isOnline: true },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', avatar: '👨‍🎨', status: 'busy', lastMessage: 'Working on the project', lastMessageTime: '30m', unreadCount: 0, isOnline: true }
];

const mockGroups = [
  { id: 1, name: 'General Discussion', members: 24, lastMessage: 'Hey everyone!', avatar: '💬', lastMessageTime: '5m', unreadCount: 7, isOnline: true },
  { id: 2, name: 'Tech Talk', members: 12, lastMessage: 'New React features are amazing', avatar: '💻', lastMessageTime: '15m', unreadCount: 2, isOnline: true },
  { id: 3, name: 'Random', members: 8, lastMessage: 'Coffee break time! ☕', avatar: '☕', lastMessageTime: '1h', unreadCount: 0, isOnline: false },
  { id: 4, name: 'Project Alpha', members: 5, lastMessage: 'Meeting at 3 PM', avatar: '🚀', lastMessageTime: '2h', unreadCount: 4, isOnline: true }
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
      const response = await fetch(`${config.backend}/api/v1/user/login`, {
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
      // console.log(data);
      setToken(data.data.token);
      onLogin();
      window.location.reload(); // Reload to apply token changes
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-4 sm:left-20 w-16 sm:w-20 h-16 sm:h-20 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-4 sm:right-20 w-24 sm:w-32 h-24 sm:h-32 bg-pink-500 bg-opacity-10 rounded-full blur-xl animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-4 sm:left-10 w-12 sm:w-16 h-12 sm:h-16 bg-yellow-400 bg-opacity-10 rounded-full blur-xl animate-pulse delay-300"></div>
      
      <div className="relative bg-white bg-opacity-10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-xl sm:text-2xl">💬</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back</h1>
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

        <div className="bg-emerald-500 bg-opacity-20 border border-emerald-400 text-emerald-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex items-center">
            <span className="text-lg mr-2">ℹ️</span>
            <div>
              <strong className="text-sm">Registration Info:</strong><br />
              <span className="text-xs">Make sure your backend server is running on localhost:3000</span>
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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Form validation
    if (!name.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting registration with:', { username: name.trim(), email: email.trim() });
      
      const response = await fetch(`${config.backend}/api/v1/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: name.trim(), // Backend expects this
          email: email.trim(),
          password
        })
      });

      console.log('Registration response status:', response.status);
      
      const data = await response.json();
      console.log('Registration response data:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || `Registration failed with status ${response.status}`);
      }

      // Save token if backend returns one
      if (data.data && data.data.token) {
        setToken(data.data.token);
        setSuccess(true);
        setTimeout(() => {
          onSignup(); // Proceed to login/dashboard
          window.location.reload(); // Reload to apply token changes
        }, 1500);
      } else {
        // If no token returned, show success message and switch to login
        setSuccess(true);
        setTimeout(() => {
          // Switch to login view
          onSwitchToLogin();
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different types of errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.message.includes('409')) {
        setError('Email already exists. Please use a different email or try logging in.');
      } else if (err.message.includes('400')) {
        setError('Invalid data provided. Please check your information and try again.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-4 sm:right-20 w-20 sm:w-24 h-20 sm:h-24 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-4 sm:left-20 w-24 sm:w-28 h-24 sm:h-28 bg-emerald-500 bg-opacity-10 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute top-1/3 right-4 sm:right-10 w-16 sm:w-20 h-16 sm:h-20 bg-cyan-400 bg-opacity-10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative bg-white bg-opacity-10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mb-4">
            <span className="text-xl sm:text-2xl">🚀</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Join Us</h1>
          <p className="text-emerald-100 text-sm">Create your account to start chatting</p>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-20 border border-green-400 text-green-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Registration successful! Redirecting...
            </div>
          </div>
        )}

        <div className="bg-emerald-500 bg-opacity-20 border border-emerald-400 text-emerald-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
          <div className="flex items-center">
            <span className="text-lg mr-2">ℹ️</span>
            <div>
              <strong className="text-sm">Backend Connection:</strong><br />
              <span className="text-xs">Ensure your backend server is running on localhost:3000</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || success}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loading || success}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loading || success}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loading || success}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : success ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Account Created!
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
function Chat({ onLogout,onprofile }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatType, setChatType] = useState('private');
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [socket, setSocket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatList, setChatList] = useState([...mockUsers, ...mockGroups]);

  const currentUserIdRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const messagesEndRef = useRef(null);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter chat list based on search
  const filteredChatList = chatList.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mark messages as read when chat is selected
  const markAsRead = (chatId) => {
    setChatList(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ));
  };

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
      // console.log('Decoded JWT payload:', jsonPayload);
      const { id } = JSON.parse(jsonPayload);
      // console.log(id)
      setCurrentUserId(id);
      currentUserIdRef.current = id;
      // console.log('Current user ID set:', id);
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    const newSocket = io(`${config.backend}`, {
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
  
  },[]); 

    useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
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



  const selectChat = (chat) => {
    setActiveChat(chat);
    setChatType(chat.members ? 'group' : 'private');
    markAsRead(chat.id);
    
    // On mobile, hide sidebar when chat is selected
    if (isMobile) {
      setShowSidebar(false);
    }
    
    setMessages([
      { 
        id: Date.now(), 
        text: chat.members ? `Joined ${chat.name} group chat` : `Started a private conversation with ${chat.name}`, 
        sender: "system", 
        timestamp: new Date() 
      }
    ]);
  };

  const selectPrivateChat = (user) => selectChat(user);
  const selectGroupChat = (group) => selectChat(group);

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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <div className={`
        ${showSidebar ? 'w-full sm:w-80' : 'w-0'} 
        bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out overflow-hidden
        ${isMobile ? 'absolute inset-y-0 left-0 z-50' : 'relative'}
        shadow-lg
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
            <div className="flex items-center space-x-2">
              <DarkModeToggle />
              <button
                onClick={onprofile}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
              {isMobile && (
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredChatList.map(chat => (
              <button
                key={chat.id}
                onClick={() => selectChat(chat)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 mb-1 ${
                  activeChat?.id === chat.id 
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {/* Avatar */}
                <div className="relative mr-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-medium">
                    {chat.avatar}
                  </div>
                  {chat.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate mr-2">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center flex-shrink-0">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </span>
                    )}
                  </div>
                  {chat.members && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {chat.members} members
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                {isMobile && (
                  <button 
                    onClick={() => setShowSidebar(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
                <div className="flex items-center min-w-0 flex-1">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-medium">
                      {activeChat.avatar}
                    </div>
                    {activeChat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {activeChat.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {chatType === 'private' ? 'Online' : `${activeChat.members} members`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender !== currentUserId && message.sender !== 'system' && (
                      <div className="mr-3 mt-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                          {message.senderName ? message.senderName.charAt(0).toUpperCase() : '👤'}
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                        message.sender === currentUserId
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : message.sender === 'system'
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-center mx-auto'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {message.sender !== currentUserId && message.sender !== 'system' && message.senderName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                          {message.senderName}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === currentUserId ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Message ${activeChat.name}...`}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      disabled={!connected}
                    />
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !connected}
                    className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
                  >
                    {!connected ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Welcome to your messages
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Select a conversation to start chatting
              </p>
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Browse conversations
                </button>
              )}
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
  const handleprofile=()=>{
    setIsAuthenticated(true);
    setCurrentView('profile');
  }

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
        return <Chat onLogout={handleLogout} onprofile={handleprofile} />;
      case 'profile':
        return <ProfileUI onprofile={handleprofile} />;
      default:
        return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentView('signup')} />;
    }
  };

  return (
    <div className="App">
      {renderView()}
     
    
      
 
    </div>
  );
}

export default App;