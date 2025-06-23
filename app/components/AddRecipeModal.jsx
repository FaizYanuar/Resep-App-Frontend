// components/AddRecipeModal.js
"use client";

import React, { useState } from 'react';
import axios from 'axios';

// A simple 'X' icon for the close button
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function AddRecipeModal({ onClose, onRecipeAdded }) {
  // State for the main recipe details
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [referenceLink, setReferenceLink] = useState('');

  // State for the list of ingredients
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);

  // State for loading and error messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- Ingredient Handlers ---

  // Handles changes in ingredient input fields
  const handleIngredientChange = (index, event) => {
    const values = [...ingredients];
    values[index][event.target.name] = event.target.value;
    setIngredients(values);
  };

  // Adds a new empty ingredient field
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  // Removes an ingredient field by its index
  const handleRemoveIngredient = (index) => {
    const values = [...ingredients];
    if (values.length > 1) { // Prevent removing the last field
      values.splice(index, 1);
      setIngredients(values);
    }
  };

  // --- Form Submission ---

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic validation
    if (!recipeName || !description || !imageUrl || ingredients.some(i => !i.name || !i.quantity)) {
      setError("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }

    const newRecipe = {
      name: recipeName,
      description,
      imageUrl,
      referenceLink,
      // Filter out any empty ingredients the user might have left
      ingredients: ingredients.filter(i => i.name && i.quantity),
    };

    try {
      const result = await axios.post("http://localhost:8080/api/recipes", newRecipe);
      if (result.status === 200 || result.status === 201) {
        onRecipeAdded(); // Callback to refresh the homepage list
        onClose();       // Close the modal
      }
    } catch (err) {
      console.error("Failed to add recipe:", err);
      setError("Failed to add recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevents closing the modal when clicking inside
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4'
    >
      <div
        onClick={handleContentClick}
        className='relative bg-[#fdfaf5] text-[#5a463a] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto font-serif'
      >
        <form onSubmit={handleSubmit} className='p-8 md:p-10'>
          {/* Header and Close Button */}
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl md:text-4xl font-bold'>Add a New Recipe</h1>
            <button type="button" onClick={onClose} className='text-[#8c6d52] hover:text-[#5a463a]'>
              <CloseIcon />
            </button>
          </div>
          
          {/* Main Recipe Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <input type="text" placeholder="Recipe Name" value={recipeName} onChange={e => setRecipeName(e.target.value)} className='w-full p-3 rounded-md bg-white border border-[#d3c1a5] focus:outline-none focus:ring-2 focus:ring-[#8c6d52]' required />
            <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className='w-full p-3 rounded-md bg-white border border-[#d3c1a5] focus:outline-none focus:ring-2 focus:ring-[#8c6d52]' required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className='w-full p-3 rounded-md bg-white border border-[#d3c1a5] md:col-span-2' rows="3" required></textarea>
            <input type="text" placeholder="Reference Link (Optional)" value={referenceLink} onChange={e => setReferenceLink(e.target.value)} className='w-full p-3 rounded-md bg-white border border-[#d3c1a5] md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#8c6d52]' />
          </div>

          {/* Ingredients Section */}
          <h2 className='text-2xl font-semibold mb-4'>Ingredients</h2>
          <div className='space-y-3 mb-6'>
            {ingredients.map((ingredient, index) => (
              <div key={index} className='flex items-center gap-x-3'>
                <input type="text" name="quantity" placeholder="Quantity (e.g., 200g)" value={ingredient.quantity} onChange={e => handleIngredientChange(index, e)} className='w-1/3 p-3 rounded-md bg-white border border-[#d3c1a5]' required />
                <input type="text" name="name" placeholder="Ingredient Name" value={ingredient.name} onChange={e => handleIngredientChange(index, e)} className='flex-grow p-3 rounded-md bg-white border border-[#d3c1a5]' required />
                <button type="button" onClick={() => handleRemoveIngredient(index)} className='bg-red-200 text-red-700 px-3 py-3 rounded-md hover:bg-red-300'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddIngredient} className='w-full text-center border-2 border-dashed border-[#d3c1a5] text-[#8c6d52] py-3 rounded-lg hover:bg-[#f8f2e9] transition-colors'>
            + Add Another Ingredient
          </button>

          {/* Submission and Error Area */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <div className='text-center mt-8'>
            <button type="submit" disabled={isSubmitting} className='bg-[#8c6d52] text-white font-bold py-3 px-12 rounded-full shadow-lg hover:bg-[#735a45] transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed'>
              {isSubmitting ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecipeModal;
