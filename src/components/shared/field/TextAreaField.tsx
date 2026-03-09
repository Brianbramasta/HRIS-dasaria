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

const generatePlaceholder = (label?: ReactNode): string => {
  if (!label) return "Masukkan deskripsi";
  const labelStr = String(label).replace("*", "").trim();
  return `Masukkan ${labelStr.toLowerCase()}`;
};

const TextAreaField: FC<TextAreaFieldProps> = ({
  label,
  labelClassName,
  containerClassName,
  htmlFor,
  required,
  placeholder,
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
      <TextArea required={required} placeholder={defaultPlaceholder} {...rest} />
    </div>
  );
};

export default TextAreaField;
