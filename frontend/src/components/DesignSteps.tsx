import React from 'react';
import { CheckIcon } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
}

export interface Props {
  steps: Step[];
  currentStep: string;
}

export function DesignSteps({ steps, currentStep }: Props) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step node */}
          <div className="flex flex-col items-center relative z-10">
            <div 
              className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep === step.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : index < currentIndex
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {index < currentIndex ? (
                <CheckIcon className="h-5 w-5" /> 
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span className={`mt-3 text-sm font-medium ${
              currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {step.label}
            </span>
          </div>
          
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="flex-grow mx-4 h-0.5 bg-muted relative">
              <div 
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-500" 
                style={{ 
                  width: index < currentIndex ? '100%' : '0%' 
                }} 
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
