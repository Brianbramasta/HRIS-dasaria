import React from 'react';

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const FormProgressBar: React.FC<FormProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      {/* Step Info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep} of {totalSteps}
          </p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {stepTitles[currentStep - 1]}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {Math.round(progressPercentage)}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative h-2 rounded-sm bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div
            className="absolute left-0 h-full bg-brand-500 dark:bg-brand-400 rounded-sm transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 dark:border-gray-700"></div>
    </div>
  );
};

export default FormProgressBar;
