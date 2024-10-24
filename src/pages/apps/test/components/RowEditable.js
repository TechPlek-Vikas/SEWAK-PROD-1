import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// third-party
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import { Checkbox, Typography } from '@mui/material';
import { formatIndianDate } from 'utils/dateFormat_dbTOviewDate';
import axiosServices from 'utils/axios';

// project-imports
// ==============================|| EDITABLE ROW ||============================== //

export default function RowEditable({ getValue: initialValue, row, column, table }) {
  const [value, setValue] = useState(initialValue);
  const tableMeta = table.options.meta;
  const { original, index } = row;
  const { id, columnDef } = column;
  const { _zoneName_options, _vehicleType_options, _drivers_options } = original;

  const onChange = (e) => {
   
    if(id==="_guard_1"||id==="_dual_trip"){
      setValue(e.target.checked? 1 : 0)
    }else{
      setValue(e.target?.value);
    }
    console.log({ id }, e.target?.value, { original });
  };

  const onBlur = () => {
    tableMeta.updateData(row.index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let element;
  let userInfoSchema;
  switch (id) {
    case 'email':
      userInfoSchema = yup.object().shape({
        userInfo: yup.string().email('Enter valid email ').required('Email is a required field')
      });
      break;
    case 'age':
      userInfoSchema = yup.object().shape({
        userInfo: yup
          .number()
          .typeError('Age must be number')
          .required('Age is required')
          .min(18, 'You must be at least 18 years')
          .max(65, 'You must be at most 65 years')
      });
      break;
    case 'visits':
      userInfoSchema = yup.object().shape({
        userInfo: yup.number().typeError('Visits must be number').required('Required')
      });
      break;
    default:
      userInfoSchema = yup.object().shape({
        userInfo: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is Required')
      });
      break;
  }

  const isEditable = tableMeta?.selectedRow[row.id];

  switch (columnDef.dataType) {
    case 'text':
      element = (
        <>
          {isEditable ? (
            <>
              <Formik
                initialValues={{
                  _penalty_1: value
                }}
                enableReinitialize
                validationSchema={userInfoSchema}
                onSubmit={() => {}}
              >
                {({ values, handleChange, handleBlur, errors, touched }) => (
                  <Form>
                    <TextField
                      value={values._penalty_1}
                      id={`${id}`}
                      name="_penalty_1"
                      onChange={(e) => {
                        handleChange(e);
                        onChange(e);
                      }}
                      onBlur={handleBlur}
                      error={touched._penalty_1 && Boolean(errors._penalty_1)}
                      helperText={touched._penalty_1 && errors._penalty_1 && errors._penalty_1}
                      sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                    />
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            value
          )}
        </>
      );
      break;
    case 'zoneName':
      element = (
        <>
          {isEditable ? (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-select"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            >
              {_zoneName_options.map((zone) => {
                return (
                  <MenuItem key={zone._id} value={zone}>
                    <Typography>{zone.zoneName}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          ) : (
            value?.zoneName
          )}
        </>
      );
      break;
    case 'zoneType':
      element = (
        <>
          {isEditable ? (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-select"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={!original._zoneName?.zoneType}
            >
              {original._zoneName.zoneType &&
                original._zoneName.zoneType.map((type) => {
                  return (
                    <MenuItem key={type._id} value={type}>
                      <Typography>{type.zoneTypeName}</Typography>
                    </MenuItem>
                  );
                })}
            </Select>
          ) : (
            value?.zoneTypeName
          )}
        </>
      );
      break;
    case 'vehicleType':
      element = (
        <>
          {isEditable ? (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-select"
              displayEmpty
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            >
              {_vehicleType_options.map((type) => {
                return (
                  <MenuItem key={type._id} value={type}>
                    <Typography>{type.vehicleTypeName}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          ) : (
            value?.vehicleTypeName
          )}
        </>
      );
      break;
    case 'driver':
      element = (
        <>
          {isEditable ? (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-select"
              displayEmpty
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            >
              {_drivers_options.map((driver) => {
                return (
                  <MenuItem key={driver._id} value={driver}>
                    <Typography>{driver.userName}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          ) : (
            value?.userName
          )}
        </>
      );
      break;
    case 'cab':
      element = (
        <>
          {/* <Typography variant="body1">
            {original._driver.assignedVehicle ? original._driver.assignedVehicle.vehicleId.vehicleNumber : 'N/A'} 
          </Typography> */}
          {isEditable ? (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-select"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={!original._driver.assignedVehicle}
            >
              <MenuItem value={original._driver.assignedVehicle ? original._driver.assignedVehicle.vehicleId : null}>
                <Typography>
                  {original._driver.assignedVehicle ? original._driver.assignedVehicle?.vehicleId?.vehicleNumber : 'N/A'}
                </Typography>
              </MenuItem>
            </Select>
          ) : (
            value?.vehicleNumber
          )}
        </>
      );
      break;
    case 'progress':
      element = (
        <>
          {isEditable ? (
            <>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1, minWidth: 120 }}>
                <Slider
                  value={value}
                  min={0}
                  max={100}
                  step={1}
                  onBlur={onBlur}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  valueLabelDisplay="auto"
                  aria-labelledby="non-linear-slider"
                />
              </Stack>
            </>
          ) : (
            <div>
              <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
            </div>
          )}
        </>
      );
      break;
    case 'plain_text':
      element = (
        <>
          <Typography variant="body1">
            {value} {/* Display plain text */}
          </Typography>
        </>
      );
      break;
    case 'companyRate':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="Company Rate"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            value
          )}
        </>
      );
      break;
    case 'driverVendorRate':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="Driver Rate"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            value
          )}
        </>
      );
      break;
    case 'penalty':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="penalty"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            value
          )}
        </>
      );
      break;
    case 'additionalRate':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="Additional Rate"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
            />
          ) : (
            value
          )}
        </>
      );
      break;
    case 'guardPrice':
      element = (
        <>
          {isEditable ? (
            <TextField
              label="Guard Price"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id="editable-company-rate"
              type="number" // Set the type to number to accept numeric input
              value={value} // Display current rate if available, or empty string
              onChange={onChange}
              onBlur={onBlur}
              disabled={!original._guard_1}
            />
          ) : (
            value
          )}
        </>
      );
      break;

    case 'date':
      element = (
        <>
          <Typography variant="body1">
            {formatIndianDate(value)} {/* Display formatted date */}
          </Typography>
        </>
      );
      break;

    case 'checkbox':
      element = (
        <>
          {isEditable ? (
     
                  <Checkbox
                    id={`checkbox`}
                    name="checkbox"
                    checked={value===1}
                    onChange={onChange}
                    onBlur={onBlur}
                    color="primary"
                  />
                
          ) : (
            <Checkbox id={`${index}-${id}`} checked={value === 1} color="primary" disabled />
          )}
        </>
      );
      break;

    default:
      element = <span></span>;
      break;
  }

  return element;
}

RowEditable.propTypes = { getValue: PropTypes.func, row: PropTypes.object, column: PropTypes.object, table: PropTypes.object };
