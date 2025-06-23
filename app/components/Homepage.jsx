"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeModal from '../components/RecipeModal'; 
import AddRecipeModal from '../components/AddRecipeModal';
import { useAuth } from '../context/AuthContext';

function Homepage() {
  const { user, isAuthenticated } = useAuth();
  const [resep, setResep] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadResep();
  }, []);

  // This is the single, corrected version of the loadResep function
  const loadResep = async () => {
    setLoading(true); 
    try {
      const result = await axios.get("http://localhost:8080/api/recipes");
      
      // Defensive coding: Ensure we have an array and filter out any invalid data
      if (Array.isArray(result.data)) {
        const validRecipes = result.data.filter(recipe => 
          recipe.imageUrl && (recipe.imageUrl.startsWith('http') || recipe.imageUrl.startsWith('/'))
        );
        setResep(validRecipes);
      } else {
        setResep([]);
      }

    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setError("Gagal memuat resep. Pastikan server API berjalan.");
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Handlers ---
  const handleOpenViewModal = (recipe) => setSelectedRecipe(recipe);
  const handleCloseViewModal = () => setSelectedRecipe(null);
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  
  // This function is passed down to modals to refresh the recipe list
  const handleRecipeUpdated = () => {
    loadResep(); 
  };

  if (loading && !resep.length) {
    return <div className='min-h-screen bg-[#fdfaf5] flex justify-center items-center font-serif text-2xl text-[#5a463a]'>Loading recipes...</div>;
  }
  if (error) {
    return <div className='min-h-screen bg-[#fdfaf5] flex justify-center items-center font-serif text-2xl text-red-700'>{error}</div>;
  }

  return (
    <div className='min-h-screen bg-[#fdfaf5] py-10'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-12 gap-y-4'>
            <div className="text-center md:text-left">
                {isAuthenticated && (
                    <p className="text-xl text-[#7a6a5d] mb-2">Welcome back, {user?.username || 'friend'}!</p>
                )}
                <h1 className='text-5xl md:text-6xl font-serif text-[#5a463a]'>
                    Recipe Collection
                </h1>
            </div>
            {isAuthenticated && (
                <button 
                    onClick={handleOpenAddModal}
                    className='flex items-center gap-x-2 bg-[#8c6d52] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-[#735a45] transition-all duration-300 transform hover:scale-105'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Recipe</span>
                </button>
            )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8'>
          {resep.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleOpenViewModal(recipe)}
              className='group bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1'
            >
              <div className='w-full'>
                <Image
                  src={recipe.imageUrl}
                  width={300}
                  height={200}
                  alt={recipe.name}
                  className='rounded-t-lg w-full h-48 object-cover'
                />
                <div className='p-5'>
                  <h2 className='text-xl font-serif font-bold text-gray-800 truncate group-hover:text-[#8c6d52] transition-colors'>
                    {recipe.name}
                  </h2>
                  <p className='text-sm text-gray-600 mt-2 h-10 overflow-hidden'>
                    {recipe.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={handleCloseViewModal} onRecipeUpdated={handleRecipeUpdated} />}
      {isAddModalOpen && <AddRecipeModal onClose={handleCloseAddModal} onRecipeAdded={handleRecipeUpdated} />}
    </div>
  );
}
export default Homepage;
