"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type WorkoutPlan, type PlanExercise } from '@/db';

interface DisplayExercise extends PlanExercise {
    name: string;
}

interface PlanDay {
  day: number;
  exerciseGroups: DisplayExercise[][];
}

const CreatePlan: React.FC = () => {
  const router = useRouter();
  const allExercises = useLiveQuery(() => db.exercises.toArray());

  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [days, setDays] = useState<PlanDay[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);

  const addDay = () => setDays([...days, { day: days.length + 1, exerciseGroups: [] }]);
  const removeDay = (dayIndex: number) => setDays(days.filter((_, i) => i !== dayIndex).map((d, i) => ({ ...d, day: i + 1 })));

  const openExerciseDialog = (dayIndex: number) => {
    setCurrentDayIndex(dayIndex);
    setSelectedExercises([]);
    setIsDialogOpen(true);
  };

  const handleToggleExercise = (exerciseId: number) => {
    setSelectedExercises(prev => prev.includes(exerciseId) ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]);
  };

  const addExercisesToDay = () => {
    if (currentDayIndex === null) return;
    const newExerciseGroups: DisplayExercise[][] = selectedExercises.map(id => {
        const details = allExercises?.find(ex => ex.id === id);
        return [{ exerciseId: id, name: details?.name || 'تمرين غير معروف', sets: 3, reps: '8-12', rest: 60 }];
    });
    const newDays = [...days];
    newDays[currentDayIndex].exerciseGroups.push(...newExerciseGroups);
    setDays(newDays);
    setIsDialogOpen(false);
  };

  const handleExerciseDetailChange = (dIdx: number, gIdx: number, eIdx: number, field: keyof PlanExercise, value: string | number) => {
    const newDays = JSON.parse(JSON.stringify(days));
    (newDays[dIdx].exerciseGroups[gIdx][eIdx][field] as any) = value;
    setDays(newDays);
  };

  const removeExerciseGroup = (dayIndex: number, groupIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exerciseGroups.splice(groupIndex, 1);
    setDays(newDays);
  };

  const handleSuperset = (dayIndex: number, groupIndex: number) => {
    const newDays = [...days];
    const currentGroup = newDays[dayIndex].exerciseGroups[groupIndex];
    const nextGroup = newDays[dayIndex].exerciseGroups[groupIndex + 1];
    if (!nextGroup) return;
    currentGroup.push(...nextGroup);
    currentGroup.forEach((ex: any, idx: number) => { if(idx < currentGroup.length -1) ex.rest = 0; });
    newDays[dayIndex].exerciseGroups.splice(groupIndex + 1, 1);
    setDays(newDays);
  };

  const handleSave = async () => {
    if (!planName.trim()) { alert('اسم الخطة مطلوب.'); return; }
    const planToSave: Omit<WorkoutPlan, 'id'> = {
        name: planName,
        description: planDescription,
        days: days.map(day => ({
            day: day.day,
            exerciseGroups: day.exerciseGroups.map((group: any[]) => group.map(({ name, ...rest }) => rest))
        }))
    };
    try {
      await db.workoutPlans.add(planToSave);
      router.push('/plans');
    } catch (error) {
      console.error("فشل حفظ الخطة:", error);
      alert("فشل حفظ الخطة.");
    }
  };

  return (
    <div className="bg-brand-dark text-white min-h-screen flex flex-col">
      <header className="flex items-center p-4 border-b border-brand-green-medium">
        <button onClick={() => router.back()} className="p-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        </button>
        <h1 className="text-xl font-bold flex-grow text-center">إنشاء خطة جديدة</h1>
        <button onClick={handleSave} className="p-2">حفظ</button>
      </header>
      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
        <input type="text" placeholder="اسم الخطة" value={planName} onChange={(e) => setPlanName(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-brand-green-medium border-none text-white placeholder-brand-green-text" required />
        <textarea placeholder="الوصف" value={planDescription} onChange={(e) => setPlanDescription(e.target.value)} className="w-full p-4 rounded-lg bg-brand-green-medium border-none text-white placeholder-brand-green-text" rows={3}></textarea>

        <h2 className="text-lg font-bold pt-4">أيام التمرين</h2>
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-brand-green-medium rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">اليوم {day.day}</h3>
              <button onClick={() => removeDay(dayIndex)} className="p-1 text-red-400">حذف اليوم</button>
            </div>
            {day.exerciseGroups.map((group: any[], groupIndex: number) => (
              <div key={groupIndex} className="border border-brand-green-light rounded-md p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs uppercase text-brand-green-text">{group.length > 1 ? `سوبر سيت` : 'تمرين عادي'}</span>
                    <button onClick={() => removeExerciseGroup(dayIndex, groupIndex)} className="text-xs text-red-400">إزالة</button>
                </div>
                {group.map((exercise, exIndex) => (
                  <div key={exIndex} className="mb-2">
                    <p className="font-semibold">{exercise.name}</p>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <input type="number" placeholder="مجموعات" value={exercise.sets} onChange={(e) => handleExerciseDetailChange(dayIndex, groupIndex, exIndex, 'sets', e.target.value)} className="w-full h-10 px-2 rounded bg-brand-green-dark border-none text-white" />
                      <input type="text" placeholder="تكرارات" value={exercise.reps} onChange={(e) => handleExerciseDetailChange(dayIndex, groupIndex, exIndex, 'reps', e.target.value)} className="w-full h-10 px-2 rounded bg-brand-green-dark border-none text-white" />
                      <input type="number" placeholder="راحة (ث)" value={exercise.rest} onChange={(e) => handleExerciseDetailChange(dayIndex, groupIndex, exIndex, 'rest', e.target.value)} className="w-full h-10 px-2 rounded bg-brand-green-dark border-none text-white" />
                    </div>
                  </div>
                ))}
                {group.length === 1 && groupIndex < day.exerciseGroups.length - 1 && (
                    <button onClick={() => handleSuperset(dayIndex, groupIndex)} className="text-xs text-brand-green-accent mt-2">دمج مع التالي (سوبر سيت)</button>
                )}
              </div>
            ))}
            <button onClick={() => openExerciseDialog(dayIndex)} className="w-full mt-2 py-2 text-center bg-brand-green-light rounded-lg">+ إضافة تمرين</button>
          </div>
        ))}
        <button onClick={addDay} className="w-full py-3 text-center border-2 border-dashed border-brand-green-light rounded-lg">+ إضافة يوم</button>
      </main>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-brand-dark p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">اختر التمارين</h2>
            <div className="max-h-60 overflow-y-auto">
                {allExercises?.map(exercise => (
                  <div key={exercise.id} className="flex items-center p-2 hover:bg-brand-green-medium rounded">
                    <input type="checkbox" id={`ex-${exercise.id}`} checked={selectedExercises.includes(exercise.id!)} onChange={() => handleToggleExercise(exercise.id!)} className="form-checkbox bg-brand-green-dark border-brand-green-light" />
                    <label htmlFor={`ex-${exercise.id}`} className="mr-3">{exercise.name}</label>
                  </div>
                ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsDialogOpen(false)} className="py-2 px-4 rounded-lg bg-brand-green-medium text-white">إلغاء</button>
              <button onClick={addExercisesToDay} className="py-2 px-4 rounded-lg bg-brand-green-accent text-brand-dark font-bold">إضافة المحدد</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePlan;