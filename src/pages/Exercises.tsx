import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];

const Exercises: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('Chest');

  const allExercises = useLiveQuery(() => db.exercises.toArray(), []);

  const filteredExercises = useMemo(() => {
    if (!allExercises) return [];
    return allExercises.filter(exercise => {
      const matchesCategory = activeCategory === 'All' || exercise.category === activeCategory;
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allExercises, activeCategory, searchTerm]);

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim()) return;

    try {
      await db.exercises.add({
        name: newExerciseName,
        category: newExerciseCategory,
      });
      // Reset form and close modal
      setNewExerciseName('');
      setNewExerciseCategory('Chest');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  return (
    <>
      <div className="flex h-screen flex-col">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-bold">Exercises</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-primary/20 dark:text-gray-300 dark:hover:bg-primary/30">
              <span className="material-symbols-outlined"> add </span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="p-4">
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"> search </span>
              <input
                className="w-full rounded-lg border-transparent bg-background-light/80 dark:bg-background-dark/80 py-2 pl-10 pr-4 text-gray-800 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary dark:text-gray-200"
                placeholder="Search exercises"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="px-4 pb-2 pt-2">
            <h2 className="text-lg font-bold">Categories</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-background-light/80 text-gray-600 hover:bg-primary/20 dark:bg-background-dark/80 dark:text-gray-300 dark:hover:bg-primary/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="px-4 pb-2 pt-4">
            <h2 className="text-lg font-bold">Exercises</h2>
          </div>
          <div className="flex flex-col">
            {filteredExercises?.map((exercise) => (
              <a key={exercise.id} className="flex items-center gap-4 px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20" href="#">
                <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-cover bg-center bg-gray-200 dark:bg-gray-700" style={{ backgroundImage: exercise.image ? `url("${exercise.image}")` : undefined }}></div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-100">{exercise.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{exercise.category}</p>
                </div>
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500"> chevron_right </span>
              </a>
            ))}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-background-light dark:bg-background-dark p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Exercise</h2>
            <form onSubmit={handleAddExercise}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="exercise-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exercise Name</label>
                  <input
                    type="text"
                    id="exercise-name"
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-3 focus:ring-primary"
                    placeholder="e.g., Dumbbell Flys"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="exercise-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    id="exercise-category"
                    value={newExerciseCategory}
                    onChange={(e) => setNewExerciseCategory(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-3 focus:ring-primary"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Exercises;