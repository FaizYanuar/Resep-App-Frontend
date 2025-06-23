"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirection
import axios from 'axios'; // To make API requests

// The component should be a default export.
// Naming it SignUpPage is a good convention for page files.
export default function SignUpPage() {
  const router = useRouter();

  // State to hold form data
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State for loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes and update state
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!user.username || !user.email || !user.password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      // NOTE: You will need to create this API endpoint on your Spring Boot backend.
      // Example: POST /api/auth/register
      await axios.post('http://localhost:8080/api/auth/register', user);
      
      // On success, redirect to the sign-in page
      router.push('/sign-in');

    } catch (err) {
      console.error(err);
      // Display a user-friendly error message
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
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
            Join Our Culinary Community
          </h1>
          <p className="text-base mt-6 text-[#7a6a5d] leading-relaxed">
            Create an account to save your favorite recipes, share your own creations, and become part of our family of food lovers.
          </p>
          <p className="text-base mt-8 text-[#7a6a5d]">
            Already have an account? 
            <Link href="/sign-in" className="text-[#8c6d52] font-bold hover:underline ml-2">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Right Side: Registration Form */}
        <div className="bg-white/50 border border-[#d3c1a5] rounded-lg shadow-xl p-8 lg:p-12 w-full">
          <form onSubmit={handleSubmit}>
            <h2 className="text-[#5a463a] text-3xl font-bold mb-8">
              Create Account
            </h2>

            <div className="space-y-6">
              <div>
                <label className='text-sm text-[#5a463a] font-semibold mb-2 block'>Username</label>
                <input 
                  name="username" 
                  type="text" 
                  required 
                  value={user.username}
                  onChange={handleChange}
                  className="bg-white w-full text-sm text-[#5a463a] px-4 py-3 rounded-md outline-none border border-[#d3c1a5] focus:border-[#8c6d52] focus:ring-1 focus:ring-[#8c6d52] transition-colors" 
                  placeholder="Choose a username" 
                />
              </div>
              <div>
                <label className='text-sm text-[#5a463a] font-semibold mb-2 block'>Email</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  value={user.email}
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
                  value={user.password}
                  onChange={handleChange}
                  className="bg-white w-full text-sm text-[#5a463a] px-4 py-3 rounded-md outline-none border border-[#d3c1a5] focus:border-[#8c6d52] focus:ring-1 focus:ring-[#8c6d52] transition-colors" 
                  placeholder="Create a password" 
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
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
