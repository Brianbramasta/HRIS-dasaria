import React, { FC, ReactNode } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

type InnerProps = React.ComponentProps<typeof Input>;

interface InputFieldProps extends InnerProps {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
  suffix?: ReactNode;
}

const InputField: FC<InputFieldProps> = ({
  label,
  labelClassName,
  containerClassName,
  htmlFor,
  id,
  required,
  suffix,
  className,
  ...rest
}) => {
  const controlId = htmlFor ?? id;

  return (
    <div className={containerClassName}>
      {label && (
        <Label htmlFor={controlId} className={labelClassName}>
          <>
            {label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </>
        </Label>
      )}
      <div className="relative">
        <Input id={controlId} required={required} className={`${className || ""} ${suffix ? "pr-10" : ""}`} {...rest} />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
