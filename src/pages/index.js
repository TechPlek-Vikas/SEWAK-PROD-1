/* eslint-disable no-unused-vars */
// material-ui
import { Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllRoles } from 'store/slice/cabProvidor/roleSlice';
import { fetchAllVehicleTypes, fetchAllVehicleTypesForAll } from 'store/slice/cabProvidor/vehicleTypeSlice';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';

// ==============================|| SAMPLE PAGE ||============================== //

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(fetchAllVehicleTypesForAll());
    // dispatch(fetchAllRoles());
    // dispatch(fetchAllVehicleTypes());
    // dispatch(fetchZoneNames());
    // dispatch(fetchAllZoneTypes());
  }, [dispatch]);

  return (
    <MainCard title="Sample Card">
      <Typography variant="body1">
        Do you Know? Able is used by more than 2.4K+ Customers worldwide. This new v9 version is the major release of Able Pro Dashboard
        Template with having brand new modern User Interface.
      </Typography>
    </MainCard>
  );
};

export default Dashboard;
