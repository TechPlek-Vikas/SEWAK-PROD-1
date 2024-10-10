/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Button, Dialog, Stack } from '@mui/material';
import Header from 'components/tables/genericTable/Header';
import { Add } from 'iconsax-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import RoleTable from 'sections/cabprovidor/master/role/RoleTable';
import RoleModal from 'sections/cabprovidor/master/role/RoleModal';
import WrapperButton from 'components/common/guards/WrapperButton';
import { MODULE, PERMISSIONS } from 'constant';

const dummyData = [
  {
    _id: 1,
    role_name: 'HR',
    permissions: {
      Dashboard: ['Create', 'Read', 'Update', 'Delete'],
      Roster: ['Create', 'Read', 'Update', 'Delete'],
      Cabs: ['Create', 'Read', 'Update', 'Delete']
    }
  },
  {
    _id: 2,
    role_name: 'MIS',
    permissions: {
      Dashboard: ['Create', 'Read', 'Update', 'Delete'],
      Invoice: ['Create', 'Read', 'Update', 'Delete'],
      Cabs: ['Create', 'Read', 'Update', 'Delete'],
      Loan: ['Create', 'Read']
    }
  }
];

const Role = () => {
  const [open, setOpen] = useState(false);
  const [roleId, setRoleId] = useState(null);

  const handleModalOpen = useCallback(() => {
    setOpen(true);
    setRoleId(null);
  }, []);

  const handleModalClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleChangeRoleId = useCallback((id) => {
    setOpen(true);
    setRoleId(id);
  }, []);

  return (
    <>
      <Stack gap={1} spacing={1}>
        <Header OtherComp={() => <ButtonComponent handleModalOpen={handleModalOpen} />} />
        <RoleTable data={dummyData} handleModalOpen={handleModalOpen} handleChangeRoleId={handleChangeRoleId} />
      </Stack>

      {open && (
        <Dialog
          open={open}
          onClose={handleModalClose}
          scroll="body"
          maxWidth="md"
          fullWidth
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <RoleModal handleClose={handleModalClose} roleId={roleId} />
        </Dialog>
      )}
    </>
  );
};

export default Role;

const ButtonComponent = ({ handleModalOpen }) => {
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <WrapperButton moduleName={MODULE.ROLE} permission={PERMISSIONS.CREATE}>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="small"
            onClick={() => {
              alert('Add Role');
              handleModalOpen();
            }}
          >
            Add Role
          </Button>
        </WrapperButton>
      </Stack>
    </>
  );
};

ButtonComponent.propTypes = {
  handleModalOpen: PropTypes.func.isRequired
};
