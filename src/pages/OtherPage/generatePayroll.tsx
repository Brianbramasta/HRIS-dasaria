import { useState } from "react";
import Button from "@/components/ui/button/Button";

const GeneratePayrollPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePayroll = () => {
    setIsGenerating(true);
    
    // Simulate payroll generation process
    setTimeout(() => {
      setIsGenerating(false);
      alert("Payroll generated successfully in dev server!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Generate Payroll
          </h1>
{/*           
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Development Server Information
            </h2>
            <p className="text-blue-800">
              This page is for generating payroll in the development server environment.
              The payroll generation process will simulate the actual payroll calculation
              and distribution workflow.
            </p>
          </div> */}

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Payroll Generation Details:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Environment: Development Server</li>
                <li>• Status: Ready to generate</li>
                <li>• Processing: Mock data simulation</li>
              </ul>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                variant="primary"
                size="md"
                onClick={handleGeneratePayroll}
                disabled={isGenerating}
                className="px-8 py-3"
              >
                {isGenerating ? "Generating..." : "Generate Payroll"}
              </Button>
            </div>

            {isGenerating && (
              <div className="text-center text-sm text-gray-600">
                Processing payroll generation in dev server...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePayrollPage;