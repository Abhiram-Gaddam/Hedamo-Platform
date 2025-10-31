export default function StepIndicator({ currentStep, totalSteps = 4 }) {
    return (
      <div className="flex items-center justify-between mb-8">
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                i < currentStep
                  ? 'bg-primary text-white'
                  : i === currentStep
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'bg-gray-200 text-text-muted'
              }`}
            >
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-all ${
                  i < currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }