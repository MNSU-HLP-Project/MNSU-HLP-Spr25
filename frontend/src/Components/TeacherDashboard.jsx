import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const TeacherDashboard = () => {
  const { api } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements/');
      setAnnouncements(response.data);
    } catch (error) {
      toast.error('Failed to fetch announcements');
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements/', newAnnouncement);
      toast.success('Announcement created successfully!');
      setNewAnnouncement({ title: '', content: '' });
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to create announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.delete(`/announcements/${id}/`);
      toast.success('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-50 p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Teacher Dashboard</h1>

      {/* Create Announcement Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Create Announcement</h2>
        <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Content"
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-purple-500 h-32"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Post Announcement
          </button>
        </form>
      </motion.div>

      {/* Announcements List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Your Announcements</h2>
        {announcements.map((announcement) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-purple-600">{announcement.title}</h3>
                <p className="text-gray-600 mt-2">{announcement.content}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Posted on {new Date(announcement.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteAnnouncement(announcement.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;