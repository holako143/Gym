"use client";
import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';

const SessionSummary: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId;

  const session = useLiveQuery(() => db.sessions.get(Number(sessionId)), [sessionId]);

  const stats = useMemo(() => {
    if (!session) return null;
    let totalVolume = 0;
    let totalSets = 0;
    const completedExercises = session.completedExercises.length;
    session.completedExercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        totalVolume += (set.weight || 0) * (set.reps || 0);
        totalSets++;
      });
    });
    return {
      duration: session.duration,
      totalVolume,
      totalSets,
      completedExercises,
    };
  }, [session]);

  if (!session || !stats) {
    return (
      <div className="bg-brand-dark text-white min-h-screen flex justify-center items-center">
        <p>جاري تحميل ملخص الجلسة...</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark text-white min-h-screen p-4 flex flex-col items-center justify-center text-center">
      <div className="bg-brand-green-medium p-6 rounded-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-2">الجلسة مكتملة!</h1>
        <p className="text-brand-green-text mb-6">أداء رائع، إليك ملخص جلستك.</p>

        <div className="space-y-3 text-right">
          <div className="flex justify-between items-baseline p-3 bg-brand-green-dark rounded-md">
            <span>المدة الإجمالية</span>
            <span className="font-bold text-lg">{stats.duration} دقيقة</span>
          </div>
          <div className="flex justify-between items-baseline p-3 bg-brand-green-dark rounded-md">
            <span>الحجم التدريبي الكلي</span>
            <span className="font-bold text-lg">{stats.totalVolume} رطل</span>
          </div>
          <div className="flex justify-between items-baseline p-3 bg-brand-green-dark rounded-md">
            <span>مجموع المجموعات</span>
            <span className="font-bold text-lg">{stats.totalSets}</span>
          </div>
          <div className="flex justify-between items-baseline p-3 bg-brand-green-dark rounded-md">
            <span>التمارين المكتملة</span>
            <span className="font-bold text-lg">{stats.completedExercises}</span>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.push('/plans')}
            className="w-full py-3 rounded-lg bg-brand-green-accent text-brand-dark font-bold"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;