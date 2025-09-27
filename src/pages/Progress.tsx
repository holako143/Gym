import React from 'react';

const Progress: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between">
      <div className="flex-grow">
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
          <div className="flex items-center p-4">
            <button className="flex size-10 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-gray-300">
              <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
            <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white pr-10">Progress</h1>
          </div>
        </header>
        <main className="p-4 space-y-8">
          <section>
            <h2 className="text-2xl font-bold px-2 mb-4 text-gray-900 dark:text-white">Muscle Volume</h2>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Volume</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">12,500 lbs</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-500">+15%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 Days</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 items-end h-48 mt-6 text-center">
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '80%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">W1</p>
                </div>
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '90%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">W2</p>
                </div>
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '20%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">W3</p>
                </div>
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '30%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">W4</p>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold px-2 mb-4 text-gray-900 dark:text-white">Strength Progression</h2>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Max Lift</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">225 lbs</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-500">+10%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last 3 Months</p>
                </div>
              </div>
              <div className="h-48 mt-6">
                <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#strength-gradient)"></path>
                  <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#0d7ff2" strokeLinecap="round" strokeWidth="3"></path>
                  <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="strength-gradient" x1="236" x2="236" y1="1" y2="149">
                      <stop stopColor="#0d7ff2" stopOpacity="0.3"></stop>
                      <stop offset="1" stopColor="#0d7ff2" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-around mt-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Jan</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Feb</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Mar</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold px-2 mb-4 text-gray-900 dark:text-white">Muscle Frequency</h2>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Workouts per Group</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">3 avg</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-500">+5%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 Days</p>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 mt-6 items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chest</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: '90%' }}></div></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Back</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: '100%' }}></div></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Legs</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: '10%' }}></div></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shoulders</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Arms</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: '90%' }}></div></div>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold px-2 mb-4 text-gray-900 dark:text-white">Work-to-Rest Ratio</h2>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Ratio</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">1:2</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-500">-5%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last 7 Days</p>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-3 items-end h-48 mt-6 text-center">
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '80%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Mon</p>
                </div>
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '70%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Tue</p>
                </div>
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '100%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Wed</p>
                </div>
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '50%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Thu</p>
                </div>
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '100%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Fri</p>
                </div>
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '60%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Sat</p>
                </div>
                <div className="flex flex-col items-center h-full justify-end gap-2">
                  <div className="w-full bg-primary/20 dark:bg-primary/30 rounded-t" style={{ height: '10%' }}></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Sun</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Progress;