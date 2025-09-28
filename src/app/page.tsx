"use client";
import React from 'react';
import BottomNav from '@/components/BottomNav';

const DashboardPage: React.FC = () => {
  return (
    <div className="bg-brand-dark text-white min-h-screen flex flex-col justify-between">
      <div>
        <header className="p-4">
          <h1 className="text-2xl font-bold">لوحة القيادة</h1>
        </header>

        <main className="p-4">
          <div className="text-center py-20">
            <p className="text-brand-green-text">سيتم عرض إحصائياتك ونظرة عامة على تقدمك هنا.</p>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;