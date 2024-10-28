import React, { useEffect, useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { Add, Trash } from 'iconsax-react';
import MainCard from 'components/MainCard';
import { getNestedComplexProperty } from 'utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVehicleTypesForAll } from 'store/slice/cabProvidor/vehicleTypeSlice';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';
import FormikAutocomplete from 'components/autocomplete/AutoComplete';
import MultipleAutoCompleteWithDeleteConfirmation1 from 'components/autocomplete/MultipleAutoCompleteWithDeleteConfirmation1';
import FormikSelectField1 from 'components/select/Select1';
import FormikTextField from 'components/textfield/TextField';
import AlertDelete from 'components/alertDialog/AlertDelete';
import axios from 'axios';
import { openSnackbar } from 'store/reducers/snackbar';
import axiosServices from 'utils/axios';

const CompanyRate = ({ id, companyName }) => {
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  console.log(selectedVehicleTypes);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [rateIndex, setRateIndex] = useState(null);
  const token = localStorage.getItem('serviceToken');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllVehicleTypesForAll());
    dispatch(fetchZoneNames());
    dispatch(fetchAllZoneTypes());
  }, [dispatch]);

  const vehicleTypeList = useSelector((state) => state.vehicleTypes.vehicleTypes) || [];
  const zoneTypeList = useSelector((state) => state.zoneType.zoneTypes) || [];
  const zoneList = useSelector((state) => state.zoneName.zoneNames) || [];

  const optionsForDualTrip = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' }
  ];

  const initialValues = {
    rateData: [
      {
        company_name: '',
        rateMaster: [
          {
            zoneNameID: '',
            zoneTypeID: '',
            cabAmount: [
              // Array of objects with vehicleTypeID and amount
              {
                vehicleTypeID: '', // Placeholder for vehicle type ID
                amount: 0 // Default amount
              }
            ],
            dualTrip: 0, // Default dualTrip value (0 or 1)
            dualTripAmount: [
              // Array of objects with vehicleTypeID and amount
              {
                vehicleTypeID: '', // Placeholder for vehicle type ID
                amount: 0 // Default amount
              }
            ],
            guard: 0, // Default guard value (0 or 1)
            guardPrice: 0 // Default guardPrice
          }
        ]
      }
    ]
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log('values', values); // Check the full structure of values

    // Process the rateData structure first, then map rateMaster for each entry
    const formValues = {
      rateData: values.rateData.map((rateData) => ({
        rateMaster: rateData.rateMaster.map((rate) => {
          console.log('Processing rate:', rate); // Log each rate for debugging

          return {
            zoneNameID: rate.zoneNameID,
            zoneTypeID: rate.zoneTypeID,
            cabAmount: rate.cabAmount.length ? rate.cabAmount : [], // Handle empty array case
            dualTrip: rate.dualTrip,
            dualTripAmount: rate.dualTripAmount.length ? rate.dualTripAmount : [], // Handle empty array case
            guard: rate.guard,
            guardPrice: rate.guardPrice
          };
        })
      }))
    };

    console.log('formValues', formValues);

    // Prepare the final data to be sent
    const finalData = formValues.rateData.map((data) => ({
      rateMaster: data.rateMaster
    }));

    console.log('finalData', finalData);

    try {
      const response = await axiosServices.post(
        `/company/add/rates`,
        {
          data: {
            companyID: id,
            ratesForCompany: finalData
          }
        },
      );

      if (response.status === 201) {
        console.log('response', response);
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
      }

      console.log('Submission successful', response.data);
      resetForm({ values: initialValues });
      setSelectedVehicleTypes([]);
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  const handleSelectChangeForDualTrip = (event, values, setFieldValue) => {
    const { name, value } = event.target;

    const output = name.replace(/dualTrip$/, 'cabAmount');

    const result = Number(value) > 0 ? getNestedComplexProperty(values, output) : [];

    const output1 = name.replace(/dualTrip$/, 'dualTripAmount');
    setFieldValue(output1, result);
    setFieldValue(name, value);
  };

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

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, isSubmitting, dirty, setFieldValue, getFieldProps }) => (
        <Form autoComplete="off">
          <Stack gap={2}>
            {values.rateData.length > 0 && (
              <Box sx={{ p: 1 }}>
                <Grid container spacing={3}>
                  {values.rateData.map((item, index) => (
                    <Grid item xs={12} key={item.companyID}>
                      <MainCard
                        title={
                          <Stack direction="row" spacing={1} alignItems="center" gap={1}>
                            Add Company Rate for <Chip label={companyName} color="primary" />
                          </Stack>
                        }
                      >
                        <FieldArray
                          name={`rateData.${index}.rateMaster`}
                          render={(arrayHelpers) => (
                            <Stack spacing={2}>
                              <TableContainer>
                                <Box sx={{ overflowX: 'auto' }}>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Zone Name</TableCell>
                                        <TableCell>Zone Type</TableCell>
                                        <TableCell>Vehicle Type</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Dual Trip</TableCell>
                                        <TableCell>Dual Trip Amount</TableCell>
                                        <TableCell>Guard</TableCell>
                                        <TableCell>Guard Price</TableCell>
                                        <TableCell>Action</TableCell>
                                      </TableRow>
                                    </TableHead>
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
                                              sx={{ width: '150px' }}
                                              getOptionLabel={(option) => option['zoneName']}
                                              saveValue="_id"
                                              value={
                                                zoneList?.find(
                                                  (item) =>
                                                    item['_id'] ===
                                                    getNestedComplexProperty(values, `rateData.${index}.rateMaster.${rateIndex}.zoneNameID`)
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
                                              options={
                                                zoneTypeList.filter(
                                                  (zoneType) =>
                                                    zoneType.zoneId._id ===
                                                    getNestedComplexProperty(values, `rateData.${index}.rateMaster.${rateIndex}.zoneNameID`)
                                                ) || []
                                              }
                                              placeholder="Select Zone Type"
                                              sx={{ width: '150px' }}
                                              getOptionLabel={(option) => option['zoneTypeName']}
                                              saveValue="_id"
                                              value={
                                                zoneTypeList?.find(
                                                  (item) =>
                                                    item['_id'] ===
                                                    getNestedComplexProperty(values, `rateData.${index}.rateMaster.${rateIndex}.zoneTypeID`)
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
                                              disabled={
                                                !getNestedComplexProperty(values, `rateData.${index}.rateMaster.${rateIndex}.zoneNameID`)
                                              }
                                            />
                                          </TableCell>

                                          {/* Vehicle Type */}
                                          <TableCell>
                                            <MultipleAutoCompleteWithDeleteConfirmation1
                                              label="Vehicle Type"
                                              id="vehicleType"
                                              options={vehicleTypeList}
                                              getOptionLabel={(option) => option['vehicleTypeName']}
                                              sx={{ width: '150px' }}
                                              placeholder="Select Vehicle Type"
                                              saveToFun={(e, value) => {
                                                // Update selected vehicle types
                                                const vehicleTypeIds = value.map((vehicleType) => vehicleType._id);
                                                setSelectedVehicleTypes(value);
                                                // Update Formik's state for vehicleTypeID
                                                setFieldValue(
                                                  `rateData.${index}.rateMaster.${rateIndex}.cabAmount`,
                                                  vehicleTypeIds.map((vehicleTypeID) => ({
                                                    vehicleTypeID,
                                                    amount: 0
                                                  }))
                                                );
                                              }}
                                              matchID="_id"
                                              displayDeletedKeyName="vehicleTypeName"
                                              deleteAllMessage="Vehicle Types"
                                              disableClearable // To hide the clear button
                                            />
                                          </TableCell>
                                          {console.log(values.rateData[index].rateMaster[rateIndex].cabAmount.length)}
                                          {values.rateData[index].rateMaster[rateIndex].cabAmount.length === 0 ? (
                                            // Fallback input for when no vehicle type is selected
                                            <TableCell sx={{ width: '150px' }}>
                                              <TextField label="Amount (No Vehicle)" disabled sx={{ width: '150px' }} />
                                            </TableCell>
                                          ) : (
                                            values.rateData[index].rateMaster[rateIndex].cabAmount.map((cab, cabIndex) => (
                                              <TableCell
                                                key={cab.vehicleTypeID}
                                                sx={{
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  width: '150px'
                                                }}
                                              >
                                                <TextField
                                                  label={`Amount for ${
                                                    vehicleTypeList.find((v) => v._id === cab.vehicleTypeID)?.vehicleTypeName
                                                  }`}
                                                  sx={{ width: '150px' }}
                                                  value={cab.amount}
                                                  onChange={(e) => {
                                                    // Update the amount for this particular vehicle type
                                                    setFieldValue(
                                                      `rateData.${index}.rateMaster.${rateIndex}.cabAmount.${cabIndex}.amount`,
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                              </TableCell>
                                            ))
                                          )}

                                          {/* Dual Trip */}
                                          <TableCell>
                                            <FormikSelectField1
                                              label="Dual Trip"
                                              name={`rateData.${index}.rateMaster.${rateIndex}.dualTrip`}
                                              options={optionsForDualTrip}
                                              sx={{ width: '150px' }}
                                              onChange={(event) => {
                                                handleSelectChangeForDualTrip(event, values, setFieldValue);
                                              }}
                                            />
                                          </TableCell>

                                          {/* Dual Trip Amount */}
                                          {selectedVehicleTypes.length === 0 ? (
                                            <TableCell
                                              sx={{
                                                width: '150px'
                                              }}
                                            >
                                              <TextField
                                                label={`Dual Trip Amount for (No Vehicle Type)`}
                                                sx={{ width: '150px' }}
                                                disabled
                                              />
                                            </TableCell>
                                          ) : (
                                            <>
                                              {selectedVehicleTypes.map((vehicleType, cabIndex) => (
                                                <React.Fragment key={cabIndex}>
                                                  {/* Dual Trip Amount for each selected vehicle type */}
                                                  <TableCell
                                                    sx={{
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      alignItems: 'flex-start'
                                                    }}
                                                  >
                                                    <TextField
                                                      label={`Dual Trip Amount for ${vehicleType.vehicleTypeName}`} // Use vehicle type name from selected options
                                                      name={`rateData.${index}.rateMaster.${rateIndex}.dualTripAmount.${cabIndex}`} // Ensure correct binding
                                                      disabled={
                                                        getFieldProps(`rateData.${index}.rateMaster.${rateIndex}.dualTrip`).value !== 1
                                                      }
                                                      sx={{
                                                        width: '150px'
                                                      }}
                                                      onChange={(event) =>
                                                        setFieldValue(
                                                          `rateData.${index}.rateMaster.${rateIndex}.dualTripAmount.${cabIndex}`,
                                                          {
                                                            amount: event.target.value,
                                                            vehicleTypeID: selectedVehicleTypes[cabIndex]._id
                                                          }
                                                        )
                                                      }
                                                    />
                                                  </TableCell>
                                                </React.Fragment>
                                              ))}
                                            </>
                                          )}

                                          {/* Guard */}
                                          <TableCell>
                                            <FormikSelectField1
                                              label="Guard"
                                              name={`rateData.${index}.rateMaster.${rateIndex}.guard`}
                                              options={optionsForDualTrip}
                                              sx={{ width: '150px' }}
                                            />
                                          </TableCell>

                                          {/* Guard Price */}
                                          <TableCell>
                                            <FormikTextField
                                              name={`rateData.${index}.rateMaster.${rateIndex}.guardPrice`}
                                              label="Guard Price"
                                              sx={{ width: '150px' }}
                                              disabled={!(getFieldProps(`rateData.${index}.rateMaster.${rateIndex}.guard`).value == 1)}
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
                                </Box>
                              </TableContainer>
                              <Stack direction={'row'}>
                                <Button
                                  variant="outlined"
                                  startIcon={<Add />}
                                  onClick={() =>
                                    arrayHelpers.push({
                                      zoneNameID: '',
                                      zoneTypeID: '',
                                      vehicleTypeID: [],
                                      cabAmount: [],
                                      dualTrip: '',
                                      dualTripAmount: [],
                                      guard: '',
                                      guardPrice: ''
                                    })
                                  }
                                >
                                  Add Rate
                                </Button>
                              </Stack>
                            </Stack>
                          )}
                        ></FieldArray>
                      </MainCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Stack direction={'row'} justifyContent="center" alignItems="center" gap={2}>
              <Button
                type="button"
                color="secondary"
                variant="outlined"
                onClick={() => {
                  /* Cancel functionality */
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {' '}
                Add
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default CompanyRate;
