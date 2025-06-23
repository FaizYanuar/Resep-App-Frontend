// components/RecipeModal.js
"use client";

import Image from 'next/image';
import React from 'react';

// A simple 'X' icon for the close button
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  // This stops the modal from closing when you click inside the content area
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // The Modal Backdrop
    <div
      onClick={onClose}
      className='fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 transition-opacity duration-300'
    >
      {/* The Modal Content - styled like a page in a cookbook */}
      <div
        onClick={handleContentClick}
        className='relative bg-[#fdfaf5] text-[#5a463a] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 hover:scale-100 transition-transform duration-300 font-serif'
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-[#8c6d52] hover:text-[#5a463a] transition-colors z-10'
        >
          <CloseIcon />
        </button>

        {/* Recipe Image */}
        <div className='w-full h-64 relative'>
           <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            layout='fill'
            objectFit='cover'
            className='rounded-t-lg'
          />
        </div>

        <div className='p-8 md:p-10'>
          {/* Recipe Title */}
          <h1 className='text-4xl md:text-5xl font-bold mb-4 text-center'>
            {recipe.name}
          </h1>

          {/* Decorative Divider */}
          <div className='w-24 h-px bg-[#d3c1a5] mx-auto my-6'></div>
          
          {/* Ingredients Section */}
          <h2 className='text-2xl font-semibold mb-4'>Ingredients</h2>
          <ul className='list-none space-y-2 text-lg text-gray-700'>
            {recipe.ingredients.map((ingredient) => (
                // Use the unique ID for the key, which is best practice
                <li key={ingredient.id} className='flex items-start'>
                <span className='mr-3 mt-1 text-[#8c6d52]'>&ndash;</span>
                {/* Combine quantity and name into a single string to display */}
                <span>{`${ingredient.quantity} ${ingredient.name}`}</span>
                </li>
            ))}
            </ul>
          
          {/* External Link Section */}
          <div className='text-center mt-10'>
            <a
              href={recipe.referenceLink}
              target="_blank"
              rel="noopener noreferrer"
              className='inline-block bg-[#8c6d52] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#735a45] transition-all duration-300 transform hover:scale-105'
            >
              See Full Recipe & Instructions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeModal;