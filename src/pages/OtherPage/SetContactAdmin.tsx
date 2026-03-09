import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/shared/field/InputField';
import Label from '@/components/form/Label';

const DEFAULT_CONTACT = '+62 851-4250-5733';

export default function SetContactAdmin() {
  const [contactNumber, setContactNumber] = useState(DEFAULT_CONTACT);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load contact from localStorage on mount
    const savedContact = localStorage.getItem('adminContact');
    if (savedContact) {
      setContactNumber(savedContact);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('adminContact', contactNumber);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setContactNumber(DEFAULT_CONTACT);
    localStorage.setItem('adminContact', DEFAULT_CONTACT);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleContactClick = () => {
    const formattedNumber = contactNumber.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Set Contact Admin
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Configure the admin contact number for users
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Contact Number
              </Label>
              <InputField
                id="contact"
                name="contact"
                type="tel"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full"
              />
            </div>

            {isSaved && (
              <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg dark:bg-green-900 dark:text-green-300 dark:border-green-700">
                Contact number saved successfully!
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="flex-1"
                size="md"
              >
                Save Contact
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
                size="md"
              >
                Reset to Default
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Current contact will open in WhatsApp when clicked:
              </p>
              <Button
                onClick={handleContactClick}
                variant="outline"
                className="w-full"
                size="md"
              >
                Test Contact: {contactNumber}
              </Button>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
                size="sm"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}