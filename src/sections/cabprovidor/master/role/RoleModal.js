/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Add } from 'iconsax-react';
import PermissionTable from 'sections/cabprovidor/master/role/PermissionTable';
import { useCallback, useEffect, useState } from 'react';
import axios from 'utils/axios';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const x = {
  Loan: ['Create', 'Read', 'Update'],
  Invoice: ['Create', 'Read']
};

const RoleModal = ({ handleClose, roleId, handleRefetch }) => {
  // const [existedPermissions, setExistedPermissions] = useState(x);
  const [existedPermissions, setExistedPermissions] = useState({});
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const parentFunction = useCallback((data) => {
    setExistedPermissions(data);
  }, []);

  const handleButtonClick = useCallback(async () => {
    // alert('Button clicked');
    console.log(existedPermissions);

    // const payload = {
    //   data: {
    //     role_name: roleName,
    //     role_description: roleDescription,
    //     permissions: existedPermissions
    //   }
    // };

    // console.log('payload', payload);

    let response;
    setIsLoading(true);
    try {
      if (!roleId) {
        // TODO : CREATE API
        const payload = {
          data: {
            role_name: roleName,
            role_description: roleDescription,
            permissions: existedPermissions
          }
        };

        console.log('payload', payload);

        response = await axios.post('/cabProvidersRole2/add', payload);
      } else {
        // TODO : UPDATE API
        const payload = {
          data: {
            _id: roleId,
            role_name: roleName,
            role_description: roleDescription,
            permissions: existedPermissions
          }
        };

        console.log('payload', payload);
        response = await axios.put(`/cabProvidersRole2/edit/permissions`, payload);
      }

      dispatch(
        openSnackbar({
          open: true,
          message: `Role ${roleId ? 'updated' : 'added'} successfully`,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      handleRefetch();
      handleClose();
    } catch (error) {
      console.log('Error at role api = ', error);
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
    } finally {
      setIsLoading(false);
    }
  }, [handleClose, existedPermissions, roleName, roleDescription, roleId, handleRefetch]);

  useEffect(() => {
    if (roleId) {
      (async () => {
        try {
          //   const result = await dispatch(fetchRoleDetails(roleId)).unwrap();
          setIsLoading(true); // Start loading
          // Simulate an API call delay
          // await new Promise((resolve) => setTimeout(resolve, 2000));
          // setRoleName('Admin');
          // setRoleDescription('Admin Role');
          // setExistedPermissions(x);

          const response = await axios.get(`/cabProvidersRole2/all/permission`, {
            params: {
              roleId
            }
          });
          console.log(`🚀 ~ response:`, response);
          if (response.status === 200) {
            const {
              data: { role_name: roleName, role_description: roleDescription, permissions }
            } = response.data;

            console.log({ roleName, roleDescription, permissions });

            setRoleName(roleName);
            setRoleDescription(roleDescription);
            setExistedPermissions(permissions);
          }
        } catch (error) {
          console.log('Fetching role details error = ', error);
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
        } finally {
          setIsLoading(false); // Stop loading
        }
      })();
    }
  }, [roleId]);

  return (
    <>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item>
          <DialogTitle>{roleId ? 'Edit' : 'Add'} Role</DialogTitle>
        </Grid>
        <Grid item sx={{ mr: 1.5 }}>
          <IconButton color="secondary" onClick={handleClose}>
            <Add style={{ transform: 'rotate(45deg)' }} />
          </IconButton>
        </Grid>
      </Grid>

      <DialogContent dividers>
        {isLoading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={2}>
            {/* Role Name */}
            <Stack gap={1}>
              <InputLabel htmlFor="role-name">Role Name</InputLabel>
              <TextField
                id="role-name"
                variant="outlined"
                placeholder="Role Name"
                fullWidth
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </Stack>

            {/* Description */}
            <Stack gap={1}>
              <InputLabel htmlFor="role-description">Description</InputLabel>
              <TextField
                id="role-description"
                variant="outlined"
                placeholder="Description"
                fullWidth
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
              />
            </Stack>
            {/* Permission */}
            <Stack gap={1}>
              <Typography variant="subtitle1">Assign Permission to Roles</Typography>
              <PermissionTable existedPermissions={existedPermissions} parentFunction={parentFunction} />
              {/* <PermissionTable parentFunction={parentFunction} /> */}
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{
            mr: 1,
            cursor: isLoading ? 'not-allowed' : 'pointer', // Show visual feedback
            pointerEvents: isLoading ? 'none' : 'auto' // Prevent pointer events when loading
          }}
          // disabled={isLoading} // Disable button when loading
        >
          {isLoading ? 'Loading...' : roleId ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </>
  );
};

RoleModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  roleId: PropTypes.string,
  handleRefetch: PropTypes.func.isRequired
};

export default RoleModal;
