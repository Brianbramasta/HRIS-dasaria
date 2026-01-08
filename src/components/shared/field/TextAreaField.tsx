import React, { FC, ReactNode } from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";

type InnerProps = React.ComponentProps<typeof TextArea>;

interface TextAreaFieldProps extends InnerProps {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
}

const TextAreaField: FC<TextAreaFieldProps> = ({
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
      <TextArea required={required} {...rest} />
    </div>
  );
};

export default TextAreaField;
