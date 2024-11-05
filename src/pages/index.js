/* eslint-disable no-unused-vars */
// material-ui
import { CardContent, IconButton, Stack, Tooltip, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import { Copy } from 'iconsax-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllRoles } from 'store/slice/cabProvidor/roleSlice';
import { fetchAllVehicleTypes, fetchAllVehicleTypesForAll } from 'store/slice/cabProvidor/vehicleTypeSlice';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
import { fetchAllZoneTypes } from 'store/slice/cabProvidor/zoneTypeSlice';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { openSnackbar } from 'store/reducers/snackbar';

// ==============================|| SAMPLE PAGE ||============================== //

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(fetchAllVehicleTypesForAll());
    dispatch(fetchAllRoles());
    // dispatch(fetchAllVehicleTypes());
    // dispatch(fetchZoneNames());
    // dispatch(fetchAllZoneTypes());
  }, [dispatch]);

  const token = localStorage.getItem('serviceToken') || '';

  return (
    <>
      <Stack gap={2}>
        <MainCard title="Sample Card">
          <Typography variant="body1">
            Do you Know? Able is used by more than 2.4K+ Customers worldwide. This new v9 version is the major release of Able Pro Dashboard
            Template with having brand new modern User Interface.
          </Typography>
        </MainCard>

        <MainCard
          title="Token"
          content={false}
          secondary={
            <CopyToClipboard
              text={token}
              onCopy={() =>
                dispatch(
                  openSnackbar({
                    open: true,
                    message: 'Token Copied',
                    variant: 'alert',
                    alert: {
                      color: 'success'
                    },
                    close: false,
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    transition: 'SlideLeft'
                  })
                )
              }
            >
              <Tooltip title="Copy">
                <IconButton size="large">
                  <Copy />
                </IconButton>
              </Tooltip>
            </CopyToClipboard>
          }
        ></MainCard>
      </Stack>
    </>
  );
};

export default Dashboard;
