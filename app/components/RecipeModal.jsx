// components/RecipeModal.js
"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Or your correct path

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

function RecipeModal({ recipe, onClose, onRecipeUpdated }) {
    if (!recipe) return null;

    const { user, isAuthenticated } = useAuth();
    
    // The admin check is hardcoded to the user with an ID of 4.
    const isAdmin = isAuthenticated && user?.id === 4;

    const [isEditing, setIsEditing] = useState(false);
    const [editableRecipe, setEditableRecipe] = useState(recipe);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setEditableRecipe(recipe);
        setIsEditing(false);
        setShowDeleteConfirm(false);
        setError('');
    }, [recipe]);

    const handleContentClick = (e) => e.stopPropagation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableRecipe(prev => ({ ...prev, [name]: value }));
    };
    
    const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const ingredients = [...editableRecipe.ingredients];
        ingredients[index] = { ...ingredients[index], [name]: value };
        setEditableRecipe(prev => ({ ...prev, ingredients }));
    };

    const handleAddIngredient = () => {
        setEditableRecipe(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', quantity: '' }]
        }));
    };

    const handleRemoveIngredient = (index) => {
        const ingredients = [...editableRecipe.ingredients];
        ingredients.splice(index, 1);
        setEditableRecipe(prev => ({ ...prev, ingredients }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        try {
            await axios.put(`http://localhost:8080/api/recipes/${editableRecipe.id}`, editableRecipe);
            onRecipeUpdated();
            onClose();
        } catch (err) {
            console.error("Failed to update recipe:", err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setError('');
        try {
            await axios.delete(`http://localhost:8080/api/recipes/${recipe.id}`);
            onRecipeUpdated();
            onClose();
        } catch (err) {
            console.error("Failed to delete recipe:", err);
            setError("Failed to delete recipe. Please try again.");
            setShowDeleteConfirm(false); 
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div onClick={onClose} className='fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4'>
            <div onClick={handleContentClick} className='relative bg-[#fdfaf5] text-[#5a463a] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300 font-serif'>
                
                {!showDeleteConfirm && (
                    <button onClick={onClose} className='absolute top-4 right-4 text-[#8c6d52] hover:text-[#5a463a] transition-colors z-20'>
                        <CloseIcon />
                    </button>
                )}
                
                {isEditing ? (
                    <div className='p-8 md:p-10'>
                        <h1 className='text-3xl font-bold mb-6'>Edit Recipe</h1>
                        <div className='space-y-4 text-base'>
                            <div>
                                <label className='font-semibold block mb-1'>Name</label>
                                <input type="text" name="name" value={editableRecipe.name} onChange={handleInputChange} className='w-full p-2 rounded-md bg-white border border-[#d3c1a5]'/>
                            </div>
                            <div>
                                <label className='font-semibold block mb-1'>Description</label>
                                <textarea name="description" value={editableRecipe.description} onChange={handleInputChange} className='w-full p-2 rounded-md bg-white border border-[#d3c1a5]' rows="4"></textarea>
                            </div>
                            <div>
                                <label className='font-semibold block mb-1'>Image URL</label>
                                <input type="text" name="imageUrl" value={editableRecipe.imageUrl} onChange={handleInputChange} className='w-full p-2 rounded-md bg-white border border-[#d3c1a5]'/>
                            </div>
                            <div>
                                <label className='font-semibold block mb-1'>Reference Link</label>
                                <input type="text" name="referenceLink" value={editableRecipe.referenceLink} onChange={handleInputChange} className='w-full p-2 rounded-md bg-white border border-[#d3c1a5]'/>
                            </div>
                            <h2 className='text-2xl font-semibold pt-4 mb-2'>Ingredients</h2>
                            <div className='space-y-2'>
                                {editableRecipe.ingredients.map((ing, index) => (
                                    <div key={index} className='flex items-center gap-x-2'>
                                        <input type="text" name="quantity" placeholder="Qty" value={ing.quantity} onChange={e => handleIngredientChange(index, e)} className='w-1/3 p-2 rounded-md bg-white border border-[#d3c1a5]'/>
                                        <input type="text" name="name" placeholder="Name" value={ing.name} onChange={e => handleIngredientChange(index, e)} className='flex-grow p-2 rounded-md bg-white border border-[#d3c1a5]'/>
                                        <button onClick={() => handleRemoveIngredient(index)} className='bg-red-200 text-red-700 p-2 rounded-md'>Remove</button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleAddIngredient} className='w-full text-center border-2 border-dashed border-[#d3c1a5] text-[#8c6d52] py-2 mt-2 rounded-lg'>+ Add Ingredient</button>
                        </div>
                         {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
                        <div className='flex justify-end items-center gap-x-4 mt-8'>
                            <button onClick={() => setIsEditing(false)} className='border border-[#8c6d52] text-[#8c6d52] font-bold py-2 px-6 rounded-full'>Cancel</button>
                            <button onClick={handleSave} disabled={isSaving} className='bg-[#8c6d52] text-white font-bold py-2 px-6 rounded-full shadow-lg disabled:bg-gray-400'>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='w-full h-64 relative'>
                            <Image src={recipe.imageUrl} alt={recipe.name} layout='fill' objectFit='cover' className='rounded-t-lg'/>
                        </div>
                        <div className='p-8 md:p-10'>
                            <h1 className='text-4xl md:text-5xl font-bold mb-4 text-center'>{recipe.name}</h1>
                            {/* --- THIS IS THE NEW DESCRIPTION --- */}
                            <p className='text-center text-gray-600 mt-2 mb-6 text-base leading-relaxed'>{recipe.description}</p>
                            <div className='w-24 h-px bg-[#d3c1a5] mx-auto my-6'></div>
                            <h2 className='text-2xl font-semibold mb-4'>Ingredients</h2>
                            <ul className='list-none space-y-2 text-lg text-gray-700'>
                                {recipe.ingredients.map((ingredient) => (
                                    <li key={ingredient.id} className='flex items-start'>
                                        <span className='mr-3 mt-1 text-[#8c6d52]'>&ndash;</span>
                                        <span>{`${ingredient.quantity} ${ingredient.name}`}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className='flex flex-wrap justify-center items-center gap-4 mt-10'>
                                <a href={recipe.referenceLink} target="_blank" rel="noopener noreferrer" className='inline-block bg-[#8c6d52] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#735a45]'>
                                    See Full Recipe
                                </a>
                                {isAuthenticated && (
                                    <button onClick={() => setIsEditing(true)} className='border border-[#8c6d52] text-[#8c6d52] font-bold py-3 px-8 rounded-full hover:bg-[#f8f2e9]'>
                                        Edit Recipe
                                    </button>
                                )}
                                {isAdmin && (
                                    <button onClick={() => setShowDeleteConfirm(true)} className='bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700'>
                                        Delete Recipe
                                    </button>
                                )}
                            </div>
                            {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
                        </div>
                    </>
                )}

                {showDeleteConfirm && (
                    <div className='absolute inset-0 bg-[#fdfaf5] bg-opacity-95 flex flex-col justify-center items-center p-8 rounded-lg'>
                        <h2 className='text-2xl font-bold text-center mb-4'>Are you sure?</h2>
                        <p className='text-center mb-8'>This action cannot be undone. All data for this recipe will be permanently deleted.</p>
                        <div className='flex justify-center gap-x-4'>
                            <button onClick={() => setShowDeleteConfirm(false)} className='border border-gray-400 text-gray-700 font-bold py-2 px-8 rounded-full'>
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={isDeleting} className='bg-red-600 text-white font-bold py-2 px-8 rounded-full disabled:bg-red-400'>
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipeModal;
