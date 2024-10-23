import PropTypes from 'prop-types';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Fragment, useMemo } from 'react';
import { useExpanded, useTable } from 'react-table';
import PaginationBox from 'components/tables/Pagination';
import EmptyTableDemo from 'components/tables/EmptyTable';
import TableSkeleton from 'components/tables/TableSkeleton';

const CompanyRateReactTable = ({ data, page, setPage, limit, setLimit, loading }) => {

  const columns = useMemo(
    () => [
      {
        Header: 'Zone Name',
        accessor: 'zoneNameID.zoneName'
      },
      {
        Header: 'Zone Type',
        accessor: 'zoneTypeID.zoneTypeName'
      },
      {
        Header: 'Vehicle Type',
        accessor: (row) => row.VehicleTypeName?.vehicleTypeName || 'No vehicle type'
      },
      {
        Header: 'Amount',
        accessor: 'cabAmount.amount'
      },
      {
        Header: 'Dual Trip Amount',
        accessor: 'dualTripAmount.amount',
        dataType: 'text'
      },
      {
        Header: 'Guard Price',
        accessor: 'guardPrice',
        dataType: 'text',
        Cell: ({ row }) => {
          const guardValue = row.original.guard;
          return guardValue === 0 ? '0' : row.original.guardPrice;
        }
      }
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
        <div style={{ marginTop: '20px' }}>
          <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={setLimit} />
        </div>
      </Stack>
    </>
  );
};

CompanyRateReactTable.propTypes = {
  data: PropTypes.array,
  row: PropTypes.object,
  isExpanded: PropTypes.bool,
  getToggleRowExpandedProps: PropTypes.func,
  value: PropTypes.string,
  page: PropTypes.number,
  setPage: PropTypes.func,
  limit: PropTypes.number,
  setLimit: PropTypes.func
};

export default CompanyRateReactTable;

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns: userColumns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: userColumns,
      data,
      initialState: {
        hiddenColumns: ['_id', 'zoneDescription']
      }
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
//
