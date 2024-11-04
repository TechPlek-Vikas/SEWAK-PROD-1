import PropTypes from 'prop-types';

import { useState } from 'react';
import { OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Eye, EyeSlash } from 'iconsax-react';
import { useFormikContext } from 'formik';

const PasswordField = ({ name, placeholder, ...others }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { getFieldProps, touched, errors } = useFormikContext();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <OutlinedInput
      {...others}
      fullWidth
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder || 'Enter password .......'}
      {...getFieldProps(name)}
      error={Boolean(touched[name] && errors[name])}
      endAdornment={
        <InputAdornment position="end">
          <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end" color="secondary">
            {showPassword ? <Eye /> : <EyeSlash />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
};

PasswordField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string
};
export default PasswordField;
