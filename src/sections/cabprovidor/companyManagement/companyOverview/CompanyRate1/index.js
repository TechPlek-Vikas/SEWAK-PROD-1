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

const CompanyRate = () => {
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [rateIndex, setRateIndex] = useState(null);

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
        company_name: 'Company A',
        rateMaster: [
          {
            zoneNameID: '',
            zoneTypeID: '',
            vehicleTypeID: [],
            cabAmount: [],
            dualTrip: '',
            dualTripAmount: [],
            guard: '',
            guardPrice: ''
          }
        ]
      }
    ]
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log('Form values:', values);
    // Reset the form after successful submission
    resetForm();
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
                            Add Company Rate for <Chip label={item.company_name} color="primary" />
                          </Stack>
                        }
                      >
                        <FieldArray
                          name={`rateData.${index}.rateMaster`}
                          render={(arrayHelpers) => (
                            <Stack spacing={2}>
                              <TableContainer>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>#</TableCell>
                                      <TableCell>Zone Name</TableCell>
                                      <TableCell>Zone Type</TableCell>
                                      <TableCell>Vehicle Type</TableCell>
                                      <TableCell>Amount for</TableCell>
                                      <TableCell>Dual Trip</TableCell>
                                      <TableCell>Dual Trip Amount for</TableCell>
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
                                            fullWidth
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
                                            fullWidth
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
                                            fullWidth
                                            placeholder="Select Vehicle Type"
                                            saveToFun={(e, value, _, action) => {
                                              // Update selected vehicle types
                                              setSelectedVehicleTypes(value); // Store selected vehicle types in state
                                              setFieldValue(
                                                'vehicleTypeID',
                                                value.map((vehicleType) => vehicleType._id)
                                              );
                                            }}
                                            matchID="_id"
                                            displayDeletedKeyName="vehicleTypeName"
                                            deleteAllMessage="Vehicle Types"
                                            disableClearable // To hide the clear button
                                          />
                                        </TableCell>

                                        {/* Amount */}
                                        <TableCell>
                                          <TextField
                                            label={`Amount for`}
                                            fullWidth
                                            disabled={selectedVehicleTypes.length === 0} // Disable if no vehicle type is selected
                                            // {...getFieldProps(`rateData.${index}.rateMaster.${rateIndex}.cabAmount.${cabIndex}.amount`)}
                                          />
                                        </TableCell>

                                        {/* Dual Trip */}
                                        <TableCell>
                                          <FormikSelectField1
                                            label="Dual Trip"
                                            name={`rateData.${index}.rateMaster.${rateIndex}.dualTrip`}
                                            options={optionsForDualTrip}
                                            fullWidth
                                            onChange={(event) => {
                                              handleSelectChangeForDualTrip(event, values, setFieldValue);
                                            }}
                                          />
                                        </TableCell>

                                        {/* Dual Trip Amount */}
                                        <TableCell>
                                          <TextField
                                            label={`Dual Trip Amount for`}
                                            disabled={getFieldProps(`rateData.${index}.rateMaster.${rateIndex}.dualTrip`).value !== 1}
                                            fullWidth
                                          />
                                        </TableCell>

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

                                        {/* <TableCell>
                                          <IconButton onClick={() => handleDeleteRate(index)}>
                                            <Trash color="red" />
                                          </IconButton>
                                        </TableCell> */}

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
                {/* to disable -> disabled={isSubmitting || !dirty}*/}
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
