import React, { FC, ReactNode, useRef, useState } from "react";
import Label from "@/components/form/Label";
import { IconInfo } from "@/icons/components/icons";

interface FileFieldProps {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
  infoText?: string;
  required?: boolean;
  multiple?: boolean;
  acceptedFormats?: string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const FIleField: FC<FileFieldProps> = ({
  label,
  labelClassName,
  containerClassName,
  htmlFor,
  required,
  infoText,
  multiple = false,
  acceptedFormats = ['application/pdf'],
  onChange,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        setFileName(`${files.length} file dipilih`);
      } else {
        setFileName(files[0].name);
      }
    } else {
      setFileName("");
    }
    onChange?.(e);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={containerClassName}>
      {label && (
        <Label htmlFor={htmlFor} className={labelClassName}>
          <>
            {label}
            {required && <span className="mr-1 text-error-500"> *</span>}
            {infoText && (
              (() => {
                const iconRef = useRef<HTMLSpanElement | null>(null);
                const [visible, setVisible] = useState(false);
                const [placement, setPlacement] = useState<"right" | "left" | "bottom">("right");
                const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

                const onEnter = () => {
                  const el = iconRef.current;
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  const viewportW = window.innerWidth;
                  const viewportH = window.innerHeight;
                  const estTooltipW = 360;
                  const estTooltipH = 80;

                  let p: "right" | "left" | "bottom" = "right";
                  if (rect.right + estTooltipW + 8 > viewportW) {
                    p = "left";
                  }
                  if (p !== "left" && rect.bottom + estTooltipH + 8 > viewportH) {
                    p = "bottom";
                  }

                  setPlacement(p);
                  if (p === "right") {
                    setCoords({ top: rect.top + rect.height / 2, left: rect.right + 8 });
                  } else if (p === "left") {
                    setCoords({ top: rect.top + rect.height / 2, left: rect.left - 8 });
                  } else {
                    setCoords({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
                  }
                  setVisible(true);
                };
                const onLeave = () => setVisible(false);

                return (
                  <>
                    <span
                      ref={iconRef}
                      className="inline-block ml-2 align-middle cursor-default"
                      onMouseEnter={onEnter}
                      onMouseLeave={onLeave}
                    >
                      <IconInfo size={16} />
                    </span>
                    {visible && (
                      <div
                        style={{ top: coords.top, left: coords.left }}
                        className={`fixed z-50 ${placement === "right" ? "-translate-y-1/2" : ""} ${
                          placement === "left" ? "-translate-y-1/2 -translate-x-full" : ""
                        } ${placement === "bottom" ? "-translate-x-1/2" : ""}`}
                      >
                        <div className="relative">
                          <div className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 drop-shadow-4xl shadow-theme-xs dark:bg-[#1E2634] dark:text-white max-w-[360px] whitespace-normal break-words">
                            {infoText}
                          </div>
                          {placement === "right" && (
                            <div className="absolute -left-1.5 top-1/2 h-3 w-4 -translate-y-1/2 rotate-45 bg-white dark:bg-[#1E2634]"></div>
                          )}
                          {placement === "left" && (
                            <div className="absolute -right-1.5 top-1/2 h-3 w-4 -translate-y-1/2 rotate-45 bg-white dark:bg-[#1E2634]"></div>
                          )}
                          {placement === "bottom" && (
                            <div className="absolute -top-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-white dark:bg-[#1E2634]"></div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()
            )}
          </>
        </Label>
      )}
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        required={required}
        accept={acceptedFormats.join(',')}
        onChange={handleFileChange}
        className="hidden"
        id={htmlFor}
      />
      
      {/* Custom file input UI */}
      <div 
        className={`h-11 w-full rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Pilih file"
      >
        <div className="flex h-full items-center">
          <div className="file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 hover:file:bg-gray-100 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 px-3 py-2.5 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.05] cursor-pointer rounded-l-lg">
            <span className="text-sm text-gray-700 dark:text-gray-400">Pilih File</span>
          </div>
          <div className="flex-1 px-3 text-sm text-gray-500 dark:text-gray-400 truncate">
            {fileName || "Tidak ada file yang dipilih"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FIleField;
