import { useState } from "react";
import Button from "@/components/ui/button/Button";
import SelectField from "@/components/shared/field/SelectField";
import { useGenerateApiPayroll } from "@/features/payroll/hooks/api/useGenerateApiPayroll";

const GeneratePayrollPage = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const { loading, error, generatePayroll } = useGenerateApiPayroll();

  const handleGeneratePayroll = async () => {
    if (!selectedType) {
      alert("Please select a payroll type first!");
      return;
    }

    // Map dropdown values to API types
    let apiType: 'Staff' | 'Mitra' | 'Thr';
    if (selectedType === 'non-ae') {
      apiType = 'Staff';
    } else if (selectedType === 'ae') {
      apiType = 'Mitra';
    } else if (selectedType === 'thr') {
      apiType = 'Thr';
    } else {
      alert("Invalid type selected!");
      return;
    }

    const success = await generatePayroll(apiType);
    if (success) {
      alert("Payroll generated successfully!");
    } else {
      alert(error || "Failed to generate payroll!");
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Generate Payroll
          </h1>

          <div className="space-y-6">
            <div>
              <SelectField
                label="Payroll Tipe"
                defaultValue={selectedType}
                onChange={handleTypeChange}
                // placeholder="Select payroll type"
                containerClassName="w-full"
                options={[
                  // { value: "", label: "Select payroll type" },
                  { value: "non-ae", label: "Non-ae" },
                  { value: "ae", label: "AE" },
                  { value: "thr", label: "THR" }
                ]}
              />
            </div>

            
            <div className="flex justify-center pt-4">
              <Button
                variant="primary"
                size="md"
                onClick={handleGeneratePayroll}
                disabled={loading || !selectedType}
                className="px-8 py-3"
              >
                {loading ? "Generating..." : "Generate Payroll"}
              </Button>
            </div>

            {loading && (
              <div className="text-center text-sm text-gray-600">
                Processing payroll generation in dev server...
              </div>
            )}

            {error && (
              <div className="text-center text-sm text-red-600">
                Error: {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePayrollPage;