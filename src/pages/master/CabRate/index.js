/* eslint-disable no-unused-vars */
import { MenuItem, Select, Stack, InputLabel, FormControl, Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

const options = [
  {
    label: 'Cab Rate Master For Vendor',
    value: 'vendor'
  },
  {
    label: 'Cab Rate Master For Driver',
    value: 'driver'
  }
];

const URL = {
  vendor: 'vendor',
  driver: 'driver'
};

const CabRate = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const handleBtnClick = useCallback(() => {
    const url = URL[value];
    if (!url) {
      alert('Please select cab rate type');
      return;
    }
    navigate(`${url}`);
  }, [navigate, value]);

  return (
    <>
      <Stack gap={2}>
        <FormControl fullWidth>
          <InputLabel id="editable-select-cab-rate-label">Select Cab Rate Master</InputLabel>
          <Select
            labelId="editable-select-cab-rate-label"
            id="editable-select-cab-rate"
            value={value}
            label="Select Cab Rate Master"
            onChange={handleChange}
          >
            {options.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" size="medium" sx={{ alignSelf: 'center' }} onClick={handleBtnClick}>
          Submit
        </Button>
      </Stack>

      {/* {value && <p>Selected: {value}</p>} */}
    </>
  );
};

export default CabRate;
