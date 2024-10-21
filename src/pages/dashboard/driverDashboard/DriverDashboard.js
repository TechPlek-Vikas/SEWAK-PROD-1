import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project-imports
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import DriverWidgetCard from '../../../sections/cabprovidor/dashboard/driverdashboard/DriverWidgetCard';
import { Dialog } from '@mui/material';
import { PopupTransition } from 'components/@extended/Transitions';
import AddDriverFileForm from 'sections/cabprovidor/dashboard/driverdashboard/AddDriverFileForm';
import DriverCard from 'sections/cabprovidor/dashboard/driverdashboard/DriverCard';
import CreateDriverTemplate from 'sections/cabprovidor/dashboard/driverdashboard/MapDriverData';
import DriverIncomeAreaChart from 'sections/cabprovidor/dashboard/driverdashboard/DriverIncomeAreaChart';
// ==============================|| DRIVER - DASHBOARD ||============================== //

export default function DriverDashboard() {
  const theme = useTheme();
  const [activeChart, setActiveChart] = useState(0);

  const widgetData = [
    {
      title: 'Drivers',
      count: '-',
      percentage:'-',
      isLoss: true,
      driver: '-',
      color: theme.palette.warning
    },
    {
      title: 'Trips',
      count: '-',
      percentage:'-',
      isLoss: true,
      driver: '-',
      color: theme.palette.error
    },
    {
      title: 'Pending',
      count: '-',
      percentage:'-',
      isLoss: false,
      driver: '-',
      color: theme.palette.success
    },
    {
      title: 'Completed',
      count: '-',
      percentage:'-',
      isLoss: true,
      driver: '-',
      color: theme.palette.primary
    }
  ];

  const [series, setSeries] = useState([
    {
      name: 'TEAM A',
      type: 'column',
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 25]
    },
    {
      name: 'TEAM B',
      type: 'line',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 35]
    }
  ]);

  const handleSeries = (index) => {
    setActiveChart(index);
    switch (index) {
      case 1:
        setSeries([
          {
            name: 'TEAM A',
            type: 'column',
            data: [10, 15, 8, 12, 11, 7, 10, 13, 22, 10, 18, 4]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [12, 18, 15, 17, 12, 10, 14, 16, 25, 17, 20, 8]
          }
        ]);
        break;
      case 2:
        setSeries([
          {
            name: 'TEAM A',
            type: 'column',
            data: [12, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 25]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [17, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 35]
          }
        ]);
        break;
      case 3:
        setSeries([
          {
            name: 'TEAM A',
            type: 'column',
            data: [1, 2, 3, 5, 1, 0, 2, 0, 6, 1, 5, 3]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [5, 3, 5, 6, 7, 0, 3, 1, 7, 3, 5, 4]
          }
        ]);
        break;
      case 0:
      default:
        setSeries([
          {
            name: 'TEAM A',
            type: 'column',
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 25]
          },
          {
            name: 'TEAM B',
            type: 'line',
            data: [34, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 35]
          }
        ]);
    }
  };
  const [fileDialogue, setFileDialogue] = useState(false);

 
  const handleFileUploadDialogue = () => {
    setFileDialogue(!fileDialogue);
  };

  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Driver Summary' }];

  return (
    <>
      <Breadcrumbs custom heading="Driver Dashboard" links={breadcrumbLinks} />
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={9}>
          <MainCard>
            <Grid container spacing={2}>
              {widgetData.map((data, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box onClick={() => handleSeries(index)} sx={{ cursor: 'pointer' }}>
                    <DriverWidgetCard
                      title={data.title}
                      count={data.count}
                      percentage={data.percentage}
                      isLoss={data.isLoss}
                      driver={data.driver}
                      color={data.color.main}
                      isActive={index === activeChart}
                    />
                  </Box>
                </Grid>
              ))}
              <Grid item xs={12}>
                <DriverIncomeAreaChart series={series} />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} lg={3}>
          <DriverCard handleFileUploadDialogue={handleFileUploadDialogue} />
        </Grid>
      </Grid>

        {/* Dialog : Upload invoice */}
        <Dialog
          open={fileDialogue}
          onClose={handleFileUploadDialogue}
          fullWidth
          maxWidth="sm"
          TransitionComponent={PopupTransition}
          keepMounted
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <AddDriverFileForm handleClose={handleFileUploadDialogue}  />
        </Dialog>

        <CreateDriverTemplate/>
    </>
  );
}
