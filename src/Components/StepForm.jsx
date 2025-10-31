import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import StepIndicator from './StepIndicator';
import RadialChart from './RadialChart';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { submitProduct } from '../utils/api';
import { useProductStore } from '../store/productStore';

const steps = [
  {
    id: 1,
    title: 'Basic Information',
    subtitle: 'Enter your product details',
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        'Beverages', 'Snacks', 'Spreads', 'Supplements', 'Personal Care'
      ]},
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  {
    id: 2,
    title: 'Ingredients',
    subtitle: 'List all ingredients with sourcing info',
    fields: [
      { name: 'ingredients', label: 'Ingredients', type: 'dynamic', placeholder: 'Add ingredient...', required: true },
    ],
  },
  {
    id: 3,
    title: 'Certifications',
    subtitle: 'Upload or enter certification details',
    fields: [
      { name: 'certifications', label: 'Certifications', type: 'dynamic', placeholder: 'Add certification...', required: true },
    ],
  },
  {
    id: 4,
    title: 'Review & Submit',
    subtitle: 'Final review before AI analysis',
  },
];

const validateStep = (step, formData) => {
  const fields = steps[step].fields || [];
  const errors = [];

  fields.forEach(field => {
    if (field.required) {
      const value = formData[field.name];
      if (!value || 
          (Array.isArray(value) && value.length === 0) || 
          (typeof value === 'string' && value.trim() === '')) {
        errors.push(field.label);
      }
    }
  });

  return errors;
};

export default function StepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showAiResult, setShowAiResult] = useState(false);
  const [errors, setErrors] = useState([]);
  const stepRef = useRef(null);

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(
        stepRef.current.children,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [currentStep]);

  const updateField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors([]);
  };

  const addDynamicField = (fieldName, value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    const current = formData[fieldName] || [];
    setFormData(prev => ({ ...prev, [fieldName]: [...current, trimmedValue] }));
  };

  const nextStep = () => {
    const validationErrors = validateStep(currentStep, formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setErrors([]);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateStep(0, formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setCurrentStep(0);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitProduct(formData);
      setAiResponse(response);
      setShowAiResult(true);

      const newProduct = {
        id: Date.now(),
        productName: formData.productName,
        category: formData.category,
        score: response.score,
        status: 'Reviewed',
        aiResponse: {
          explanation: response.explanation,
          suggestions: response.suggestions,
          flags: response.flags,
        },
      };

      useProductStore.getState().addProduct(newProduct);

      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const hasError = errors.includes(field.label);
    const baseClasses = "w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-gray-400";
    const errorClasses = hasError ? "border-danger ring-2 ring-danger/20" : "border-gray-200 dark:border-gray-700";

    switch (field.type) {
      case 'text':
        return (
          <div>
            <input
              type="text"
              placeholder={field.label}
              value={formData[field.name] || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              className={`${baseClasses} ${errorClasses}`}
            />
            {hasError && (
              <p className="mt-1.5 text-xs sm:text-sm text-danger dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>This field is required</span>
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div>
            <textarea
              rows={4}
              placeholder={field.label}
              value={formData[field.name] || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              className={`${baseClasses} ${errorClasses} resize-none`}
            />
            {hasError && (
              <p className="mt-1.5 text-xs sm:text-sm text-danger dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>This field is required</span>
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div>
            <select
              value={formData[field.name] || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              className={`${baseClasses} ${errorClasses}`}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {hasError && (
              <p className="mt-1.5 text-xs sm:text-sm text-danger dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Please select an option</span>
              </p>
            )}
          </div>
        );

      case 'dynamic':
        const items = formData[field.name] || [];
        return (
          <div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                placeholder={field.placeholder}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.target.value.trim();
                    if (val) {
                      addDynamicField(field.name, val);
                      e.target.value = '';
                    }
                  }
                }}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-sm sm:text-base text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-gray-400"
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling;
                  const val = input.value.trim();
                  if (val) {
                    addDynamicField(field.name, val);
                    input.value = '';
                  }
                }}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base font-medium whitespace-nowrap"
              >
                Add
              </button>
            </div>
            {items.length > 0 && (
              <div className="space-y-2 mt-3">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm sm:text-base text-text-primary dark:text-white break-words flex-1 min-w-0">{item}</span>
                    <button
                      onClick={() => {
                        const newItems = items.filter((_, idx) => idx !== i);
                        updateField(field.name, newItems);
                      }}
                      className="text-danger hover:text-danger/80 text-xl flex-shrink-0 w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {hasError && (
              <p className="mt-2 text-xs sm:text-sm text-danger dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>At least one {field.label.toLowerCase()} is required</span>
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepContent = () => {
    if (currentStep === 3) {
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-r from-primary/5 to-success/5 p-4 sm:p-6 rounded-xl">
            <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mb-3 sm:mb-4">
              Review Your Product
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-text-muted mb-1.5 sm:mb-2">Product Name</p>
                <p className="text-sm sm:text-base font-medium text-text-primary dark:text-white break-words">
                  {formData.productName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-text-muted mb-1.5 sm:mb-2">Category</p>
                <p className="text-sm sm:text-base font-medium text-text-primary dark:text-white">
                  {formData.category || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm sm:text-base">Analyzing with AI...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Submit for AI Analysis</span>
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {currentStepData.fields.map((field, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-1">
              <label className="block text-xs sm:text-sm font-medium text-text-primary dark:text-white">
                {field.label}
              </label>
              {field.required && <span className="text-danger text-sm">*</span>}
            </div>
            {renderField(field)}
          </div>
        ))}
      </div>
    );
  };

  const renderAiResult = () => {
    if (!showAiResult || !aiResponse) return null;

    return (
      <div className="mt-8 sm:mt-12 bg-white dark:bg-dark-bg rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white mb-2">
            AI Analysis Complete!
          </h2>
          <p className="text-sm sm:text-base text-text-muted">Your product transparency score:</p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="mx-auto w-28 h-28 sm:w-32 sm:h-32 mb-3 sm:mb-4">
              <RadialChart score={aiResponse.score} size={128} />
            </div>
            <p className="text-xs sm:text-sm text-text-muted">Transparency Score</p>
          </div>
          <div className="flex items-center">
            <p className="text-base sm:text-lg font-semibold text-text-primary dark:text-white">
              {aiResponse.explanation}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={stepRef} className="max-w-4xl mx-auto px-4 sm:px-6" data-scroll-section>
      {showAiResult ? (
        renderAiResult()
      ) : (
        <>
          <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

          {errors.length > 0 && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-danger/10 border border-danger/20 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 text-danger">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium">Please fill in the required fields:</p>
                <ul className="list-disc list-inside text-xs sm:text-sm mt-1 space-y-0.5">
                  {errors.map((e, i) => <li key={i} className="break-words">{e}</li>)}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-dark-bg rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary dark:text-white mb-2 sm:mb-3 px-2">
                  {currentStepData.title}
                </h1>
                <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto px-2">
                  {currentStepData.subtitle}
                </p>
              </div>
              {renderStepContent()}
            </div>
          </div>

          {currentStep < 3 && (
            <div className="flex justify-between items-center gap-3 mt-6 sm:mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-text-muted hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Prev</span>
              </button>

              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 sm:gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base font-medium"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}