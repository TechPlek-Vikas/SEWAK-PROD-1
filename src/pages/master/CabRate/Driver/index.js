/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { HttpStatusCode } from 'axios';
import AlertDelete from 'components/alertDialog/AlertDelete';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import MultipleAutoCompleteWithDeleteConfirmation1, {
  DELETE_ACTIONS
} from 'components/autocomplete/MultipleAutoCompleteWithDeleteConfirmation1';
import MainCard from 'components/MainCard';
import FormikSelectField1 from 'components/select/Select1';
import FormikTextField from 'components/textfield/TextField';
import { FieldArray, Form, FormikProvider, useFormik } from 'formik';
import { Add, Trash } from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { openSnackbar } from 'store/reducers/snackbar';
import { createRateMasterForDriver } from 'store/slice/cabProvidor/cabRateSlice';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fetchDrivers } from 'store/slice/cabProvidor/driverSlice';
import axios from 'utils/axios';
import { formatDateUsingMoment, getNestedComplexProperty } from 'utils/helper';

const getInitialValue = (data) => {
  return data ? {} : { driverId: [], rateData: [] };
};

const FIXED_COLUMN_COUNT = 10;

const calculateMinWidth = (columnCount) => {
  const widthPerColumn = 200; // Set a fixed width per column (adjust as needed)
  return columnCount * widthPerColumn;
};

const optionsForDualTrip = [
  //   { value: "", label: <em>Placeholder</em>, disabled: true, hide: true },
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' }
];

const optionsForBillingCycle = [
  { value: '0', label: 'Select' },
  { value: 'Weekly', label: 'Weekly' },
  { value: '15 Days', label: '15 Days' },
  { value: '1 Month', label: '1 Month' },
  { value: '2 Months', label: '2 Months' },
  { value: 'Quaterly', label: 'Quaterly' }
];

