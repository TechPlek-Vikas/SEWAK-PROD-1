/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

// material-ui
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import AvatarUpload from 'components/third-party/dropzone/Avatar';
import { USERTYPE } from 'constant';
import { Eye, EyeSlash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { registerUser } from 'store/slice/cabProvidor/userSlice';

//Validation Schema for formData

const validationSchema = yup.object({
  // files: yup.mixed().required('File is required'),
  userName: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),//
  userEmail: yup.string().email('Invalid email address').required('Email is required'),//
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),//
  confirmpassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  // contactNumber: yup
  //   .string()
  //   .required('Contact Number is required')
  //   .matches(/^[0-9]{10}$/, 'Contact Number must be exactly 10 digits'),
  // alternateContactNumber: yup
  //   .string()
  //   .matches(/^[0-9]{10}$/, 'Alternate Contact Number must be exactly 10 digits')
  //   .required('Alternate Contact Number is required'),
  // pinCode: yup
  //   .string()
  //   .required('Pin Code is required')
  //   .matches(/^[0-9]{6}$/, 'Pin Code must be exactly 6 digits'),
  // city: yup.string().required('City is required').min(2, 'City must be at least 2 characters'),
  // state: yup.string().required('State is required').min(2, 'State must be at least 2 characters'),
  // address: yup.string().required('Address is required').min(10, 'Address must be at least 10 characters'),
  // userType: yup.string().required('User Type is required')
});

//Cab Provider adding vendor user
const AvailableUserTypeOptions = {
  [USERTYPE.isVendorUser]: 'Vendor User'
};

// ==============================|| VALIDATION WIZARD - ADDRESS  ||============================== //

