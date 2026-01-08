import React, { FC, ReactNode } from "react";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";

type InnerProps = React.ComponentProps<typeof Select>;

interface SelectFieldProps extends InnerProps {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
}

const SelectField: FC<SelectFieldProps> = ({
  label,
  labelClassName,
  containerClassName,
  htmlFor,
  required,
  ...rest
}) => {
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
      <Select required={required} {...rest} />
    </div>
  );
};

export default SelectField;
