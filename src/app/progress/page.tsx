"use client";
import React from 'react';
import BottomNav from '@/components/BottomNav';

const ProgressPage: React.FC = () => {
  return (
    <div className="bg-brand-dark text-white min-h-screen flex flex-col">
      <header className="p-4">
        <h1 className="text-2xl font-bold">التقدم</h1>
      </header>

      <main className="flex-grow p-4">
        <div className="flex justify-center items-center h-full">
          <p className="text-brand-green-text">سيتم عرض تتبع التقدم والتحليلات هنا.</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProgressPage;