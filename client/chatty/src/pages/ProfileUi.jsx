import React, { useEffect, useState } from 'react';
import { 
  User, 
  Settings, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Shield,
  Bell,
  Moon,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Check
} from 'lucide-react';

const ProfileUI = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    messages: true,
    calls: true,
    groupUpdates: false,
    sounds: true
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Bob Smith',
    username: '@bobsmith',
    email: 'bob.smith@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Software Developer passionate about creating amazing user experiences. Love to code, travel, and explore new technologies.',
    joinDate: 'January 2023',
    avatar: '👨',
    status: 'online',
    theme: 'dark',
    language: 'English'
  });


    const [tempProfile, setTempProfile] = useState({ ...userProfile });
  const handleData = async ()=>{
    try{
    const response = await fetch('http://localhost:3000/api/v1/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json   ',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    });
    // console.log(object)
    if (response.ok) {
      const data = await response.json();
      console.log('User profile data:', data.data);
      

      setUserProfile({
        name: data.data.name ,
        username: data.data.username ,
        email: data.data.email ,
        phone: data.data.phone || '',
        location: data.data.location || '',
        bio: data.data.bio || '',
        avatar: data.data.avatar || '👤',
        joinDate: new Date(data.data.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        }),

      });
      setTempProfile({
        name: data.data.name ,
        username: data.data.username ,
        email: data.data.email ,
        phone: data.data.phone || '',
        location: data.data.location || '',
        bio: data.data.bio || '',
        joinDate: new Date(data.data.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        })
    });
    
}
    



  }
    catch (error) {
      console.error('Error fetching user profile:', error);     
    }
  };
  useEffect(() => {
    handleData();       
    }, []);

  const handleSave = async () => {
    const updatedProfile = await fetch('http://localhost:3000/api/v1/user/update', {
      method: 'PUT',    
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
            
        },      
        body: JSON.stringify({
            name: tempProfile.name,
            username: tempProfile.username,
            email: tempProfile.email,

            phone: tempProfile.phone,
            location: tempProfile.location, 
            bio: tempProfile.bio,
            avatar: tempProfile.avatar,

            status: tempProfile.status,
        })
    });
    if (!updatedProfile.ok) {
      const errorData = await updatedProfile.json();    
        console.error('Error updating profile:', errorData.message);
        return;

    }
    const data = await updatedProfile.json();
    console.log('Profile updated successfully:', data);
    // Update the userProfile state with the new data
    setTempProfile({ ...tempProfile, ...data.data });

    // Set the userProfile state to the updated profile
    setUserProfile({ ...tempProfile, ...data.data });
    // setUserProfile({ ...tempProfile });
    // Reset editing state
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile({ ...userProfile });
    setIsEditing(false);
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-4xl">
            {userProfile.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-gray-800 ${getStatusColor(userProfile.status)}`}></div>
          {isEditing && (
            <button className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Display Name"
              />
              <input
                type="text"
                value={tempProfile.username}
                onChange={(e) => setTempProfile({...tempProfile, username: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Username"
              />
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold">{userProfile.name}</h3>
              <p className="text-gray-400">{userProfile.username}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        {isEditing ? (
          <textarea
            value={tempProfile.bio}
            onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 h-24 resize-none"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-gray-300 bg-gray-700 rounded-lg p-3">{userProfile.bio}</p>
        )}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={tempProfile.email}
              onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-300 bg-gray-700 rounded-lg p-3">{userProfile.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={tempProfile.phone}
              onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-300 bg-gray-700 rounded-lg p-3">{userProfile.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          {isEditing ? (
            <input
              type="text"
              value={tempProfile.location}
              onChange={(e) => setTempProfile({...tempProfile, location: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-300 bg-gray-700 rounded-lg p-3">{userProfile.location}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Joined
          </label>
          <p className="text-gray-300 bg-gray-700 rounded-lg p-3">{userProfile.joinDate}</p>
        </div>
      </div>

      {/* Status Selection */}
      {isEditing && (
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="flex space-x-3">
            {['online', 'away', 'busy', 'offline'].map((status) => (
              <button
                key={status}
                onClick={() => setTempProfile({...tempProfile, status})}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  tempProfile.status === status ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status)}`}></div>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Notifications */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </h3>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <button
                onClick={() => handleNotificationChange(key)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Privacy & Security
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Two-Factor Authentication</span>
            <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors">
              <Check className="w-4 h-4 inline mr-1" />
              Enabled
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Show Online Status</span>
            <button className="w-12 h-6 rounded-full bg-blue-600">
              <div className="w-5 h-5 bg-white rounded-full translate-x-6"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Read Receipts</span>
            <button className="w-12 h-6 rounded-full bg-gray-600">
              <div className="w-5 h-5 bg-white rounded-full translate-x-1"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Moon className="w-5 h-5 mr-2" />
          Appearance
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Theme</span>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white focus:outline-none focus:border-blue-500">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Language</span>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white focus:outline-none focus:border-blue-500">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Change Password
        </h3>
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Current Password"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="password"
            placeholder="New Password"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your profile and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-gray-800 p-2 rounded-lg">
          <TabButton
            id="profile"
            label="Profile"
            icon={User}
            active={activeTab === 'profile'}
            onClick={setActiveTab}
          />
          <TabButton
            id="settings"
            label="Settings"
            icon={Settings}
            active={activeTab === 'settings'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default ProfileUI;