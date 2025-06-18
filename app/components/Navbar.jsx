import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <div className='bg-blue-100 justify-between flex p-5'>
        <div>
            <h1 className='font-bold text-2xl'>Buku Resep</h1>
        </div>
        <div className='gap-x-2 flex '>
            <Link href="">
                <button className='bg-blue-500 text-white px-5 py-2 rounded-xl hover:cursor-pointer '>Sign Up</button>
            </Link>
            <Link href="">
                <button className='border border-blue-500 px-5 py-2 rounded-xl hover:cursor-pointer '>Log in</button>
            </Link>
        </div>
    </div>
  )
}

export default Navbar