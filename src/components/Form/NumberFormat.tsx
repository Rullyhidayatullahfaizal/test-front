import React from 'react';
import { FieldProps } from 'formik';
import  { NumberFormatBase, NumberFormatValues } from 'react-number-format';

const NumberFormatCustom: React.FC<FieldProps> = ({
  field,
  form,
  ...other
}) => {


  return (
    <NumberFormatBase
      {...field}
      {...other}
      prefix="Rp "
      onValueChange={(values:NumberFormatValues) => {
        form.setFieldValue(field.name, values.value);
      }}
    />
  );
};

export default NumberFormatCustom;
