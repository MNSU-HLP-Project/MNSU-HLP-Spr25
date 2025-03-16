import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newSubmission, setNewSubmission] = useState({
    title: '',
    content: ''
  });
  const { api } = useAuth(); // Get the configured axios instance

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [announcementsRes, submissionsRes] = await Promise.all([
        api.get('/announcements/'),
        api.get('/submissions/')  // Updated endpoint
      ]);
      setAnnouncements(announcementsRes.data);
      setSubmissions(submissionsRes.data);
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/submissions/', newSubmission);  // Updated endpoint
      toast.success('HLP reflection submitted successfully!');
      setNewSubmission({ title: '', content: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to submit reflection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Student Dashboard</h1>
      
      {/* New HLP Submission Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Submit HLP Reflection</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              className="w-full px-4 py-2 rounded-lg border"
              value={newSubmission.title}
              onChange={(e) => setNewSubmission({...newSubmission, title: e.target.value})}
            />
          </div>
          <div>
            <textarea
              placeholder="Your reflection..."
              className="w-full px-4 py-2 rounded-lg border h-32"
              value={newSubmission.content}
              onChange={(e) => setNewSubmission({...newSubmission, content: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit Reflection
          </button>
        </form>
      </motion.div>

      {/* Past Submissions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Past Submissions</h2>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold">{submission.title}</h3>
              <p className="text-gray-600 mt-2">{submission.content}</p>
              {submission.feedback && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Teacher Feedback:</h4>
                  <p>{submission.feedback}</p>
                </div>
              )}
              <div className="mt-2 text-sm text-gray-500">
                Status: <span className="font-semibold">{submission.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Announcements</h2>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold">{announcement.title}</h3>
              <p className="text-gray-600 mt-2">{announcement.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted by: {announcement.author.username}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;