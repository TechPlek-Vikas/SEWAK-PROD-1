// eslint-disable-next-line no-unused-vars
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import ScrollX from 'components/ScrollX';
import PaginationBox from 'components/tables/Pagination';
import ReactTable from 'components/tables/reactTable/ReactTable';
// eslint-disable-next-line no-unused-vars
import { Edit, Eye, Trash } from 'iconsax-react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { formattedDate } from 'utils/helper';
import MainCard from 'components/MainCard';
import { Link } from 'react-router-dom';
import { USERTYPE } from 'constant';
import { useSelector } from 'react-redux';

const KEYS = {
  [USERTYPE.iscabProvider]: {
    CREATED_AT: 'cabProviderUserId',
    UPDATED_AT: 'cabProviderUserId',
    USERNAME: 'cabProviderUserId',
    ROLE_NAME: 'cabProviderUserRoleId'
  },
  [USERTYPE.isVendor]: {
    CREATED_AT: 'vendorUserId',
    UPDATED_AT: 'vendorUserId',
    USERNAME: 'vendorUserId',
    ROLE_NAME: 'vendorUserRoleId'
  }
};

const UserTable = ({ data, page, setPage, limit, setLimit, lastPageNo }) => {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const mode = theme.palette.mode;
  const userType = useSelector((state) => state.auth.userType);

  const columns = useMemo(
    () => [
      {
        Header: '_id',
        accessor: '_id',
        className: 'cell-center',
        disableSortBy: true
      },
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'User Name',
        accessor: 'userName',
        Cell: ({ row }) => {
          console.log(row.original);
          // const formattedUserName = userName?.charAt(0).toUpperCase() + userName?.slice(1);
          const val = KEYS?.[userType].CREATED_AT;
          console.log(`🚀 ~ UserTable ~ val:`, val);
          const key = row.original[val];
          console.log(`🚀 ~ UserTable ~ key:`, key);
          const userName = key?.['userName'];
          console.log(`🚀 ~ UserTable ~ userName:`, userName);

          //   return <>{userName}</>;
          return (
            <Typography>
              <Link
                to={`/user/overview/${row.original._id}`}
                onClick={(e) => e.stopPropagation()} // Prevent interfering with row expansion
                style={{ textDecoration: 'none' }}
              >
                {userName}
              </Link>
            </Typography>
          );
        }
      },
      {
        Header: 'Role Name',
        accessor: 'role_name',
        Cell: ({ row }) => {
          const val = KEYS?.[userType].ROLE_NAME;
          const key = row.original[val];
          const roleName = key?.['role_name'];
          return <>{roleName}</>;
        }
      },
      {
        Header: 'Manage Permission',
        accessor: 'manage_permission',
        Cell: ({ row }) => {
          return (
            <>
              <Button variant="outlined" size="small" color="info" onClick={() => alert(`Manage Permission = ${row.original._id}`)}>
                Manage Permission
              </Button>
            </>
          );
        }
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        disableSortBy: true,
        Cell: ({ row }) => {
          const val = KEYS?.[userType].CREATED_AT;
          const key = row.original[val];
          const time = key?.['createdAt'];
          return <>{time ? formattedDate(time, 'DD MMMM YYYY, hh:mm A') : ''}</>;
        }
      },
      {
        Header: 'Updated At',
        accessor: 'updatedAt',
        disableSortBy: true,
        Cell: ({ row }) => {
          const val = KEYS?.[userType].UPDATED_AT;
          const key = row.original[val];
          const time = key?.['updatedAt'];
          return <>{time ? formattedDate(time, 'DD MMMM YYYY, hh:mm A') : ''}</>;
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <>
      <Stack gap={1} spacing={1}>
        <ScrollX>
          <MainCard content={false}>
            {/* <ReactTable columns={columns} data={data} hiddenColumns={['userName']} /> */}
            <ReactTable columns={columns} data={data} />
          </MainCard>
        </ScrollX>
        <Box>
          {data.length > 0 && (
            <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={setLimit} lastPageIndex={lastPageNo} />
          )}
        </Box>
      </Stack>
    </>
  );
};

UserTable.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string,
  page: PropTypes.number,
  setPage: PropTypes.func,
  limit: PropTypes.number,
  setLimit: PropTypes.func,
  lastPageNo: PropTypes.number,
  setLastPageNo: PropTypes.func
};

export default UserTable;

// ==============================|| REACT TABLE ||============================== //
