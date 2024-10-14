import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Chip,
  CircularProgress,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';

// import makeData from 'data/react-table';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { Box } from 'iconsax-react';
import axios from 'axios';
import Loader from 'components/Loader';
import { TableNoDataMessage } from 'components/tables/reactTable1/ReactTable';
import { HeaderSort, TablePagination, TableRowSelection } from 'components/tables/reactTable2/ReactTable';
import AddCustomer from './AddCustomer';
import CustomerView from './CustomerView';
import AlertCustomerDelete from './AlertCustomerDelete';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, renderRowSubComponent }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  console.log('data', data);

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'fatherName', desc: false };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    // allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    setGlobalFilter
    // setSortBy,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        hiddenColumns: ['avatar', 'email'],
        sortBy: [sortBy]
      }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['avatar', 'email']);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        </Stack>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column} {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit'
                    }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded &&
                    renderRowSubComponent({
                      row,
                      rowProps,
                      visibleColumns,
                      expanded
                    })}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func,
  renderRowSubComponent: PropTypes.any
};

// ==============================|| CUSTOMER - LIST ||============================== //

const Loan = () => {
  const theme = useTheme();
  // const data = useMemo(() => makeData(200), []);
  const [data, setData] = useState(null);
  const [loading] = useState(null);

  useEffect(() => {
    const fetchdata = async () => {
      const token = localStorage.getItem('serviceToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}company`, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('company', response.data.data.result);
      const result = response.data.data.result.map((company, index) => ({
        id: index + 1,
        company_name: company.company_name,
        totalLoanAmount: `₹${(Math.random() * 10000).toFixed(2)}`,
        totalPaid: `₹${(Math.random() * 5000).toFixed(2)}`,
        totalBalance: `₹${(Math.random() * 5000).toFixed(2)}`,
        loanTerm: `${Math.floor(Math.random() * 10) + 1} years`,
        totalWeek: Math.floor(Math.random() * 52),
        termPaid: Math.floor(Math.random() * 52),
        startDate: '2023-01-01',
        endDate: '2025-12-31',
        status: index % 2 === 0 ? 'Active' : 'Inactive'
      }));
      setData(result);
    };

    fetchdata();
  }, []);

  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [customerDeleteId] = useState('');
  const [add, setAdd] = useState(false);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        Cell: ({ row }) => <span>{row.index + 1}</span> // Use row.index to display incremental number
      },
      {
        Header: 'Vendor Name',
        accessor: (row) => ({
          company_name: row.company_name
        }),
        Cell: ({ row }) => {
          const { company_name } = row.original; // Access the original row data directly
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={3}>
                <Typography variant="subtitle1">
                  <a href={`/company/${company_name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {company_name}
                  </a>
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Total Loan Amount',
        accessor: 'totalLoanAmount'
      },
      {
        Header: 'Total Paid',
        accessor: 'totalPaid' //dummy
      },
      {
        Header: 'Total Balance',
        accessor: 'totalBalance' //dummy
      },
      {
        Header: 'Loan Term',
        accessor: 'loanTerm' //dummy
      },
      {
        Header: 'Total week',
        accessor: 'totalWeek' //dummy
      },
      {
        Header: 'Payment Term Paid',
        accessor: 'termPaid' //dummy
      },
      {
        Header: 'Start Date',
        accessor: 'startDate' //dummy
      },
      {
        Header: 'End Date',
        accessor: 'endDate' //dummy
      },
      {
        Header: 'Loan Status',
        accessor: 'status',
        Cell: ({ value }) => {
          switch (value) {
            case 'Active':
              return <Chip color="success" label="Active" size="small" variant="light" />;
            case 'Inactive':
              return <Chip color="error" label="Inactive" size="small" variant="light" />;
            default:
              return <Chip color="info" label="Single" size="small" variant="light" />;
          }
        }
      }
    ],

    [theme]
  );

  const renderRowSubComponent = useCallback(({ row }) => <CustomerView data={data[Number(row.id)]} />, [data]);

  if (!data) return <Loader />;
  return (
    <MainCard content={false}>
      <ScrollX>
        {loading ? (
          <Box
            sx={{
              height: '100vh',
              width: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
          <ReactTable columns={columns} data={data} handleAdd={handleAdd} renderRowSubComponent={renderRowSubComponent} />
        ) : (
          <TableNoDataMessage text="No Loan Details Found" />
        )}
      </ScrollX>
      <AlertCustomerDelete title={customerDeleteId} open={open} handleClose={handleClose} />
      {/* add customer dialog */}
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <AddCustomer customer={customer} onCancel={handleAdd} />
      </Dialog>
    </MainCard>
  );
};

export default Loan;
