"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <-- IMPORT useAuth

// The component should be a default export.
// Naming it LoginPage is a good convention for page files.
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // <-- GET THE LOGIN FUNCTION FROM CONTEXT

  // State to hold the email and password
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  // State for loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes and update state
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Both email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      
      // *** THIS IS THE CRITICAL FIX ***
      // Call the login function with the user data from the backend.
      // This will save the user to localStorage and update the global state.
      login(response.data);
      
      router.push('/'); // Redirect to homepage

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container with cookbook background color
    <div className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center p-6 font-serif">
      <div className="grid lg:grid-cols-2 items-center gap-16 max-w-6xl w-full">
        {/* Left Side: Descriptive Text */}
        <div className="text-center lg:text-left">
          <h1 className="lg:text-5xl text-4xl font-bold text-[#5a463a] !leading-tight">
            Welcome Back to Your Kitchen
          </h1>
          <p className="text-base mt-6 text-[#7a6a5d] leading-relaxed">
            Sign in to continue your culinary journey. Access your saved recipes and discover new inspiration.
          </p>
          <p className="text-base mt-8 text-[#7a6a5d]">
            Don't have an account? 
            <Link href="/sign-up" className="text-[#8c6d52] font-bold hover:underline ml-2">
              Register here
            </Link>
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="bg-white/50 border border-[#d3c1a5] rounded-lg shadow-xl p-8 lg:p-12 w-full">
          <form onSubmit={handleSubmit}>
            <h2 className="text-[#5a463a] text-3xl font-bold mb-8">
              Sign In
            </h2>

            <div className="space-y-6">
              <div>
                <label className='text-sm text-[#5a463a] font-semibold mb-2 block'>Email</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  value={credentials.email}
                  onChange={handleChange}
                  className="bg-white w-full text-sm text-[#5a463a] px-4 py-3 rounded-md outline-none border border-[#d3c1a5] focus:border-[#8c6d52] focus:ring-1 focus:ring-[#8c6d52] transition-colors" 
                  placeholder="Enter your email" 
                />
              </div>
              <div>
                <label className='text-sm text-[#5a463a] font-semibold mb-2 block'>Password</label>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  value={credentials.password}
                  onChange={handleChange}
                  className="bg-white w-full text-sm text-[#5a463a] px-4 py-3 rounded-md outline-none border border-[#d3c1a5] focus:border-[#8c6d52] focus:ring-1 focus:ring-[#8c6d52] transition-colors" 
                  placeholder="Enter your password" 
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}

            <div className="!mt-12">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full shadow-lg py-3 px-4 text-base font-bold rounded-lg text-white bg-[#8c6d52] hover:bg-[#735a45] focus:outline-none transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging In...' : 'Log In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
