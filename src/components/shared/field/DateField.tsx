import { FC, ReactNode } from "react";
import Label from "@/components/form/Label";
import DatePicker, { DatePickerProps } from "@/components/form/date-picker";

interface DateFieldProps extends Omit<DatePickerProps, "label"> {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
  view?: "date" | "month";
  minDate?: Date | string;
  maxDate?: Date | string;
  error?: string;
}

const generatePlaceholder = (label?: ReactNode): string => {
  if (!label) return "Pilih tanggal";
  const labelStr = String(label).replace("*", "").trim();
  return `Pilih ${labelStr.toLowerCase()}`;
};

const DateField: FC<DateFieldProps> = ({
  label,
  labelClassName,
  containerClassName,
  htmlFor,
  id,
  required,
  placeholder,
  minDate,
  maxDate,
  error,
  ...rest
}) => {
  const controlId = htmlFor ?? id;
  const defaultPlaceholder = placeholder || generatePlaceholder(label);
  
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
      <DatePicker 
        id={controlId} 
        required={required} 
        placeholder={defaultPlaceholder} 
        minDate={minDate}
        maxDate={maxDate}
        error={error}
        {...rest} 
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DateField;
