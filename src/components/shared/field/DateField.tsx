import  { FC, ReactNode } from "react";
import Label from "@/components/form/Label";
import DatePicker, { DatePickerProps } from "@/components/form/date-picker";

interface DateFieldProps extends Omit<DatePickerProps, "label"> {
  label?: ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  htmlFor?: string;
}

const DateField: FC<DateFieldProps> = ({
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
      <DatePicker id={controlId} required={required} {...rest} />
    </div>
  );
};

export default DateField;
