"use client";
import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter } from 'next/navigation';

import { db } from '@/db';
import TimerDisplay from '@/components/ui/TimerDisplay';
import Button from '@/components/ui/Button';
import BottomNav from '@/components/BottomNav';

const ActiveWorkoutPage: React.FC = () => {
    const router = useRouter();
    const exercises = useLiveQuery(() => db.exercises.toArray());

    // Main workout timer state
    const [mainSeconds, setMainSeconds] = useState(0);
    const [isMainTimerActive, setIsMainTimerActive] = useState(false);

    // Rest timer state
    const [restSeconds, setRestSeconds] = useState(60);
    const [isRestTimerActive, setIsRestTimerActive] = useState(false);

    // Form state
    const [selectedExercise, setSelectedExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');

    // Set progress
    const [currentSet, setCurrentSet] = useState(2);
    const [totalSets, setTotalSets] = useState(4);


    // Main workout timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isMainTimerActive) {
            interval = setInterval(() => {
                setMainSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isMainTimerActive && mainSeconds !== 0) {
            if(interval) clearInterval(interval);
        }
        return () => {
            if(interval) clearInterval(interval);
        };
    }, [isMainTimerActive, mainSeconds]);

    // Rest timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRestTimerActive && restSeconds > 0) {
            interval = setInterval(() => {
                setRestSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (restSeconds === 0) {
             setIsRestTimerActive(false);
        }
        return () => {
            if(interval) clearInterval(interval);
        };
    }, [isRestTimerActive, restSeconds]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return { hours, minutes, seconds };
    };

    const mainTime = formatTime(mainSeconds);
    const restTime = formatTime(restSeconds);

    const setProgressPercentage = (currentSet / totalSets) * 100;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-brand-dark justify-between font-sans">
            <div>
                {/* Header */}
                <div className="flex items-center bg-brand-dark p-4 pb-2 justify-between">
                    <button className="text-white flex size-12 shrink-0 items-center" onClick={() => router.back()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                        </svg>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">تمرين</h2>
                </div>

                {/* Main Timer */}
                <div className="flex gap-4 py-6 px-4">
                    <TimerDisplay value={mainTime.hours} label="ساعات" />
                    <TimerDisplay value={mainTime.minutes} label="دقائق" />
                    <TimerDisplay value={mainTime.seconds} label="ثواني" />
                </div>

                {/* Exercise Form */}
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">التمرين</h2>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <label className="flex flex-col min-w-40 flex-1">
                        <select
                            value={selectedExercise}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-brand-green-medium focus:border-none h-14 bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em_1.5em] [appearance:none] placeholder:text-brand-green-text p-4 text-base font-normal leading-normal"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(150,197,169)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e\")" }}
                        >
                            <option value="">اختر تمرين</option>
                            {exercises?.map(ex => <option key={ex.id} value={ex.name}>{ex.name}</option>)}
                        </select>
                    </label>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <label className="flex flex-col min-w-40 flex-1"><p className="text-white text-base font-medium leading-normal pb-2">المجموعات</p><input type="number" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-brand-green-medium focus:border-none h-14 placeholder:text-brand-green-text p-4 text-base font-normal leading-normal" value={sets} onChange={e => setSets(e.target.value)} /></label>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <label className="flex flex-col min-w-40 flex-1"><p className="text-white text-base font-medium leading-normal pb-2">التكرارات</p><input type="number" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-brand-green-medium focus:border-none h-14 placeholder:text-brand-green-text p-4 text-base font-normal leading-normal" value={reps} onChange={e => setReps(e.target.value)} /></label>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <label className="flex flex-col min-w-40 flex-1"><p className="text-white text-base font-medium leading-normal pb-2">الوزن</p><input type="number" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-brand-green-medium focus:border-none h-14 placeholder:text-brand-green-text p-4 text-base font-normal leading-normal" value={weight} onChange={e => setWeight(e.target.value)} /></label>
                </div>

                {/* Set Progress */}
                <div className="flex flex-col gap-3 p-4">
                    <div className="flex gap-6 justify-between"><p className="text-white text-base font-medium leading-normal">المجموعة {currentSet} من {totalSets}</p></div>
                    <div className="rounded bg-brand-green-light"><div className="h-2 rounded bg-brand-green-accent" style={{ width: `${setProgressPercentage}%` }}></div></div>
                </div>

                {/* Rest Timer */}
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">مؤقت الراحة</h2>
                <div className="flex gap-4 py-6 px-4">
                    <TimerDisplay value={restTime.hours} label="ساعات" />
                    <TimerDisplay value={restTime.minutes} label="دقائق" />
                    <TimerDisplay value={restTime.seconds} label="ثواني" />
                </div>
                <div className="flex justify-stretch"><div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
                    <Button variant="secondary" onClick={() => setRestSeconds(60)}>إعادة ضبط</Button>
                    <Button variant="primary" onClick={() => setIsRestTimerActive(!isRestTimerActive)}>{isRestTimerActive ? 'إيقاف' : 'بدء'}</Button>
                </div></div>

                {/* Notes */}
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">ملاحظات</h2>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <label className="flex flex-col min-w-40 flex-1"><textarea placeholder="أضف ملاحظات حول تمرينك" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-brand-green-medium focus:border-none min-h-36 placeholder:text-brand-green-text p-4 text-base font-normal leading-normal" value={notes} onChange={e => setNotes(e.target.value)}></textarea></label>
                </div>
            </div>

            {/* Footer */}
            <div>
                <div className="flex justify-stretch">
                    <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
                        <Button variant="secondary" onClick={() => { setIsMainTimerActive(false) }}>إنهاء التمرين</Button>
                        <Button variant="primary" onClick={() => { setIsMainTimerActive(!isMainTimerActive) }}>{isMainTimerActive ? 'إيقاف التمرين' : 'بدء التمرين'}</Button>
                    </div>
                </div>
                <BottomNav />
            </div>
        </div>
    );
};

export default ActiveWorkoutPage;