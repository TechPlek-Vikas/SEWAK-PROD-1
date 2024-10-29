import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Box, Checkbox, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// table data
function createData(moduleName, calories, permissions) {
  return {
    moduleName,
    calories,
    permissions
  };
}

const permission_set1 = ['Create', 'Read', 'Update', 'Delete'];
const permission_set2 = ['Create', 'Read'];
const permission_set3 = ['Update', 'Delete'];

const permission_set = ['Create', 'Read', 'Update', 'Delete'];

// table data
const rows = [
  createData('Loan', 305, permission_set1),
  createData('Invoice', 452, permission_set2),
  createData('Advance', 262, permission_set3),
  createData('Reports', 159, permission_set1),
  createData('Zone', 356, permission_set2)
];

console.log('rows = ', rows);

// table header
const headCells = [
  {
    id: 'moduleName',
    numeric: false,
    disablePadding: true,
    label: 'Module Name'
  },
  {
    id: 'calories',
    numeric: true,
    disablePadding: false,
    label: 'Calories'
  },
  {
    id: 'permissions',
    numeric: false,
    disablePadding: true,
    label: 'Permissions'
  }
];

function EnhancedTableHead({ onSelectAllClick, numSelected, rowCount }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ pl: 3 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all modules'
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired
};

// ==============================|| TABLE - ENHANCED ||============================== //

export default function PermissionTable({ existedPermissions = {}, parentFunction = () => {} }) {
  const [selected, setSelected] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState(existedPermissions);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.moduleName);
      const newPermissions = {};
      rows.forEach((row) => {
        newPermissions[row.moduleName] = row.permissions;
      });
      setSelected(newSelected);
      setSelectedPermissions(newPermissions);
      parentFunction(newPermissions);
    } else {
      setSelected([]);
      setSelectedPermissions({});
      parentFunction({});
    }
  };

  const handleClick = (event, moduleName) => {
    const selectedIndex = selected.indexOf(moduleName);
    let newSelected = [];

    const newPermissions = { ...selectedPermissions };

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, moduleName);
      newPermissions[moduleName] = rows.find((row) => row.moduleName === moduleName).permissions;
    } else {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      delete newPermissions[moduleName];
    }

    setSelected(newSelected);
    setSelectedPermissions(newPermissions);
    parentFunction(newPermissions);
  };

  const handlePermissionChange = (event, permission, moduleName) => {
    const newPermissions = { ...selectedPermissions };

    if (event.target.checked) {
      if (!newPermissions[moduleName]) {
        newPermissions[moduleName] = [permission];
      } else if (!newPermissions[moduleName].includes(permission)) {
        newPermissions[moduleName] = [...newPermissions[moduleName], permission];
      }
    } else {
      newPermissions[moduleName] = newPermissions[moduleName].filter((p) => p !== permission);
      if (newPermissions[moduleName].length === 0) {
        delete newPermissions[moduleName];
      }
    }

    setSelectedPermissions(newPermissions);
    parentFunction(newPermissions);

    // Auto-select or deselect the row checkbox based on permission selections
    if (newPermissions[moduleName]?.length === rows.find((row) => row.moduleName === moduleName).permissions.length) {
      if (!selected.includes(moduleName)) {
        setSelected((prev) => [...prev, moduleName]);
      }
    } else {
      setSelected((prev) => prev.filter((name) => name !== moduleName));
    }
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  useEffect(() => {
    console.log('existedPermissions', existedPermissions);

    const xPermissions = Object.fromEntries(rows.map((item) => [item.moduleName, item.permissions]));

    const output = Object.keys(existedPermissions).filter((key) => {
      const yPerms = existedPermissions[key];
      const xPerms = xPermissions[key];

      // Check if both permissions arrays exist, have the same length, and contain the same items
      return xPerms && yPerms.length === xPerms.length && yPerms.every((perm) => xPerms.includes(perm));
    });

    setSelected(output);
  }, [existedPermissions]);

  return (
    <>
      <MainCard content={false} title={`Assign Permission to Roles :: ${Object.keys(existedPermissions).length === 0 ? 'Add' : 'Edit'}`}>
        {/* table */}
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={rows.length} />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.moduleName);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.moduleName)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.moduleName}
                    selected={isItemSelected}
                  >
                    <TableCell sx={{ pl: 3 }} padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.moduleName}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="left">
                      <Stack spacing={1} direction="row">
                        {row.permissions.map((permission, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                            onClick={(event) => event.stopPropagation()} // Prevent row selection
                          >
                            <Checkbox
                              checked={selectedPermissions[row.moduleName]?.includes(permission) || false}
                              onChange={(event) => handlePermissionChange(event, permission, row.moduleName)}
                            />
                            <Typography>{permission}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
      </MainCard>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Selected Permissions:
      </Typography>
      <pre>{JSON.stringify(selectedPermissions, null, 2)}</pre>
    </>
  );
}

PermissionTable.propTypes = {
  existedPermissions: PropTypes.object,
  parentFunction: PropTypes.func
};

/** SUMMARY :
 * - WORKING as expected FOR ADD AND EDIT
 */
