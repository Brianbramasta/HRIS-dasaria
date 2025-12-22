import React, { useState, useRef, useEffect } from 'react';
import Checkbox from '../../../form/input/Checkbox';
import Button from '../../../ui/button/Button';

export interface ColumnFilterOption {
  label: string;
  value: string;
}

interface ColumnFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  options: ColumnFilterOption[];
  selectedValues: string[];
  onApply: (values: string[]) => void;
  onReset: () => void;
  anchorEl?: HTMLElement | null;
}

export const ColumnFilterPopup: React.FC<ColumnFilterPopupProps> = ({
  isOpen,
  onClose,
  options,
  selectedValues,
  onApply,
  onReset,
  anchorEl,
}) => {
  const [tempSelectedValues, setTempSelectedValues] = useState<string[]>(selectedValues);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempSelectedValues(selectedValues);
  }, [selectedValues, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorEl]);

  if (!isOpen) return null;

  const handleToggle = (value: string) => {
    setTempSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    onApply(tempSelectedValues);
    onClose();
  };

  const handleReset = () => {
    setTempSelectedValues([]);
    onReset();
    onClose();
  };

  // Calculate position based on anchor element
  const getPosition = () => {
    if (!anchorEl) return {};
    const rect = anchorEl.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.left,
    };
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      style={getPosition()}
    >
      <div className="p-4">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Filter Options</h4>
        </div>

        <div className={`space-y-2 ${options.length > 6 ? 'max-h-60 overflow-y-auto grid md:grid-cols-2' : ''}`}>
          {options.map((option) => (
            <div key={option.value}>
              <Checkbox
                label={option.label}
                checked={tempSelectedValues.includes(option.value)}
                onChange={() => handleToggle(option.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            Cari
          </Button>
        </div>
      </div>
    </div>
  );
};
