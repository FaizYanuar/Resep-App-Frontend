import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    // Use a <nav> tag for semantic HTML
    <nav className='bg-[#fdfaf5] border-b border-[#d3c1a5] shadow-sm sticky top-0 z-40'>
      <div className='container mx-auto flex justify-between items-center p-4'>
        {/* Site Title / Brand */}
        <div>
          <Link href="/">
            {/* Using font-serif and our theme's text color */}
            <h1 className='font-serif font-bold text-3xl text-[#5a463a] cursor-pointer'>
              Buku Resep
            </h1>
          </Link>
        </div>

        {/* Navigation Buttons */}
        <div className='flex items-center gap-x-4'>
          {/* Log in Button (Secondary Action) */}
          <Link href="/login">
            <button className='border border-[#8c6d52] text-[#8c6d52] px-5 py-2 rounded-lg hover:bg-[#f8f2e9] transition-colors duration-300 font-semibold'>
              Log in
            </button>
          </Link>
          
          {/* Sign Up Button (Primary Action) */}
          <Link href="/signup">
            <button className='bg-[#8c6d52] text-white px-5 py-2 rounded-lg hover:bg-[#735a45] transition-colors duration-300 font-semibold shadow-sm'>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar