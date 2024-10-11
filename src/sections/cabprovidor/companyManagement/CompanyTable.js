import PropTypes from 'prop-types';
import {
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  alpha,
  Box,
  Typography,
  Stack,
  Button
} from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Add, ArrowDown2, ArrowRight2 } from 'iconsax-react';
import { Fragment, useCallback, useMemo } from 'react';
import { useExpanded, useTable } from 'react-table';
import { Link, useNavigate } from 'react-router-dom';
import PaginationBox from 'components/tables/Pagination';
import WrapperButton from 'components/common/guards/WrapperButton';
import { MODULE, PERMISSIONS } from 'constant';

const CompanyTable = ({ data, page, setPage, limit, setLimit, lastPageNo }) => {
  const navigate = useNavigate();
  const handleAddCompany = () => {
    navigate('add-company');
  };
  const handleAddCompanyBranch = () => {
    navigate('add-company-branch');
  };

  const columns = useMemo(
    () => [
      {
        Header: () => null,
        id: 'expander',
        className: 'cell-center',
        Cell: ({ row }) => {
          const collapseIcon = row.isExpanded ? <ArrowDown2 size={14} /> : <ArrowRight2 size={14} />;
          let branch = row.original.Branches;
          if (branch?.length > 0) {
            return (
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }} {...row.getToggleRowExpandedProps()}>
                {collapseIcon}
              </Box>
            );
          } else {
            return null;
          }
        },
        SubCell: () => null
      },
      {
        Header: 'Company Name',
        accessor: 'company_name',
        Cell: ({ row, value }) => {
          return (
            <Typography>
              <Link
                to={`/management/company/overview/${row.original._id}`}
                onClick={(e) => e.stopPropagation()} // Prevent interfering with row expansion
                style={{ textDecoration: 'none', color: 'rgb(70,128,255)' }}
              >
                {value}
              </Link>
            </Typography>
          );
        }
      },
      {
        Header: 'Address',
        accessor: 'address'
      },
      {
        Header: 'City',
        accessor: 'city'
      },
      {
        Header: 'State',
        accessor: 'state'
      },

      {
        Header: 'Amount Receivable',
        accessor: 'stateTaxAmount'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          switch (value) {
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

  const renderRowSubComponent = useCallback(({ row, rowProps }) => <SubRowAsync row={row} rowProps={rowProps} />, []);

  return (
    <>
      <Stack direction={'row'} spacing={1} justifyContent="flex-end" alignItems="center" sx={{ p: 0, pb: 3 }}>
        <Stack direction={'row'} alignItems="center" spacing={2}>
          <WrapperButton moduleName={MODULE.COMPANY} permission={PERMISSIONS.CREATE}>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddCompanyBranch} size="small" color="success">
              Add Branch
            </Button>
          </WrapperButton>

          <WrapperButton moduleName={MODULE.COMPANY} permission={PERMISSIONS.CREATE}>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddCompany} size="small">
              Add Company
            </Button>
          </WrapperButton>
        </Stack>
      </Stack>
      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={data} renderRowSubComponent={renderRowSubComponent} />
        </ScrollX>
      </MainCard>
      <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={setLimit} lastPageIndex={lastPageNo} />
    </>
  );
};

CompanyTable.propTypes = {
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

export default CompanyTable;

function SubRowAsync({ row, rowProps }) {
  if (row.original.Branches) {
    return <SubRows row={row} rowProps={rowProps} data={row.original.Branches} />;
  } else {
    return null;
  }
}
SubRowAsync.propTypes = {
  row: PropTypes.object,
  rowProps: PropTypes.any
};

function SubRows({ row, rowProps, data, loading }) {
  const theme = useTheme();

  if (loading) {
    return (
      <>
        {[0, 1, 2].map((item) => (
          <TableRow key={item}>
            <TableCell />
            {[0, 1, 2, 3, 4, 5].map((col) => (
              <TableCell key={col}>
                <Skeleton animation="wave" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  }

  return (
    <>
      {data.map((x, i) => (
        <TableRow {...rowProps} key={`${rowProps.key}-expanded-${i}`} sx={{ bgcolor: alpha(theme.palette.primary.lighter, 0.35) }}>
          {row.cells.map((cell, cellIndex) => {
            const value = cell.column.id === 'company_name' ? x.companyBranchName : cell.column.accessor && cell.column.accessor(x, i);

            return (
              <TableCell key={cellIndex} {...cell.getCellProps([{ className: cell.column.className }])}>
                {cell.render(cell.column.SubCell ? 'SubCell' : 'Cell', {
                  value, // Correctly pass the computed value
                  row: { ...row, original: x }
                })}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}

SubRows.propTypes = {
  row: PropTypes.object,
  rowProps: PropTypes.any,
  data: PropTypes.array,
  loading: PropTypes.bool
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns: userColumns, data, renderRowSubComponent }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable(
    {
      columns: userColumns,
      data
    },
    useExpanded
  );

  return (
    <>
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
            const rowProps = row.getRowProps();

            return (
              <Fragment key={i}>
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
                {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  renderRowSubComponent: PropTypes.any
};
//