const AddCabRateDriver = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cabAmountRef = useRef([]);
  const newCompanyCabAmountRef = useRef();
  const dualAmountRef = useRef([]);
  const [companyData, setCompanyData] = useState([]);
  const [columnCount, setColumnCount] = useState(FIXED_COLUMN_COUNT);
  const [driverIDs, setDriverIDs] = useState(null);
  const [companyIDs, setCompanyIDs] = useState(null);

  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [rateIndex, setRateIndex] = useState(null);

  useEffect(() => {
    if (driverIDs?.length > 0 && companyIDs?.length > 0) {
      // Todo : API CALLING TO CHECK EXISTING RATES
    }
  }, [driverIDs, companyIDs]);

  const handleOpenDialog = (index) => {
    setRateIndex(index);
    setRemoveDialogOpen(true);
  };

  const handleCloseDialog = (event, confirm, removeFn, rateIndex) => {
    if (confirm) {
      removeFn(rateIndex); // Call arrayHelpers.remove(rateIndex) to delete the item
    }
    setRemoveDialogOpen(false); // Close the dialog
  };

  const driverList = useSelector((state) => state.drivers.drivers) || [];
  const vehicleTypeList = useSelector((state) => state.vehicleTypes.vehicleTypes) || [];
  const zoneList = useSelector((state) => state.zoneName.zoneNames) || [];
  const zoneTypeList = useSelector((state) => state.zoneType.zoneTypes) || [];

  useEffect(() => {
    const fetchCompanyData = async () => {
      const response = await axios.get('/company');
      const result = response.data.data?.result.map((item) => ({
        _id: item._id,
        company_name: item.company_name
      }));
      setCompanyData(result);
    };
    fetchCompanyData();
    // dispatch(fetchAllVehicleTypes());
    // dispatch(fetchZoneNames());
    // dispatch(fetchAllZoneTypes());
    dispatch(fetchDrivers({ page: 1, limit: 1000, driverType: 1 }));
  }, [dispatch]);

  const formik = useFormik({
    initialValues: getInitialValue(),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await dispatch(
          createRateMasterForDriver({
            data: {
              ...values
            }
          })
        ).unwrap();

        if (response.status === HttpStatusCode.Created) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Rate Master created successfully',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
          navigate('/master/cab-rate', { replace: true });
        }
      } catch (error) {
        setSubmitting(false);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { getFieldProps, setFieldValue, values, handleSubmit, isSubmitting, dirty } = formik;

  const handleCompanyChange = (event, selectedCompanies) => {
    const existingRates = values.rateData.reduce((acc, item) => {
      acc[item.companyID] = item.rateMaster;
      return acc;
    }, {});

    const updatedRateData = selectedCompanies.map((company) => ({
      companyID: company._id,
      company_name: company.company_name,
      rateMaster: existingRates[company._id] || [
        {
          zoneNameID: '',
          zoneTypeID: '',
          cabRate: '',
          cabAmount: newCompanyCabAmountRef.current || cabAmountRef.current,
          dualTrip: '',
          dualTripAmount: [],
          guard: '',
          guardPrice: '0',
          billingCycleCompany: '',
          billingCycleVendor: '',
          effectiveDate: null
        }
      ]
    }));

    setFieldValue('rateData', updatedRateData);
  };

  const handleVehicleTypeChange = (event, selectedVehicleTypes, action) => {
    const existingCabAmountMap = values.rateData.reduce((acc, company) => {
      company.rateMaster.forEach((rate) => {
        rate.cabAmount.forEach((cab) => {
          if (cab && cab.vehicleTypeID) {
            acc[cab.vehicleTypeID] = cab.amount;
          }
        });
      });
      return acc;
    }, {});

    const existingDualTripAmountMap = values.rateData.reduce((acc, company) => {
      company.rateMaster.forEach((rate) => {
        rate.dualTripAmount.forEach((cab) => {
          if (cab && cab.vehicleTypeID) {
            acc[cab.vehicleTypeID] = cab.amount;
          }
        });
      });
      return acc;
    }, {});

    const cabAmount = selectedVehicleTypes.map((vehicleType) => ({
      vehicleTypeID: vehicleType._id,
      amount: existingCabAmountMap[vehicleType._id] || ''
    }));

    cabAmountRef.current = cabAmount;

    const dualTripAmount = selectedVehicleTypes.map((vehicleType) => ({
      vehicleTypeID: vehicleType._id,
      amount: existingDualTripAmountMap[vehicleType._id] || ''
    }));

    dualAmountRef.current = dualTripAmount;

    if (typeof action === 'undefined') {
      setColumnCount((p) => p + (cabAmount?.length || 0));
    } else if (action === DELETE_ACTIONS.DELETE_ONE) {
      setColumnCount((p) => p - 1);
    } else if (action === DELETE_ACTIONS.DELETE_ALL) {
      setColumnCount(FIXED_COLUMN_COUNT);
    }

    const newCabAmountForNewCompany = selectedVehicleTypes.map((vehicleType) => ({
      vehicleTypeID: vehicleType._id,
      amount: ''
    }));

    newCompanyCabAmountRef.current = newCabAmountForNewCompany;

    const updatedRateData = values.rateData.map((company) => {
      const updatedRateMaster = company.rateMaster.map((rate) => ({
        ...rate,
        cabAmount: selectedVehicleTypes.map((vehicleType) => {
          const existingCab = rate.cabAmount.find((cab) => cab.vehicleTypeID === vehicleType._id);
          return existingCab || { vehicleTypeID: vehicleType._id, amount: '' };
        }),
        dualTripAmount: selectedVehicleTypes.map((vehicleType) => {
          const existingDualTrip = rate.dualTripAmount.find((cab) => cab.vehicleTypeID === vehicleType._id);
          return (
            existingDualTrip || {
              vehicleTypeID: vehicleType._id,
              amount: ''
            }
          );
        })
      }));
      return { ...company, rateMaster: updatedRateMaster };
    });

    setFieldValue('rateData', updatedRateData);
  };

  const handleSelectChangeForDualTrip = (event) => {
    const { name, value } = event.target;

    const output = name.replace(/dualTrip$/, 'cabAmount');

    const result = Number(value) > 0 ? getNestedComplexProperty(values, output) : [];

    const output1 = name.replace(/dualTrip$/, 'dualTripAmount');
    setFieldValue(output1, result);
    setFieldValue(name, value);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" onSubmit={handleSubmit}>
            <Stack gap={2}>
              <MainCard>
                <Grid container spacing={3}>
                  {/* Driver Name */}
                  <Grid item xs={12} sm={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="driverId">Driver Name</InputLabel>
                      <MultipleAutoCompleteWithDeleteConfirmation1
                        label="Driver Name"
                        id="driverId"
                        options={driverList}
                        getOptionLabel={(option) => option.userName}
                        placeholder="Select Driver"
                        saveToFun={(e, value, _, action) => {
                          setFieldValue(
                            'driverId',
                            value.map((driverItem) => driverItem._id)
                          );
                          setDriverIDs(value.map((driverItem) => driverItem._id));
                        }}
                        matchID="_id"
                        displayDeletedKeyName="userName"
                      />
                    </Stack>
                  </Grid>

                  {/* Company Name */}
                  <Grid item xs={12} sm={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="companyId">Company Name</InputLabel>

                      <MultipleAutoCompleteWithDeleteConfirmation1
                        label="Company Name"
                        id="companyId"
                        options={companyData}
                        getOptionLabel={(option) => option['company_name']}
                        placeholder="Select Company"
                        saveToFun={(e, val) => {
                          handleCompanyChange(e, val);
                          setCompanyIDs(val.map((company) => company._id));
                        }}
                        matchID="_id"
                        displayDeletedKeyName="company_name"
                      />
                    </Stack>
                  </Grid>

                  {/* Vehicle Type */}
                  <Grid item xs={12} sm={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="vehicleType">Vehicle Type</InputLabel>
                      {/* DESC  : MultipleAutoCompleteWithDeleteConfirmation1 : DELETE CONFIRMATION FOR SINGLE OPTION DELETE & ALL OPTIONS */}
                      <MultipleAutoCompleteWithDeleteConfirmation1
                        label="Vehicle Type"
                        id="vehicleType"
                        options={vehicleTypeList}
                        getOptionLabel={(option) => option['vehicleTypeName']}
                        placeholder="Select Vehicle Type"
                        saveToFun={(e, val, _, action) => {
                          handleVehicleTypeChange(e, val, action);
                        }}
                        matchID="_id"
                        displayDeletedKeyName="vehicleTypeName"
                        deleteAllMessage="Vehicle Types"
                        disableClearable // To hide all clear button
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>

              {values.rateData.length > 0 && (
                <Box sx={{ p: 1 }}>
                  <CardHeader title="Rate Master" />

                  <Grid container spacing={3} gap={3}>
                    {values.rateData.map((item, index) => {
                      return (
                        <Grid item xs={12} key={item.companyID}>
                          <MainCard
                            title={
                              <Stack direction="row" spacing={1} alignItems="center" gap={1}>
                                Add Company Rate for <Chip label={item.company_name} color="primary" />
                              </Stack>
                            }
                          >
                            <FieldArray
                              name={`rateData.${index}.rateMaster`}
                              render={(arrayHelpers) => (
                                <Stack spacing={2}>
                                  <TableContainer>
                                    <Table
                                      sx={{
                                        minWidth: calculateMinWidth(columnCount)
                                      }}
                                    >
                                      {/* Headers */}
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>#</TableCell>
                                          <TableCell>Zone Name</TableCell>
                                          <TableCell>Zone Type</TableCell>
                                          <TableCell>Cab Rate</TableCell>

                                          {cabAmountRef.current?.map((cab, cabIndex) => (
                                            <TableCell key={cabIndex}>{`Amount for ${
                                              vehicleTypeList.find((v) => v._id === cab.vehicleTypeID)?.vehicleTypeName || 'Vehicle Type'
                                            }`}</TableCell>
                                          ))}

                                          <TableCell>Dual Trip</TableCell>
                                          {cabAmountRef.current?.map((cab, cabIndex) => (
                                            <TableCell key={cabIndex}>{`Dual Trip Amount for ${
                                              vehicleTypeList.find((v) => v._id === cab.vehicleTypeID)?.vehicleTypeName || 'Vehicle Type'
                                            }`}</TableCell>
                                          ))}

                                          <TableCell>Guard</TableCell>
                                          <TableCell>Guard Price</TableCell>
                                          <TableCell>Billing Cycle Company</TableCell>
                                          <TableCell>Billing Cycle Vendor</TableCell>

                                          <TableCell>Effective Date</TableCell>
                                          <TableCell>Action</TableCell>
                                        </TableRow>
                                      </TableHead>

                                      {/* Body */}
                                      <TableBody>
                                        {item.rateMaster.map((rate, rateIndex) => (
                                          <TableRow key={rateIndex}>
                                            <TableCell>{rateIndex + 1}</TableCell>

                                            {/* Zone Name */}
                                            <TableCell>
                                              <FormikAutocomplete
                                                name={`rateData.${index}.rateMaster.${rateIndex}.zoneNameID`}
                                                options={zoneList}
                                                placeholder="Select Zone Name"
                                                getOptionLabel={(option) => option['zoneName']}
                                                saveValue="_id"
                                                value={
                                                  zoneList?.find(
                                                    (item) =>
                                                      item['_id'] ===
                                                      getNestedComplexProperty(
                                                        values,
                                                        `rateData.${index}.rateMaster.${rateIndex}.zoneNameID`
                                                      )
                                                  ) || null
                                                }
                                                renderOption={(props, option) => (
                                                  <Box
                                                    component="li"
                                                    sx={{
                                                      '& > img': {
                                                        mr: 2,
                                                        flexShrink: 0
                                                      }
                                                    }}
                                                    {...props}
                                                  >
                                                    {option['zoneName']}
                                                  </Box>
                                                )}
                                              />
                                            </TableCell>

                                            {/* Zone Type */}
                                            <TableCell>
                                              <FormikAutocomplete
                                                name={`rateData.${index}.rateMaster.${rateIndex}.zoneTypeID`}
                                                options={zoneTypeList}
                                                placeholder="Select Zone Type"
                                                getOptionLabel={(option) => option['zoneTypeName']}
                                                saveValue="_id"
                                                value={
                                                  zoneTypeList?.find(
                                                    (item) =>
                                                      item['_id'] ===
                                                      getNestedComplexProperty(
                                                        values,
                                                        `rateData.${index}.rateMaster.${rateIndex}.zoneTypeID`
                                                      )
                                                  ) || null
                                                }
                                                renderOption={(props, option) => (
                                                  <Box
                                                    component="li"
                                                    sx={{
                                                      '& > img': {
                                                        mr: 2,
                                                        flexShrink: 0
                                                      }
                                                    }}
                                                    {...props}
                                                  >
                                                    {option['zoneTypeName']}
                                                  </Box>
                                                )}
                                              />
                                            </TableCell>

                                            {/* Cab Rate */}
                                            <TableCell>
                                              <FormikSelectField1
                                                label="Dual Trip"
                                                name={`rateData.${index}.rateMaster.${rateIndex}.cabRate`}
                                                options={optionsForDualTrip}
                                                fullWidth
                                              />
                                            </TableCell>

                                            {rate.cabAmount?.map((cab, cabIndex) => (
                                              <TableCell key={cabIndex}>
                                                <TextField
                                                  key={cabIndex}
                                                  label={`Amount for ${
                                                    vehicleTypeList.find((v) => v._id === cab.vehicleTypeID)?.vehicleTypeName ||
                                                    'Vehicle Type'
                                                  }`}
                                                  {...getFieldProps(
                                                    `rateData.${index}.rateMaster.${rateIndex}.cabAmount.${cabIndex}.amount`
                                                  )}
                                                />
                                              </TableCell>
                                            ))}

                                            {/* Dual Trip */}
                                            <TableCell>
                                              <FormikSelectField1
                                                label="Dual Trip"
                                                name={`rateData.${index}.rateMaster.${rateIndex}.dualTrip`}
                                                options={optionsForDualTrip}
                                                fullWidth
                                                onChange={handleSelectChangeForDualTrip}
                                              />
                                            </TableCell>

                                            {rate.dualTripAmount.length > 0 ? (
                                              rate.dualTripAmount.map((cab, cabIndex) => (
                                                <TableCell key={cabIndex}>
                                                  <TextField
                                                    key={cabIndex}
                                                    // variant="filled"
                                                    disabled={
                                                      !(
                                                        getNestedComplexProperty(
                                                          values,
                                                          `rateData.${index}.rateMaster.${rateIndex}.dualTrip`
                                                        ) == 1
                                                      )
                                                    }
                                                    label={`Dual Trip Amount for ${
                                                      vehicleTypeList.find((v) => v._id === cab.vehicleTypeID)?.vehicleTypeName ||
                                                      'Vehicle Type'
                                                    }`}
                                                    {...getFieldProps(
                                                      `rateData.${index}.rateMaster.${rateIndex}.dualTripAmount.${cabIndex}.amount`
                                                    )}
                                                  />
                                                </TableCell>
                                              ))
                                            ) : (
                                              <>
                                                {newCompanyCabAmountRef.current?.map((cab, cabIndex) => (
                                                  <TableCell key={cabIndex}>
                                                    <TextField
                                                      key={cabIndex}
                                                      // variant="filled"
                                                      label={`Dual Trip Amount for ${
                                                        vehicleTypeList.find((v) => v._id === cab.vehicleTypeID)?.vehicleTypeName ||
                                                        'Vehicle Type'
                                                      }`}
                                                      disabled={true}
                                                      {...getFieldProps(
                                                        `rateData.${index}.rateMaster.${rateIndex}.dualTripAmount.${cabIndex}.amount`
                                                      )}
                                                    />
                                                  </TableCell>
                                                ))}
                                              </>
                                            )}

                                            {/* Guard */}
                                            <TableCell>
                                              <FormikSelectField1
                                                label="Guard"
                                                name={`rateData.${index}.rateMaster.${rateIndex}.guard`}
                                                options={optionsForDualTrip}
                                                fullWidth
                                              />
                                            </TableCell>

                                            {/* Guard Price */}
                                            <TableCell>
                                              <FormikTextField
                                                name={`rateData.${index}.rateMaster.${rateIndex}.guardPrice`}
                                                label="Guard Price"
                                                fullWidth
                                                disabled={!(getFieldProps(`rateData.${index}.rateMaster.${rateIndex}.guard`).value == 1)}
                                              />
                                            </TableCell>

                                            {/* Billing Cycle Company */}
                                            <TableCell>
                                              <FormikSelectField1
                                                label="Dual Trip"
                                                name={`rateData.${index}.rateMaster.${rateIndex}.billingCycleCompany`}
                                                options={optionsForBillingCycle}
                                                fullWidth
                                              />
                                            </TableCell>

                                            {/* Billing Cycle Vendor */}
                                            <TableCell>
                                              <FormikSelectField1
                                                label="Dual Trip"
                                                name={`rateData.${index}.rateMaster.${rateIndex}.billingCycleVendor`}
                                                options={optionsForBillingCycle}
                                                fullWidth
                                              />
                                            </TableCell>

                                            {/* Effective Date */}
                                            <TableCell>
                                              <DatePicker
                                                label="Select Effective Date"
                                                sx={{ width: '100%' }}
                                                value={values.effectiveDate}
                                                format="dd/MM/yyyy"
                                                // maxDate={new Date()}
                                                onChange={(newValue) => {
                                                  setFieldValue(
                                                    `rateData.${index}.rateMaster.${rateIndex}.effectiveDate`,
                                                    formatDateUsingMoment(newValue, 'YYYY-MM-DD')
                                                  );
                                                }}
                                              />
                                            </TableCell>

                                            {/* Delete */}
                                            <TableCell>
                                              <IconButton
                                                onClick={(event) => {
                                                  handleOpenDialog(rateIndex);
                                                }}
                                              >
                                                <Trash color="red" />
                                              </IconButton>
                                            </TableCell>

                                            <AlertDelete
                                              title={`Rate ${rateIndex + 1}`}
                                              open={removeDialogOpen}
                                              handleClose={(event, confirm) =>
                                                handleCloseDialog(event, confirm, arrayHelpers.remove, rateIndex)
                                              }
                                            />
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>

                                  <Stack direction={'row'}>
                                    <Button
                                      variant="outlined"
                                      startIcon={<Add />}
                                      onClick={() =>
                                        arrayHelpers.push({
                                          zoneNameID: '',
                                          zoneTypeID: '',
                                          cabRate: '',
                                          cabAmount: newCompanyCabAmountRef.current || cabAmountRef.current || [],
                                          dualTrip: '',
                                          dualTripAmount: [],
                                          guard: '',
                                          guardPrice: '',
                                          billingCycleCompany: '',
                                          billingCycleVendor: '',
                                          effectiveDate: null
                                        })
                                      }
                                    >
                                      Add Rate
                                    </Button>
                                  </Stack>
                                </Stack>
                              )}
                            />
                          </MainCard>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              <MainCard>
                <Stack direction={'row'} justifyContent="center" alignItems="center" gap={2}>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="outlined"
                    onClick={() => {
                      navigate('/master/cab-rate', { replace: true });
                    }}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" variant="contained" disabled={isSubmitting || !dirty}>
                    Add
                  </Button>
                </Stack>
              </MainCard>
            </Stack>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

export default AddCabRateDriver;
