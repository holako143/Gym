"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';

const ExerciseDetail: React.FC = () => {
  const params = useParams();
  const exerciseId = params.exerciseId;

  const exercise = useLiveQuery(
    () => db.exercises.get(Number(exerciseId)),
    [exerciseId]
  );

  if (!exercise) {
    return (
      <div className="bg-brand-dark text-white min-h-screen flex justify-center items-center">
        <p>جاري تحميل تفاصيل التمرين...</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark text-white min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {exercise.image && (
          <img
            src={exercise.image}
            alt={exercise.name}
            className="w-full h-auto max-h-60 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{exercise.name}</h1>
        <div className="flex gap-2 mb-4">
            <span className="text-sm px-3 py-1 bg-brand-green-accent text-brand-dark rounded-full font-semibold">{exercise.category}</span>
        </div>

        <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">العضلات الأساسية</h2>
            <div className="flex flex-wrap gap-2">
                {exercise.primaryMuscles.map(muscle => (
                    <span key={muscle} className="text-sm px-3 py-1 bg-brand-green-medium rounded-full">{muscle}</span>
                ))}
            </div>
        </div>

        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
            <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">العضلات الثانوية</h2>
                <div className="flex flex-wrap gap-2">
                    {exercise.secondaryMuscles.map(muscle => (
                        <span key={muscle} className="text-sm px-3 py-1 bg-brand-green-light text-brand-dark rounded-full">{muscle}</span>
                    ))}
                </div>
            </div>
        )}

        {exercise.instructions && (
             <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">التعليمات</h2>
                <p className="text-brand-green-text whitespace-pre-wrap leading-relaxed">
                    {exercise.instructions}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetail;