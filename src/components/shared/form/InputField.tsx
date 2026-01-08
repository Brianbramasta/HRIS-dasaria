import React, { FC, ReactNode } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

type InnerProps = React.ComponentProps<typeof Input>;

interface InputFieldProps extends InnerProps {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
}

const InputField: FC<InputFieldProps> = ({
  label,
  labelClassName,
  containerClassName,
  htmlFor,
  id,
  required,
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
      <Input id={controlId} required={required} {...rest} />
    </div>
  );
};

export default InputField;
