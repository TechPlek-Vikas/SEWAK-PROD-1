import PropTypes from 'prop-types';
import { Autocomplete, Box, Button, DialogActions, DialogContent, DialogTitle, Divider, InputLabel, Stack, TextField } from '@mui/material';
import { useFormik, FormikProvider } from 'formik';
import { useDispatch } from 'store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { openSnackbar } from 'store/reducers/snackbar';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { useEffect } from 'react';
import { addZoneType, updateZoneType } from 'store/slice/cabProvidor/zoneTypeSlice';

const ZonetypeAddForm = ({ zoneType, onCancel, updateKey, setUpdateKey }) => {
  const isCreating = !zoneType;

  const dispatch = useDispatch();
  const { zoneNames } = useSelector((state) => state.zoneName);

  useEffect(() => {
    dispatch(fetchZoneNames());
  }, [dispatch, updateKey]);

  const CustomerSchema = yup.object().shape({});

  const formik = useFormik({
    initialValues: {
      zoneId: zoneType?.['zoneId._id'] || '',
      zoneTypeName: zoneType?.zoneTypeName || '',
      zoneTypeDescription: zoneType?.zoneTypeDescription || ''
    },
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isCreating) {
          // POST request for adding new record
          const resultAction = await dispatch(
            addZoneType({
              zoneId: values.zoneId,
              zoneTypeName: values.zoneTypeName,
              zoneTypeDescription: values.zoneTypeDescription
            })
          );

          if (addZoneType.fulfilled.match(resultAction)) {
            setUpdateKey(updateKey + 1);
            dispatch(
              openSnackbar({
                open: true,
                message: 'Zone Type added successfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Error adding Zone Type.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
          }

          // const response = await axios.post(
          //   `${process.env.REACT_APP_API_URL}zoneType/add`,
          //   {
          //     data: {
          //       zoneId: values.zoneId,
          //       zoneTypeName: values.zoneTypeName,
          //       zoneTypeDescription: values.zoneTypeDescription
          //     }
          //   },
          //   {
          //     headers: {
          //       Authorization: `${token}`
          //     }
          //   }
          // );
          // if (response.status === 201) {
          //   setUpdateKey(updateKey + 1);
          // }

          dispatch(
            openSnackbar({
              open: true,
              message: 'Zone Type added successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          // PUT request for editing existing record
          const resultAction = await dispatch(
            updateZoneType({ _id: zoneType._id, zoneTypeName: values.zoneTypeName, zoneTypeDescription: values.zoneTypeDescription })
          );

          if (updateZoneType.fulfilled.match(resultAction)) {
            setUpdateKey(updateKey + 1);
            dispatch(
              openSnackbar({
                open: true,
                message: 'Zone Type updated successfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Error updating Zone Type.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
          }
          // const response = await axios.put(
          //   `${process.env.REACT_APP_API_URL}zoneType/edit`,
          //   {
          //     data: {
          //       _id: zoneType._id,
          //       zoneTypeName: values.zoneTypeName,
          //       zoneTypeDescription: values.zoneTypeDescription
          //     }
          //   },
          //   {
          //     headers: {
          //       Authorization: `${token}`
          //     }
          //   }
          // );
          // if (response.status === 200) {
          //   setUpdateKey(updateKey + 1);
          // }
          // dispatch(
          //   openSnackbar({
          //     open: true,
          //     message: 'Zone Type updated successfully.',
          //     variant: 'alert',
          //     alert: {
          //       color: 'success'
          //     },
          //     close: false
          //   })
          // );
        }
        onCancel();
      } catch (error) {
        console.error(error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'An error occurred. Please try again.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      }
    }
  });

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{isCreating ? 'Add Zone Type' : 'Edit Zone Type'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }} direction="row">
            <Stack spacing={3}>
              <Stack spacing={1}>
                <InputLabel htmlFor="zoneTypeName">Zone Type Name</InputLabel>
                <TextField
                  fullWidth
                  id="zoneTypeName"
                  name="zoneTypeName"
                  value={formik.values.zoneTypeName}
                  onChange={formik.handleChange}
                  placeholder="Enter Zone Type Name"
                  error={Boolean(formik.touched.zoneTypeName && formik.errors.zoneTypeName)}
                  helperText={formik.touched.zoneTypeName && formik.errors.zoneTypeName}
                />
              </Stack>
              <Stack spacing={1}>
                <InputLabel htmlFor="zoneTypeDescription">Zone Type Description</InputLabel>
                <TextField
                  fullWidth
                  id="zoneTypeDescription"
                  name="zoneTypeDescription"
                  value={formik.values.zoneTypeDescription}
                  onChange={formik.handleChange}
                  placeholder="Enter Zone Type Description"
                  error={Boolean(formik.touched.zoneTypeDescription && formik.errors.zoneTypeDescription)}
                  helperText={formik.touched.zoneTypeDescription && formik.errors.zoneTypeDescription}
                />
              </Stack>
              <Stack spacing={1}>
                <InputLabel htmlFor="zoneTypeDescription">Select Zone</InputLabel>
                <Autocomplete
                  id="zoneId"
                  value={zoneNames.find((item) => item._id === formik.values.zoneId) || null}
                  onChange={(event, value) => {
                    formik.setFieldValue('zoneId', value?._id);
                  }}
                  options={zoneNames}
                  fullWidth
                  autoHighlight
                  getOptionLabel={(option) => option.zoneName}
                  isOptionEqualToValue={(option) => {
                    option._id === formik.values.zoneId;
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option['zoneName']}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Choose a zone"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password' // Disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </Stack>
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button color="error" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {isCreating ? 'Add' : 'Edit'}
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

ZonetypeAddForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  sliceName: PropTypes.string.isRequired,
  title: PropTypes.shape({
    ADD: PropTypes.string,
    EDIT: PropTypes.string
  }),
  initialValuesFun: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ),
  fetchAllData: PropTypes.func.isRequired,
  fetchSingleDetails: PropTypes.func.isRequired
};

export default ZonetypeAddForm;