// eslint-disable-next-line react/prop-types
const BasicInfo = ({ basicInfo, handleNext, setErrorIndex, setVendorId }) => {
  // eslint-disable-next-line no-unused-vars
  const [selectedImage, setSelectedImage] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const [avatar, setAvatar] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmpassword: false
  });

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const formik = useFormik({
    initialValues: {
      userName: basicInfo.userName || '',
      userEmail: basicInfo.userEmail || '',
      password: basicInfo.password || '',
      confirmpassword: basicInfo.confirmpassword || '',
      contactNumber: basicInfo.contactNumber || '',
      alternateContactNumber: basicInfo.alternateContactNumber || '',
      // pinCode: basicInfo.pinCode || '',
      // city: basicInfo.city || '',
      // state: basicInfo.state || '',
      // address: basicInfo.address || '',
      // files: null,
      userType: 2
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      
      try {
        const formData = new FormData();
        // formData.append('userImage', values.files[0]);
        formData.append('userName', values.userName);
        formData.append('userEmail', values.userEmail);
        formData.append('userPassword', values.password);
        formData.append('contactNumber', values.contactNumber);
        formData.append('alternateContactNumber', values.alternateContactNumber);
        formData.append('userType', 2);
        // formData.append('pinCode', values.pinCode);
        // formData.append('city', values.city);
        // formData.append('state', values.state);
        // formData.append('address', values.address);

        //Post request for adding basic details Vendor

        const response = await dispatch(registerUser(formData)).unwrap();

        if (response?.status === 201) {
          setVendorId(response.data._id);
          handleNext(); // handling next button
          resetForm(); // Reset the form after successful submission

          //Alert message on success added

          dispatch(
            openSnackbar({
              open: true,
              message: 'Basic User details have been successfully added',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
        }
      } catch (error) {
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
      }

      setSubmitting(false);
    }
  });

  const handleClickShowPassword = (field) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Basic Information
      </Typography>
      <form onSubmit={formik.handleSubmit} id="validation-forms" autoComplete="off">
        <Grid container spacing={3}>
          {/* <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1.5} alignItems="center">
                  <AvatarUpload
                    name="files"
                    //  images={avatar}
                    //  setImages={setAvatar}
                    setFieldValue={formik.setFieldValue}
                    file={formik.values.files}
                    error={formik.touched.files && !!formik.errors.files}
                  />
                  <Stack spacing={0}>
                    <Typography align="center" variant="caption" color="secondary">
                      Upload Image
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Grid> */}
          {/* <Grid item xs={12}>
            <Typography variant="h5" component="div">
               Personal Info:
            </Typography>
          </Grid> */}
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Username</InputLabel>
              <TextField
                id="userName"
                name="userName"
                placeholder="Enter Username"
                value={formik.values.userName}
                onChange={formik.handleChange}
                error={formik.touched.userName && Boolean(formik.errors.userName)}
                helperText={formik.touched.userName && formik.errors.userName}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={1}>
              <InputLabel>Email</InputLabel>
              <TextField
                id="userEmail"
                name="userEmail"
                type="email"
                placeholder="Enter Email"
                value={formik.values.userEmail}
                onChange={formik.handleChange}
                error={formik.touched.userEmail && Boolean(formik.errors.userEmail)}
                helperText={formik.touched.userEmail && formik.errors.userEmail}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={1}>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPasswords.password ? 'text' : 'password'}
                placeholder="User Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={() => handleClickShowPassword('password')}
                      color="secondary"
                    >
                      {showPasswords.password ? <Eye /> : <EyeSlash />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Confirm Password</InputLabel>
              <OutlinedInput
                id="text-adornment-password"
                name="confirmpassword"
                type={showPasswords.confirmpassword ? 'text' : 'password'}
                placeholder="Enter Confirm Password"
                value={formik.values.confirmpassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmpassword && Boolean(formik.errors.confirmpassword)}
                helperText={formik.touched.confirmpassword && formik.errors.confirmpassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={() => handleClickShowPassword('confirmpassword')}
                      color="secondary"
                    >
                      {showPasswords.confirmpassword ? <Eye /> : <EyeSlash />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="div">
              Contact Info:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>Contact Number</InputLabel>
              <TextField
                id="contactNumber"
                name="contactNumber"
                type="text"
                placeholder="Enter Contact Number"
                value={formik.values.contactNumber}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^\d*$/.test(value)) {
                    formik.handleChange(event);
                  }
                }}
                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>Alternate Contact Number</InputLabel>
              <TextField
                name="alternateContactNumber"
                type="text"
                placeholder="Enter Contact Number"
                value={formik.values.alternateContactNumber}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^\d*$/.test(value)) {
                    formik.handleChange(event);
                  }
                }}
                error={formik.touched.alternateContactNumber && Boolean(formik.errors.alternateContactNumber)}
                helperText={formik.touched.alternateContactNumber && formik.errors.alternateContactNumber}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </Grid>
          {/* <Grid item xs={12}>
            <Typography variant="h5" component="div">
              C. Address Info:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack spacing={1}>
              <InputLabel>Pin Code</InputLabel>
              <TextField
                name="pinCode"
                type="text"
                placeholder="Enter Pin Code"
                value={formik.values.pinCode}
                onChange={(event) => {
                  // Optional: Ensure only numbers are inputted
                  const value = event.target.value;
                  if (/^\d*$/.test(value)) { // Only allow digits
                    formik.handleChange(event);
                  }
                }}
                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                helperText={formik.touched.pinCode && formik.errors.pinCode}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack spacing={1}>
              <InputLabel>City</InputLabel>
              <TextField
                name="city"
                placeholder="Enter City"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack spacing={1}>
              <InputLabel>State</InputLabel>
              <TextField
                name="state"
                placeholder="Enter State"
                value={formik.values.state}
                onChange={formik.handleChange}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Stack spacing={1}>
              <InputLabel>Address</InputLabel>
              <TextField
                name="address"
                placeholder="Enter Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                fullWidth
                autoComplete="off"
                multiline
                rows={3}
              />
            </Stack>
          </Grid> */}
          {/* <Grid item xs={12} sm={12}>
            <Stack spacing={1}>
              <FormControl>
                <InputLabel>User Type</InputLabel>
                <Select
                  fullWidth
                  placeholder="Enter User Type"
                  id="userType"
                  name="userType"
                  value={formik.values.userType}
                  onChange={formik.handleChange}
                  error={formik.touched.userType && Boolean(formik.errors.userType)}
                  helperText={formik.touched.userType && formik.errors.userType}
                  autoComplete="off"
                >
                  {Object.keys(AvailableUserTypeOptions).map((key) => (
                    <MenuItem key={key} value={key}>
                      {AvailableUserTypeOptions[key]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid> */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit" onClick={() => setErrorIndex(0)}>
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

BasicInfo.propTypes = {
  shippingData: PropTypes.object,
  setShippingData: PropTypes.func,
  handleNext: PropTypes.func,
  setErrorIndex: PropTypes.func
};

export default BasicInfo;
