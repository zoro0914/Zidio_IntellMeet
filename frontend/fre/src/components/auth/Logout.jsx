import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Utils/api';

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      // Call logout API
      await api.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Redirect to login
      navigate('/login');
      alert('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, clear local data and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login');
      
      alert(error.response?.data?.message || 'Logged out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-violet-50 to-slate-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Logout
        </h2>
        <p className="text-slate-600 mb-8">
          Are you sure you want to logout from your account?
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            disabled={loading}
            className="px-6 py-2 bg-slate-300 text-gray-800 rounded-lg font-semibold hover:bg-slate-400 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
