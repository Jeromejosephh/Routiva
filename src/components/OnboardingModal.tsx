'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingModalProps {
  userName?: string | null;
}

export default function OnboardingModal({ userName }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(() => {
    // Initialize state based on localStorage on mount
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('hasSeenOnboarding');
    }
    return false;
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const steps = [
    {
      title: `Welcome${userName ? `, ${userName}` : ''}! 👋`,
      description: "Let's get you started with Routiva - your personal habit tracking companion.",
      icon: '🎯',
    },
    {
      title: 'Create Your First Habit',
      description: 'Start by adding habits you want to build. Keep it simple - even small habits lead to big changes!',
      icon: '✨',
    },
    {
      title: 'Track Your Progress',
      description: 'Check off habits daily and watch your streaks grow. We\'ll celebrate your milestones with you!',
      icon: '📈',
    },
    {
      title: 'Stay Consistent',
      description: 'View your analytics, completion rings, and activity heatmap to stay motivated and on track.',
      icon: '🔥',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsOpen(false);
    router.refresh();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="text-6xl mb-6 text-center animate-bounce-in">
            {step.icon}
          </div>

          {/* Text content */}
          <div className={`space-y-4 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              {step.title}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-8 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentStep(index);
                    setIsAnimating(false);
                  }, 300);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-blue-500'
                    : index < currentStep
                    ? 'w-2 bg-blue-300'
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-150 font-medium"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
            >
              {isLastStep ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
