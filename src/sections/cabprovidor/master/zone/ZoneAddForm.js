import PropTypes from 'prop-types';

import { Button, DialogActions, DialogContent, DialogTitle, Divider, InputLabel, Stack, TextField } from '@mui/material';

import { useFormik, FormikProvider } from 'formik';
import { dispatch } from 'store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { openSnackbar } from 'store/reducers/snackbar';
import * as yup from 'yup';
import { addZoneName, updateZoneName } from 'store/slice/cabProvidor/ZoneNameSlice';

const ZoneAddForm = ({ zone, onCancel, updateKey, setUpdateKey }) => {
  const isCreating = !zone;

  const CustomerSchema = yup.object().shape({});

  const formik = useFormik({
    initialValues: { zoneName: zone?.zoneName || '', zoneDescription: zone?.zoneDescription || '' },
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isCreating) {
          // POST request for adding new record
          const resultAction = await dispatch(
            addZoneName({
              data: {
                zoneName: values.zoneName,
                zoneDescription: values.zoneDescription
              }
            })
          );
          console.log('resultAction', resultAction);
          if (addZoneName.fulfilled.match(resultAction)) {
            setUpdateKey(updateKey + 1);
            dispatch(
              openSnackbar({
                open: true,
                message: resultAction.message || 'Zone added successfully.',
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
                message: resultAction.message || 'Error adding Zone Type.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
          }
        } else {
          // PUT request for editing existing record

          const resultAction = await dispatch(
            updateZoneName({
              data: {
                _id: zone._id,
                zoneName: values.zoneName,
                zoneDescription: values.zoneDescription
              }
            })
          );

          console.log('resultAction', resultAction);

          if (updateZoneName.fulfilled.match(resultAction)) {
            setUpdateKey(updateKey + 1);
            dispatch(
              openSnackbar({
                open: true,
                message: resultAction.message || 'Zone  updated successfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
            onCancel();
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: resultAction.payload.message || 'Error updating Zone.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: true
              })
            );
          }
          //   `${process.env.REACT_APP_API_URL}zone/edit`,
          //   {
          //     data: {
          //       _id: zone._id,
          //       zoneName: values.zoneName,
          //       zoneDescription: values.zoneDescription
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
          //     message: 'Zone updated successfully.',
          //     variant: 'alert',
          //     alert: {
          //       color: 'success'
          //     },
          //     close: false
          //   })
          // );
        }
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
          <DialogTitle>{isCreating ? 'Add Zone' : 'Edit Zone'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }} direction="row">
            <Stack spacing={3}>
              <Stack spacing={1}>
                <InputLabel htmlFor="zoneName">Zone Name</InputLabel>
                <TextField
                  fullWidth
                  id="zoneName"
                  name="zoneName"
                  value={formik.values.zoneName}
                  onChange={formik.handleChange}
                  placeholder="Enter Zone Name"
                  error={Boolean(formik.touched.zoneName && formik.errors.zoneName)}
                  helperText={formik.touched.zoneName && formik.errors.zoneName}
                />
              </Stack>
              <Stack spacing={1}>
                <InputLabel htmlFor="zoneDescription">Zone Description</InputLabel>
                <TextField
                  fullWidth
                  id="zoneDescription"
                  name="zoneDescription"
                  value={formik.values.zoneDescription}
                  onChange={formik.handleChange}
                  placeholder="Enter Zone Description"
                  error={Boolean(formik.touched.zoneDescription && formik.errors.zoneDescription)}
                  helperText={formik.touched.zoneDescription && formik.errors.zoneDescription}
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

ZoneAddForm.propTypes = {
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

export default ZoneAddForm;
