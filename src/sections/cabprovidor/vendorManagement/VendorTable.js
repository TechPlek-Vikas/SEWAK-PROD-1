import PropTypes from 'prop-types';
import { Box, Button, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Fragment, useMemo } from 'react';
import { useExpanded, useTable } from 'react-table';
import { Link, useNavigate } from 'react-router-dom';
import PaginationBox from 'components/tables/Pagination';
import Header from 'components/tables/genericTable/Header';
import { Add } from 'iconsax-react';
import WrapperButton from 'components/common/guards/WrapperButton';
import { MODULE, PERMISSIONS } from 'constant';

const VendorTable = ({ data, page, setPage, limit, setLimit, lastPageNo }) => {
  const columns = useMemo(
    () => [
      {
        Header: '#',
        className: 'cell-center',
        accessor: 'id',
        Cell: ({ row }) => {
          return <Typography>{row.index + 1}</Typography>;
        }
      },
      {
        Header: 'Name',
        accessor: 'vendorCompanyName',
        Cell: ({ row, value }) => {
          return (
            <Typography>
              <Link
                to={`/management/vendor/overview/${row.original.vendorId}`}
                onClick={(e) => e.stopPropagation()} // Prevent interfering with row expansion
                style={{ textDecoration: 'none' }}
              >
                {value}
              </Link>
            </Typography>
          );
        }
      },
      {
        Header: 'Address',
        accessor: 'officeAddress'
      },
      {
        Header: 'State',
        accessor: 'officeState'
      },
      {
        Header: 'Vehicles',
        accessor: 'totalVehicle'
      },
      {
        Header: 'Drivers',
        accessor: 'totalDrivers'
      },
      {
        Header: 'Status',
        accessor: 'vendorDetails',
        Cell: ({ value }) => {
          switch (value.userStatus) {
            case 0:
              return <Chip color="error" label="Inactive" size="small" variant="light" />;
            case 1:
              return <Chip color="success" label="Active" size="small" variant="light" />;
            default:
              return <Chip color="info" label="Not Defined" size="small" variant="light" />;
          }
        }
      }
    ],
    []
  );

  return (
    <>
      <Stack gap={1} spacing={1}>
        <Header OtherComp={() => <ButtonComponent />} />
        <MainCard content={false}>
          <ScrollX>
            <ReactTable columns={columns} data={data} />
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

VendorTable.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string,
  page: PropTypes.number,
  setPage: PropTypes.func,
  limit: PropTypes.number,
  setLimit: PropTypes.func,
  lastPageNo: PropTypes.number
};

export default VendorTable;

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns: userColumns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: userColumns,
      data
    },
    useExpanded
  );

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);

          return (
            <Fragment key={i}>
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any
};

const ButtonComponent = () => {
  const navigate = useNavigate();
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <WrapperButton moduleName={MODULE.VENDOR} permission={PERMISSIONS.CREATE}>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('add-vendor')} size="small">
            Add Vendor
          </Button>
        </WrapperButton>
      </Stack>
    </>
  );
};
