import React, { FC, ReactNode } from "react";
import Label from "@/components/form/Label";
import FileInput from "@/components/form/input/FileInput";

type InnerProps = React.ComponentProps<typeof FileInput>;

interface FileFieldProps extends InnerProps {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
}

const FIleField: FC<FileFieldProps> = ({
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
            {required && <span className="mr-1 text-error-500"> *</span>}
          </>
        </Label>
      )}
      <FileInput required={required} {...rest} />
    </div>
  );
};

export default FIleField;
