"use client";
import React from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import BottomNav from '@/components/BottomNav';

const PlansPage: React.FC = () => {
  const workoutPlans = useLiveQuery(() => db.workoutPlans.toArray());

  return (
    <div className="bg-brand-dark text-white min-h-screen flex flex-col">
      <header className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">الخطط التدريبية</h1>
          <Link href="/create-plan">
            <span className="bg-brand-green-accent text-brand-dark font-bold py-2 px-4 rounded-full cursor-pointer">
              + خطة جديدة
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-grow p-4 space-y-4">
        {workoutPlans?.map(plan => (
          <div key={plan.id} className="bg-brand-green-medium rounded-lg p-4">
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-brand-green-text mt-1">{plan.description}</p>
            <div className="mt-4">
              <Link href={`/workout/${plan.id}`}>
                <span className="text-brand-green-accent font-semibold cursor-pointer">
                  بدء التمرين &rarr;
                </span>
              </Link>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default PlansPage;