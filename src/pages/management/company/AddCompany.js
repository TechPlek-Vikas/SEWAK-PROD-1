// material-ui
import { Button, DialogActions, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { useNavigate } from 'react-router-dom';
import { addCompany } from 'store/slice/cabProvidor/companySlice';

// ==============================|| LAYOUTS -  COLUMNS ||============================== //
const taxOptions = {
  No: 0,
  'Per Trip': 1,
  Monthly: 2
};

function AddCompany() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };
  const validationSchema = yup.object({});

  const formik = useFormik({
    initialValues: {
      company_name: '',
      contact_person: '',
      company_email: '',
      mobile: '',
      landline: '',
      PAN: '',
      GSTIN: '',
      postal_code: '',
      address: '',
      city: '',
      state: '',
      MCDTax: '',
      MCDAmount: '',
      stateTax: '',
      stateTaxAmount: '',
      files: null
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('company_name', values.company_name);
        formData.append('contact_person', values.contact_person);
        formData.append('company_email', values.company_email);
        formData.append('mobile', values.mobile);
        formData.append('landline', values.landline);
        formData.append('PAN', values.PAN);
        formData.append('GSTIN', values.GSTIN);
        formData.append('postal_code', values.postal_code);
        formData.append('city', values.city);
        formData.append('state', values.state);
        formData.append('address', values.address);
        formData.append('MCDTax', values.MCDTax);
        formData.append('MCDAmount', values.MCDAmount);
        formData.append('stateTax', values.stateTax);
        formData.append('stateTaxAmount', values.stateTaxAmount);
        formData.append('companyContract', values.files[0]);

        const resultAction = dispatch(addCompany(formData));

        if (addCompany.fulfilled.match(resultAction)) {
          // Company successfully added
          resetForm();
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
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} id="validation-forms">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={'ADD COMPANY INFORMATION'}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Company Name</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Company Name"
                    id="company_name"
                    name="company_name"
                    value={formik.values.company_name}
                    onChange={formik.handleChange}
                    error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                    helperText={formik.touched.company_name && formik.errors.company_name}
                    autoComplete="company_name"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Contact Person Name</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Person Name"
                    id="contact_person"
                    name="contact_person"
                    value={formik.values.contact_person}
                    onChange={formik.handleChange}
                    error={formik.touched.contact_person && Boolean(formik.errors.contact_person)}
                    helperText={formik.touched.contact_person && formik.errors.contact_person}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Company Email"
                    id="company_email"
                    name="company_email"
                    value={formik.values.company_email}
                    onChange={formik.handleChange}
                    error={formik.touched.company_email && Boolean(formik.errors.company_email)}
                    helperText={formik.touched.company_email && formik.errors.company_email}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Mobile Number</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Mobile Number"
                    id="mobile"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Landline Number</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Landline Number"
                    id="landline"
                    name="landline"
                    value={formik.values.landline}
                    onChange={formik.handleChange}
                    error={formik.touched.landline && Boolean(formik.errors.landline)}
                    helperText={formik.touched.landline && formik.errors.landline}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>PAN</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter PAN"
                    id="PAN"
                    name="PAN"
                    value={formik.values.PAN}
                    onChange={formik.handleChange}
                    error={formik.touched.PAN && Boolean(formik.errors.PAN)}
                    helperText={formik.touched.PAN && formik.errors.PAN}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>GSTIN</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter GSTIN"
                    id="GSTIN"
                    name="GSTIN"
                    value={formik.values.GSTIN}
                    onChange={formik.handleChange}
                    error={formik.touched.GSTIN && Boolean(formik.errors.GSTIN)}
                    helperText={formik.touched.GSTIN && formik.errors.GSTIN}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Pincode</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Pincode"
                    id="postal_code"
                    name="postal_code"
                    value={formik.values.postal_code}
                    onChange={formik.handleChange}
                    error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                    helperText={formik.touched.postal_code && formik.errors.postal_code}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>Address</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter Address"
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>City</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter City"
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={1}>
                  <InputLabel>State</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter State"
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard title="MCD/TAX INFORMATION">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={3}>
                <Stack spacing={1}>
                  <InputLabel>MCD Tax</InputLabel>
                  <FormControl>
                    <InputLabel>MCD Tax</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      id="MCDTax"
                      name="MCDTax"
                      value={formik.values.MCDTax}
                      onChange={formik.handleChange}
                      error={formik.touched.MCDTax && Boolean(formik.errors.MCDTax)}
                      helperText={formik.touched.MCDTax && formik.errors.MCDTax}
                      autoComplete="MCDTax"
                    >
                      {Object.entries(taxOptions).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Stack spacing={1}>
                  <InputLabel>MCD Amount</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter MCD Amount"
                    id="MCDAmount"
                    name="MCDAmount"
                    type="number"
                    value={formik.values.MCDAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.MCDAmount && Boolean(formik.errors.MCDAmount)}
                    helperText={formik.touched.MCDAmount && formik.errors.MCDAmount}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} lg={3}>
                <Stack spacing={1}>
                  <InputLabel>State Tax</InputLabel>
                  <FormControl>
                    <InputLabel>State Tax</InputLabel>
                    <Select
                      fullWidth
                      defaultValue=""
                      id="stateTax"
                      name="stateTax"
                      value={formik.values.stateTax}
                      onChange={formik.handleChange}
                      error={formik.touched.stateTax && Boolean(formik.errors.stateTax)}
                      helperText={formik.touched.stateTax && formik.errors.stateTax}
                      autoComplete="stateTax"
                    >
                      {Object.entries(taxOptions).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Stack spacing={1}>
                  <InputLabel>State Amount</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter State Amount"
                    id="stateTaxAmount"
                    name="stateTaxAmount"
                    type="number"
                    value={formik.values.stateTaxAmount}
                    onChange={formik.handleChange}
                    error={formik.touched.stateTaxAmount && Boolean(formik.errors.stateTaxAmount)}
                    helperText={formik.touched.stateTaxAmount && formik.errors.stateTaxAmount}
                  />
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard title="CONTRACT INFORMATION">
            <SingleFileUpload
              id="companyContract"
              name="companyContract"
              setFieldValue={formik.setFieldValue}
              value={formik.values.files}
              file={formik.values.files}
              error={formik.touched.companyContract && Boolean(formik.errors.companyContract)}
              helperText={formik.touched.companyContract && formik.errors.companyContract}
            />
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end">
            <DialogActions>
              <Button variant="outlined" color="error" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit">
                {'Save'}
              </Button>
            </DialogActions>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

export default AddCompany;
