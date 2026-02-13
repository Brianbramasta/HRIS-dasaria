import React, { FC, ReactNode, useRef, useState } from "react";
import Label from "@/components/form/Label";
import FileInput from "@/components/form/input/FileInput";
import { IconInfo } from "@/icons/components/icons";

type InnerProps = React.ComponentProps<typeof FileInput>;

interface FileFieldProps extends InnerProps {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
  infoText?: string;
}

const FIleField: FC<FileFieldProps> = ({
  label,
  labelClassName,
  containerClassName,
  htmlFor,
  required,
  infoText,
  ...rest
}) => {
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
      <FileInput required={required} {...rest} />
    </div>
  );
};

export default FIleField;
