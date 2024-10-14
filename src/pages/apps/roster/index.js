import { useEffect, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Collapse, Dialog, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project-imports
// import UserDetails from 'sections/apps/Main/UserDetails';

import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import { PopupTransition } from 'components/@extended/Transitions';

import { dispatch, useSelector } from 'store';
import { openDrawer } from 'store/reducers/menu';
import navigation from 'menu-items';

// assets
import { Add, Eye, HambergerMenu, InfoCircle } from 'iconsax-react';
import { ThemeMode } from 'config';
import CompanyDrawer from './CompanyDrawer';
import RosterFileList from './RosterFileList';
import BreadcrumbShort from 'components/@extended/BreadcrumbsShort';
import { fetchCompanies } from 'store/slice/cabProvidor/companySlice';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import ViewRosterForm from 'sections/cabprovidor/roster/forms/ViewRosterForm';
import AddRosterFileForm from 'sections/cabprovidor/roster/forms/AddRosterFileForm';

const drawerWidth = 220;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shorter
  }),
  marginLeft: `-${drawerWidth}px`,
  [theme.breakpoints.down('lg')]: {
    paddingLeft: 0,
    marginLeft: 0
  },
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter
    }),
    marginLeft: 0
  })
}));

// ==============================|| APPLICATION - CHAT ||============================== //

const Roster = () => {
  const theme = useTheme();

  const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  const [emailDetails, setEmailDetails] = useState(false);

  const handleUserChange = () => {
    setEmailDetails((prev) => !prev);
  };
  const { companies, loading: listloading } = useSelector((state) => state.companies);
  useEffect(() => {
    if (!listloading) setCompany(companies[0]);
  }, []);

  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        await dispatch(fetchCompanies({ page: 1, limit: 20 }));
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanyList();
  }, [dispatch]); // It's a good practice to include dispatch in the dependency array

  // Close sidebar when window size is below 'md' breakpoint
  useEffect(() => {
    dispatch(openDrawer(false));
    // You no longer need `Promise.all` for a single async call
  }, []);

  useEffect(() => {
    setOpenCompanyListDrawer(!matchDownSM);
  }, [matchDownSM]);
  const [company, setCompany] = useState(null);

  const [openCompanyListDrawer, setOpenCompanyListDrawer] = useState(true);
  const handleDrawerOpen = () => {
    setOpenCompanyListDrawer((prevState) => !prevState);
  };

  useEffect(() => {
    setOpenCompanyListDrawer(!matchDownSM);
  }, [matchDownSM]);

  // const [companyListLoading, setCompanyListLoading] = useState(true);
  // const [companyListLoading,setCompanyListLoading]=useState()

  const [fileDialogue, setFileDialogue] = useState(false);
  const [viewDialogue, setViewDialogue] = useState(false);

  const handleFileUploadDialogue = () => {
    setFileDialogue(!fileDialogue);
  };
  const handleViewUploadDialogue = () => {
    setViewDialogue(!viewDialogue);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      {/*  */}
      <CompanyDrawer
        openCompanyListDrawer={openCompanyListDrawer}
        handleDrawerOpen={handleDrawerOpen}
        setCompany={setCompany}
        selectedUser={company ? (Object.keys(company).length === 0 ? null : company._id) : null}
      />
      {/* <ChatHeader loading={usersLoading} user={user} handleDrawerOpen={handleDrawerOpen} /> */}
      {/*  */}

      <Main theme={theme} open={openCompanyListDrawer}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={emailDetails ? 8 : 12}
            xl={emailDetails ? 9 : 12}
            sx={{
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.shorter + 200
              })
            }}
          >
            <MainCard
              content={false}
              sx={{
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.lighter',
                pt: 2,
                pl: 2,
                borderRadius: emailDetails ? '0' : '0 12px 12px 0',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.shorter + 200
                })
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ bgcolor: 'background.paper', pr: 2, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {/*breadcrumb add roster, view roster buttons view company profile */}

                  <Grid container justifyContent="space-between" spacing={1}>
                    <Grid item display={'flex'} alignItems={'center'}>
                      <IconButton onClick={handleDrawerOpen} color="secondary" size="large">
                        <HambergerMenu />
                      </IconButton>
                      <BreadcrumbShort navigation={navigation} title titleBottom card={false} divider={false} />
                      <Typography variant="subtitle1">{company?.company_name}</Typography>
                    </Grid>

                    <Grid item>
                      <Button startIcon={<Add />} onClick={handleFileUploadDialogue} size="small">
                        Upload File
                      </Button>

                      <Button startIcon={<Eye />} onClick={handleViewUploadDialogue} size="small" color="success">
                        View Roster
                      </Button>

                      <IconButton onClick={handleUserChange} size="large" color={emailDetails ? 'error' : 'secondary'}>
                        {emailDetails ? <Add style={{ transform: 'rotate(45deg)' }} /> : <InfoCircle />}
                      </IconButton>
                    </Grid>

                    {/*  end add roster, view roster buttons view company profile */}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <SimpleBar
                    sx={{
                      overflowX: 'hidden',
                      height: '100vh',
                      minHeight: 420,
                      '& .simplebar-content': {
                        height: '100%'
                      }
                    }}
                  >
                    {/* data to display */}

                    <Box sx={{ pl: 1, pr: 3, height: '100%' }}>
                      {company && Object.keys(company).length === 0 ? (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                          <CircularWithPath />
                        </Stack>
                      ) : (
                        <RosterFileList theme={theme} company={company} handleDrawerOpen={handleDrawerOpen} />
                      )}
                    </Box>
                  </SimpleBar>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          {/* user details drawer */}
          <Grid item xs={12} md={4} xl={3} sx={{ overflow: 'hidden', display: emailDetails ? 'flex' : 'none' }}>
            <Collapse orientation="horizontal" in={emailDetails && !matchDownMD}>
              {/* <CompanyDetails company={company} onClose={handleUserChange} /> */}
            </Collapse>
          </Grid>

          <Dialog TransitionComponent={PopupTransition} onClose={handleUserChange} open={matchDownMD && emailDetails} scroll="body">
            {/* <CompanyDetails company={company} /> */}
          </Dialog>
        </Grid>

        <Dialog
          open={viewDialogue}
          onClose={handleViewUploadDialogue}
          fullWidth
          maxWidth="sm"
          TransitionComponent={PopupTransition}
          keepMounted
          sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
          aria-describedby="alert-dialog-slide-description"
        >
          <ViewRosterForm handleClose={handleViewUploadDialogue} companyName={company?.company_name} companyID={company?._id} />
        </Dialog>

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
          <AddRosterFileForm handleClose={handleFileUploadDialogue} companyName={company?.company_name} companyID={company?._id} />
        </Dialog>
      </Main>
    </Box>
  );
};

export default Roster;
