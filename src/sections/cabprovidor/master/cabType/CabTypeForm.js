/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputLabel, Stack } from '@mui/material';

import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { openSnackbar } from 'store/reducers/snackbar';
import { generateArrayFromObject } from 'utils/helper';
import { FUEL_TYPE } from 'constant';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import FormikTextField from 'components/textfield/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { clearSingleDetails, fetchVehicleTypeDetails } from 'store/slice/cabProvidor/vehicleTypeSlice';

const optionsFuelType = generateArrayFromObject(FUEL_TYPE);

const CabTypeForm = ({ open, handleClose, sliceName, title, initialValuesFun, onSubmit, fetchAllData }) => {
  const dispatch = useDispatch();

  const { isCreating, getSingleDetails } = useSelector((state) => state[sliceName]);

  const data = isCreating ? null : getSingleDetails;

  useEffect(() => {
    if (!isCreating) {
      dispatch(fetchVehicleTypeDetails());
    }

    return () => {
      dispatch(clearSingleDetails());
    };
  }, [dispatch, isCreating]);

  const formikHandleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await onSubmit(values, isCreating);
      resetForm();
      handleClose();
      const message = isCreating ? 'Cab Type details have been successfully added' : 'Cab Type details have been successfully updated';

      dispatch(
        openSnackbar({
          open: true,
          message,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      fetchAllData();
    } catch (error) {
      console.log('Error :: formikHandleSubmit =', error);
      dispatch(
        openSnackbar({
          open: true,
          message: error?.message || 'Something went wrong',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValuesFun(data),
    enableReinitialize: true,
    // validationSchema: Yup.object().shape({}),
    onSubmit: formikHandleSubmit
  });

  const { errors, touched, handleSubmit, handleBlur, isSubmitting, getFieldProps, setFieldValue, values, dirty, initialValues } = formik;

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <Box sx={{ p: 1, py: 1.5 }}>
          <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <DialogTitle>{isCreating ? title.ADD : title.EDIT}</DialogTitle>

                <DialogContent>
                  <Grid container spacing={2} alignItems="center" rowGap={2}>
                    {/* Vehicle Type Name */}
                    <Grid item xs={12} lg={12}>
                      <Stack spacing={1}>
                        <InputLabel>Vehicle Type Name</InputLabel>

                        <FormikTextField name="vehicleTypeName" placeholder="Vehicle Type Name" />
                      </Stack>
                    </Grid>

                    {/* Vehicle Type Description */}
                    <Grid item xs={12} lg={12}>
                      <Stack spacing={1}>
                        <InputLabel>Description</InputLabel>

                        <FormikTextField
                          name="vehicleDescription"
                          // label="Vehicle Type Description"
                          placeholder="Vehicle Type Description"
                        />
                      </Stack>
                    </Grid>

                    {/* Capacity */}
                    <Grid item xs={12} lg={6}>
                      <Stack spacing={1}>
                        <InputLabel>Capacity</InputLabel>

                        <FormikTextField name="capacity" type="number" placeholder="Enter capacity" inputProps={{ min: 0 }} />
                      </Stack>
                    </Grid>

                    {/* Fuel Type */}
                    <Grid item xs={12} lg={6}>
                      <Stack spacing={1}>
                        <InputLabel>Fuel Type</InputLabel>
                        {/* <Autocomplete
                          id="fuelType"
                          value={
                            optionsFuelType.find(
                              (item) => item.id === values.fuelType
                            ) || null
                          }
                          onChange={(event, value) => {
                            console.log(`🚀 ~ AddStory ~ value:`, value);
                            setFieldValue("fuelType", value?.id);
                          }}
                          options={optionsFuelType}
                          fullWidth
                          autoHighlight
                          getOptionLabel={(option) => option["value"]}
                          isOptionEqualToValue={(option) =>
                            option.id === values.fuelType
                          }
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                              {...props}
                            >
                              {option["value"]}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Choose a fuel type"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                        {touched.fuelType && errors.fuelType ? (
                          <div className="error">{errors.fuelType}</div>
                        ) : null} */}

                        <FormikAutocomplete
                          name="fuelType"
                          options={optionsFuelType}
                          placeholder="Choose a fuel type"
                          getOptionLabel={(option) => option.value}
                          saveValue="id"
                          value={optionsFuelType.find((item) => item['id'] === values['fuelType']) || null}
                          renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                              {option.value}
                            </Box>
                          )}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </DialogContent>

                <DialogActions>
                  <Button color="error" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    {isCreating ? 'Add' : 'Save'}
                  </Button>
                </DialogActions>
              </Form>
            </LocalizationProvider>
          </FormikProvider>
        </Box>
      </Dialog>
    </>
  );
};

export default CabTypeForm;
