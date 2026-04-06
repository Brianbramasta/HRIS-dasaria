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
  maxRows?: number;
}

export const ColumnFilterPopup: React.FC<ColumnFilterPopupProps> = ({
  isOpen,
  onClose,
  options,
  selectedValues,
  onApply,
  onReset,
  anchorEl,
  maxRows,
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

  // Calculate position based on anchor element and viewport
  const getPosition = () => {
    if (!anchorEl) return {};
    const rect = anchorEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Estimate popup height (rough calculation based on content)
    const estimatedPopupHeight = Math.max(200, Math.min(400, options.length * 30 + 100));
    
    // Check if popup would go beyond viewport bottom
    const spaceBelow = viewportHeight - rect.bottom - 4;
    const spaceAbove = rect.top - 4;
    
    let top = rect.bottom + 4; // Default: position below
    let left = rect.left;
    
    // If not enough space below and there's more space above, position above
    if (spaceBelow < estimatedPopupHeight && spaceAbove > estimatedPopupHeight) {
      top = rect.top - estimatedPopupHeight - 4;
    }
    
    // Ensure popup doesn't go beyond viewport edges
    if (top < 4) {
      top = 4;
    }
    if (top + estimatedPopupHeight > viewportHeight - 4) {
      top = viewportHeight - estimatedPopupHeight - 4;
    }
    
    // Adjust horizontal position to prevent going off screen
    const popupWidth = maxRows ? 400 : 256; // w-auto min-w-[320px] or w-64
    if (left + popupWidth > viewportWidth - 4) {
      left = viewportWidth - popupWidth - 4;
    }
    if (left < 4) {
      left = 4;
    }
    
    return { top, left };
  };

  return (
    <div
      ref={popupRef}
      className={`fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${maxRows ? 'w-auto min-w-[320px]' : 'w-64'} max-h-[70vh] overflow-hidden`}
      style={getPosition()}
    >
      <div className="p-4">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Filter Options</h4>
        </div>

        <div
          className={maxRows ? "grid grid-flow-col gap-x-8 gap-y-2 max-h-96 overflow-y-auto" : `space-y-2 ${options.length > 6 ? 'max-h-60 overflow-y-auto grid md:grid-cols-2' : ''}`}
          style={maxRows ? { gridTemplateRows: `repeat(${maxRows}, minmax(0, 1fr))` } : {}}
        >
          {options.map((option) => (
            <div key={option.value} className="min-w-max">
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
