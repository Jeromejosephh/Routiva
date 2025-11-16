'use client';

import { useEffect, useState } from 'react';

interface CompletionRingsProps {
  userId: string;
}

interface CompletionData {
  daily: number;
  weekly: number;
  monthly: number;
}

export default function CompletionRings({ userId }: CompletionRingsProps) {
  const [data, setData] = useState<CompletionData>({ daily: 0, weekly: 0, monthly: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/habits?completion=true`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setData({
            daily: json.dailyCompletion ?? 0,
            weekly: json.weeklyCompletion ?? 0,
            monthly: json.monthlyCompletion ?? 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch completion data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="border rounded-lg p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mx-auto" />
          <div className="flex justify-around">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-24 w-24 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      <h2 className="text-lg font-semibold mb-6 text-center">Completion Progress</h2>
      
      <div className="flex flex-col sm:flex-row justify-around items-center gap-8">
        <RingWithLabel
          percentage={data.daily}
          label="Today"
          size={100}
          color="#10B981"
        />
        
        <RingWithLabel
          percentage={data.weekly}
          label="This Week"
          size={110}
          color="#3B82F6"
        />
        
        <RingWithLabel
          percentage={data.monthly}
          label="This Month"
          size={100}
          color="#8B5CF6"
        />
      </div>
    </div>
  );
}

interface RingWithLabelProps {
  percentage: number;
  label: string;
  size: number;
  color: string;
}

function RingWithLabel({ percentage, label, size, color }: RingWithLabelProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle with animation */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              animation: 'progress-draw 1s ease-out forwards',
            }}
          />
        </svg>
        
        {/* Percentage text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </div>
      </div>
    </div>
  );
}
