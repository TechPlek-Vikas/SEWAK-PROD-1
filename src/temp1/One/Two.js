import { Autocomplete, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector, dispatch } from 'store';
import { fetchAllVendors } from 'store/slice/cabProvidor/vendorSlice';

const One = () => {
  const [driverID, setDriverID] = useState('');

  const allVendors = useSelector((state) => state.vendors.allVendors);
  console.log(allVendors);

  useEffect(() => {
    dispatch(fetchAllVendors());
  }, []);

  return (
    <>
      <Autocomplete
        id="zoneId"
        value={allVendors.find((item) => item.vendorId === driverID) || null}
        onChange={(event, value) => {
          setDriverID(value.vendorId);
        }}
        options={allVendors}
        fullWidth
        autoHighlight
        getOptionLabel={(option) => option.vendorCompanyName}
        // isOptionEqualToValue={(option) => {
        //   return option._id === formik.values.zoneId;
        // }}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            {option['vendorCompanyName']}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Choose a zone"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password'
            }}
          />
        )}
      />

      <hr />

      <p>Tina : {driverID}</p>
    </>
  );
};

export default One;
