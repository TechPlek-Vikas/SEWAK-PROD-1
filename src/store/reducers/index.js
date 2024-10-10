// third-party
import { combineReducers } from 'redux';

// project-imports
import menu from './menu';
import snackbar from './snackbar';
import authReducer from './auth';
import { companyReducer } from 'store/slice/cabProvidor/companySlice';
import { vendorReducer } from 'store/slice/cabProvidor/vendorSlice';
import { driverReducer } from 'store/slice/cabProvidor/driverSlice';
import { userReducer } from 'store/slice/cabProvidor/userSlice';
import { zoneNameReducer } from 'store/slice/cabProvidor/ZoneNameSlice';
import { cabReducer } from 'store/slice/cabProvidor/cabSlice';
import { vehicleTypeReducer } from 'store/slice/cabProvidor/vehicleTypeSlice';
import { roleReducer } from 'store/slice/cabProvidor/roleSlice';
import { zoneTypeReducer } from 'store/slice/cabProvidor/zoneTypeSlice';
import { cabRateReducer } from 'store/slice/cabProvidor/cabRateSlice';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu: menu,
  snackbar: snackbar,
  auth: authReducer,
  companies: companyReducer,
  vendors: vendorReducer,
  drivers: driverReducer,
  users: userReducer,
  zoneName: zoneNameReducer,
  zoneType: zoneTypeReducer,
  cabs: cabReducer,
  vehicleTypes: vehicleTypeReducer,
  roles: roleReducer,
  cabRate: cabRateReducer
});

export default reducers;
