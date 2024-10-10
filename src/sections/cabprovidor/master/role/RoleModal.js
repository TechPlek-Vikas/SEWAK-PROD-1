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

const x = {
  Loan: ['Create', 'Read', 'Update']
};

const RoleModal = ({ handleClose, roleId }) => {
  // const [existedPermissions, setExistedPermissions] = useState(x);
  const [existedPermissions, setExistedPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const parentFunction = useCallback((data) => {
    setExistedPermissions(data);
  }, []);

  const handleButtonClick = useCallback(() => {
    alert('Button clicked');
    handleClose();
  }, [handleClose]);

  useEffect(() => {
    if (roleId) {
      (async () => {
        try {
          //   const result = await dispatch(fetchRoleDetails(roleId)).unwrap();
          setIsLoading(true); // Start loading
          // Simulate an API call delay
          await new Promise((resolve) => setTimeout(resolve, 7000));
          setExistedPermissions(x);
        } catch (error) {
          console.error(error);
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
              <TextField id="role-name" variant="outlined" placeholder="Role Name" fullWidth />
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
  roleId: PropTypes.string
};

export default RoleModal;
