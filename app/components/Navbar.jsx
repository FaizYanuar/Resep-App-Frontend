"use client"

import Link from 'next/link'
import React from 'react'
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth
import { useRouter } from 'next/navigation';

function Navbar() {
  const { user, logout, loading } = useAuth(); // Get user, logout function, and loading state
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/sign-in'); // Redirect to sign-in page after logout
  };

  // Render a placeholder or nothing while loading to prevent "flicker"
  if (loading) {
    return (
        <nav className='bg-[#fdfaf5] border-b border-[#d3c1a5] shadow-sm sticky top-0 z-40 h-[73px]'></nav>
    );
  }

  return (
    <nav className='bg-[#fdfaf5] border-b border-[#d3c1a5] shadow-sm sticky top-0 z-40'>
      <div className='container mx-auto flex justify-between items-center p-4'>
        <div>
          <Link href="/">
            <h1 className='font-serif font-bold text-3xl text-[#5a463a] cursor-pointer'>
              Buku Resep
            </h1>
          </Link>
        </div>

        {/* Dynamic Buttons */}
        <div className='flex items-center gap-x-4'>
          {user ? (
            // If user is logged in
            <>
              <button 
                onClick={handleLogout}
                className='border border-[#8c6d52] text-[#8c6d52] px-5 py-2 rounded-lg hover:bg-[#f8f2e9] transition-colors duration-300 font-semibold'
              >
                Log Out
              </button>
            </>
          ) : (
            // If user is logged out
            <>
              <Link href="/sign-in">
                <button className='border border-[#8c6d52] text-[#8c6d52] px-5 py-2 rounded-lg hover:bg-[#f8f2e9] transition-colors duration-300 font-semibold'>
                  Log In
                </button>
              </Link>
              <Link href="/sign-up">
                <button className='bg-[#8c6d52] text-white px-5 py-2 rounded-lg hover:bg-[#735a45] transition-colors duration-300 font-semibold shadow-sm'>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
