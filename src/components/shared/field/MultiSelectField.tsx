import React, { FC, ReactNode } from "react";
import Label from "@/components/form/Label";
import MultiSelect from "@/components/form/MultiSelect";

type InnerProps = React.ComponentProps<typeof MultiSelect>;

interface MultiSelectFieldProps extends Omit<InnerProps, "label"> {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
  required?: boolean;
}

const MultiSelectField: FC<MultiSelectFieldProps> = ({
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
      <MultiSelect required={required} {...rest} />
    </div>
  );
};

export default MultiSelectField;
