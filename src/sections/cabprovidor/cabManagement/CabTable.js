// eslint-disable-next-line no-unused-vars
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import ScrollX from 'components/ScrollX';
import PaginationBox from 'components/tables/Pagination';
import ReactTable from 'components/tables/reactTable/ReactTable';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { formattedDate } from 'utils/helper';
import MainCard from 'components/MainCard';
import { Link } from 'react-router-dom';
import EmptyTableDemo from 'components/tables/EmptyTable';
import TableSkeleton from 'components/tables/TableSkeleton';

const CabTable = ({ data, page, setPage, limit, setLimit, lastPageNo,loading }) => {
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
        Cell: ({ row }) => <span>{row.index + 1}</span>
      },
      {
        Header: 'Cab Name',
        accessor: 'vehicleName',
        disableSortBy: true,
        Cell: ({ value }) => {
          const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
          return (
            <Typography>
              <Link
                // to={`/cab/overview/${row.original._id}`}
                // onClick={(e) => e.stopPropagation()} // Prevent interfering with row expansion
                style={{ textDecoration: 'none' }}
              >
                {formattedValue}
              </Link>
            </Typography>
          );
        }
      },
      {
        Header: 'Cab Type',
        accessor: 'vehicleTypeName'
      },
      {
        Header: 'Cab Number',
        accessor: 'vehicleNumber',
        disableSortBy: true
      },
      {
        Header: 'Driver',
        accessor: 'assignedDriver',
        Cell: ({ row }) => {
          const assignedDrivers = row.original.assignedDriver;

          if (!assignedDrivers || assignedDrivers.length === 0) {
            return <Chip color="error" variant="light" size="small" label="Not Assigned" />;
          } else {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {assignedDrivers.map((driver, index) => (
                  <Chip
                    key={index}
                    color="success"
                    label={driver.driverId?.userName || 'Unknown'} // show individual driver name
                    size="small"
                    variant="light"
                    sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', width: '100%' }}
                  />
                ))}
              </div>
            );
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
      //             title="Edit"
      //           >
      //             <IconButton
      //               color="primary"
      //               onClick={(e) => {
      //                 e.stopPropagation();
      //                 console.log('Id = ', row.values._id);
      //                 navigate(`/vehicle-management/edit/${row.values._id}`);
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
      //                 dispatch(handleOpen(ACTION.DELETE));
      //                 dispatch(setDeletedName(row.values['vehicleName']));
      //                 dispatch(setSelectedID(row.values._id));
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
    []
  );

  return (
    <>
      <Stack gap={1} spacing={1}>
        <MainCard content={false}>
          <ScrollX>
              {loading ? (
                <TableSkeleton rows={10} columns={5} />
              ) : data?.length === 0 ? (
                <EmptyTableDemo />
              ) : (
                <ReactTable columns={columns} data={data} />
              )}
            </ScrollX>
        </MainCard>
        <Box>
          {data.length > 0 && (
            <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={setLimit} lastPageIndex={lastPageNo} />
          )}
        </Box>
      </Stack>
    </>
  );
};

CabTable.propTypes = {
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

export default CabTable;

// ==============================|| REACT TABLE ||============================== //
