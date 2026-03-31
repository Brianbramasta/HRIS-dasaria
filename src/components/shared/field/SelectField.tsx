import React, { FC, ReactNode } from "react";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";

type InnerProps = React.ComponentProps<typeof Select>;

interface SelectFieldProps extends InnerProps {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
  error?: string;
}

const generatePlaceholder = (label?: ReactNode): string => {
  if (!label) return "Pilih opsi";
  const labelStr = String(label).replace("*", "").trim();
  return `Pilih ${labelStr.toLowerCase()}`;
};

const SelectField: FC<SelectFieldProps> = ({
  label,
  labelClassName,
  containerClassName,
  htmlFor,
  required,
  placeholder,
  error,
  ...rest
}) => {
  const defaultPlaceholder = placeholder || generatePlaceholder(label);
  
  return (
    <div className={containerClassName}>
      {label && (
        <Label htmlFor={htmlFor} className={labelClassName}>
          <>
            {label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </>
        </Label>
      )}
      <Select required={required} placeholder={defaultPlaceholder} className={error ? 'border-red-500' : ''} {...rest} />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;
