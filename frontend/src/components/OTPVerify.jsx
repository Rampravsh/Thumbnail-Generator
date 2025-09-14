import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const OTPVerify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
        <p className="text-center text-gray-600">
          An OTP has been sent to {email}. Please enter it below.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="123456"
              maxLength="6"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;
