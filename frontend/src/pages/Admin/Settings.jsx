// src/Components/Admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../pages/User/UserContext';

const Settings = () => {
  const [maxEvents, setMaxEvents] = useState('');
  const [maxInvites, setMaxInvites] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) return; // Nếu chưa có user, đợi load
    if (user.role !== 'admin') {
      toast.error('Access denied!');
      navigate('/'); // Không phải admin thì out về home
      return;
    }

    // Fetch current settings từ server
    axios.get('/settings')
      .then(res => {
        setMaxEvents(res.data.maxEvents);
        setMaxInvites(res.data.maxInvites);
      })
      .catch(err => {
        console.error('Failed to load settings', err);
        toast.error('Failed to load settings');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, navigate]);

  const saveSettings = async () => {
    try {
      await axios.post('/settings', {
        maxEvents: Number(maxEvents),
        maxInvites: Number(maxInvites)
      });
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save settings!');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading Settings...</div>;
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Settings</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Max Events per User</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={maxEvents}
          onChange={(e) => setMaxEvents(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Max Invitations per Event</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={maxInvites}
          onChange={(e) => setMaxInvites(e.target.value)}
        />
      </div>

      <button
        onClick={saveSettings}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
