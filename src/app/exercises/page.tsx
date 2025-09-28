"use client";
import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

const categories = ['الكل', 'صدر', 'ظهر', 'أرجل', 'أكتاف', 'أذرع'];

const ExercisesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('صدر');

  const allExercises = useLiveQuery(() => db.exercises.toArray(), []);

  const filteredExercises = useMemo(() => {
    if (!allExercises) return [];
    return allExercises.filter(exercise => {
      const matchesCategory = activeCategory === 'الكل' || exercise.category === activeCategory;
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
        primaryMuscles: [],
      });
      setNewExerciseName('');
      setNewExerciseCategory('صدر');
      setIsModalOpen(false);
    } catch (error) {
      console.error("فشل إضافة التمرين:", error);
    }
  };

  return (
    <>
      <div className="bg-brand-dark text-white min-h-screen flex flex-col">
        <header className="p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مكتبة التمارين</h1>
            <button onClick={() => setIsModalOpen(true)} className="bg-brand-green-accent text-brand-dark font-bold py-2 px-4 rounded-full">
              + إضافة تمرين
            </button>
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="ابحث عن تمرين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-brand-green-medium border-none text-white placeholder-brand-green-text focus:ring-1 focus:ring-brand-green-accent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto py-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  activeCategory === category
                    ? 'bg-brand-green-accent text-brand-dark'
                    : 'bg-brand-green-medium text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-grow px-4 space-y-2">
          {filteredExercises?.map((exercise) => (
            <Link key={exercise.id} href={`/exercise/${exercise.id}`} className="block">
              <div className="flex items-center gap-4 p-3 bg-brand-green-medium rounded-lg">
                <div className="w-16 h-16 bg-brand-green-light rounded-md flex-shrink-0">
                  {/* Placeholder for image */}
                </div>
                <div className="flex-grow">
                  <p className="font-bold">{exercise.name}</p>
                  <p className="text-sm text-brand-green-text">{exercise.category}</p>
                </div>
                <span className="text-brand-green-text">&larr;</span>
              </div>
            </Link>
          ))}
        </main>
        <BottomNav />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-brand-dark p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">إضافة تمرين جديد</h2>
            <form onSubmit={handleAddExercise}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="اسم التمرين"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-brand-green-medium border-none text-white placeholder-brand-green-text"
                  required
                />
                <select
                  value={newExerciseCategory}
                  onChange={(e) => setNewExerciseCategory(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-brand-green-medium border-none text-white"
                >
                  {categories.filter(c => c !== 'الكل').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-lg bg-brand-green-medium text-white">
                  إلغاء
                </button>
                <button type="submit" className="py-2 px-4 rounded-lg bg-brand-green-accent text-brand-dark font-bold">
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ExercisesPage;