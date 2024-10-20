// eslint-disable-next-line no-unused-vars
import { Box, Chip, Stack, Typography } from '@mui/material';
import ScrollX from 'components/ScrollX';
import PaginationBox from 'components/tables/Pagination';
import ReactTable from 'components/tables/reactTable/ReactTable';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { formattedDate } from 'utils/helper';
import MainCard from 'components/MainCard';
import { Link } from 'react-router-dom';
import TableSkeleton from 'components/tables/TableSkeleton';
import EmptyTableDemo from 'components/tables/EmptyTable';

const DriverTable = ({ data, page, setPage, limit, setLimit, lastPageNo, loading }) => {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const mode = theme.palette.mode;
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
        Header: 'Driver Name',
        accessor: 'userName',
        Cell: ({ row, value }) => {
          const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
          return (
            <Typography>
              <Link
                to={`/management/driver/overview/${row.original._id}`}
                onClick={(e) => e.stopPropagation()} // Prevent interfering with row expansion
                style={{ textDecoration: 'none' }}
              >
               {formattedValue}
              </Link>
            </Typography>
          );
        }
      },
      {
        Header: 'Email',
        accessor: 'userEmail',
        disableSortBy: true
      },
      {
        Header: 'Contact Number',
        accessor: 'contactNumber',
        disableSortBy: true
      },
      {
        Header: 'Vehicles',
        accessor: 'assignedVehicle',
        Cell: ({ row }) => {
          const assignedVehicle = row.original.assignedVehicle;
          const cabNo = assignedVehicle ? assignedVehicle.vehicleId.vehicleNumber : null; // accessing vehicleNumber if assigned

          if (!assignedVehicle) {
            return (
              <Chip
                color="error"
                variant="light"
                size="small"
                label="Not Assigned"
                // sx={{
                //   ':hover': {
                //     backgroundColor: 'rgba(255, 0, 0, 0.3)'
                //     // cursor: 'pointer'
                //   }
                // }}
                // onClick={() => handleOpenPendingDialog(row.original)}
              />
            );
          } else {
            return <Chip color="success" label={cabNo} size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        disableSortBy: true,
        Cell: ({ row }) => {
          const { values } = row;
          const time = values['createdAt'];
          return <>{time ? formattedDate(time, 'DD MMMM YYYY, hh:mm A') : ''}</>;
        }
      }
      //   {
      //     Header: 'Actions',
      //     className: 'cell-center',
      //     disableSortBy: true,
      //     Cell: ({ row }) => {
      //       const driverID = row.original._id;
      //       return (
      //         <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      //           <Tooltip
      //             componentsProps={{
      //               tooltip: {
      //                 sx: {
      //                   backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
      //                   opacity: 0.9
      //                 }
      //               }
      //             }}
      //             title="View"
      //           >
      //             <IconButton
      //               color="secondary"
      //               onClick={(e) => {
      //                 e.stopPropagation();
      //                 navigate(`/driver-overview/${driverID}`);
      //               }}
      //             >
      //               <Eye /> {/* Replace this with your collapseIcon if needed */}
      //             </IconButton>
      //           </Tooltip>

      //           <Tooltip
      //             componentsProps={{
      //               tooltip: {
      //                 sx: {
      //                   backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
      //                   opacity: 0.9
      //                 }
      //               }
      //             }}
      //             title="Edit"
      //           >
      //             <IconButton
      //               color="primary"
      //               onClick={(e) => {
      //                 e.stopPropagation();
      //                 console.log('Id = ', row.values._id);
      //                 navigate(`/driver-management/edit/${row.values._id}`);
      //                 dispatch(handleOpen(ACTION.EDIT));
      //                 dispatch(setSelectedID(row.values._id));
      //               }}
      //             >
      //               <Edit />
      //             </IconButton>
      //           </Tooltip>

      //           <Tooltip
      //             componentsProps={{
      //               tooltip: {
      //                 sx: {
      //                   backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
      //                   opacity: 0.9
      //                 }
      //               }
      //             }}
      //             title="Delete"
      //           >
      //             <IconButton
      //               color="error"
      //               onClick={(e) => {
      //                 e.stopPropagation();
      //                 console.log(`🚀 ~ row.values.id:`, row.values);
      //                 // dispatch(handleOpen(ACTION.DELETE));
      //                 // dispatch(setDeletedName(row.values["userName"]));
      //                 // dispatch(setSelectedID(row.values._id));
      //               }}
      //             >
      //               <Trash />
      //             </IconButton>
      //           </Tooltip>
      //         </Stack>
      //       );
      //     }
      //   }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <>
      <Stack gap={1} spacing={1}>
        <ScrollX>
          <MainCard content={false}>
            <ScrollX>
              {loading ? (
                <TableSkeleton rows={10} columns={6} />
              ) : data?.length === 0 ? (
                <EmptyTableDemo />
              ) : (
                <ReactTable columns={columns} data={data} />
              )}
            </ScrollX>
          </MainCard>
        </ScrollX>
        <Box>
          {data.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={setLimit} lastPageIndex={lastPageNo} />
            </div>
          )}
        </Box>
      </Stack>
    </>
  );
};

DriverTable.propTypes = {
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

export default DriverTable;
