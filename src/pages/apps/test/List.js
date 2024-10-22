import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

// material-ui
import {
  Box,
  Chip,
  Tabs,
  Tab,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

// project-imports
import Loader from 'components/Loader';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { CSVExport, HeaderSort, IndeterminateCheckbox, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import AlertColumnDelete from 'sections/apps/kanban/Board/AlertColumnDelete';

import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { alertPopupToggle, getInvoiceDelete, getInvoiceList } from 'store/reducers/invoice';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';

// assets
import { Edit, Eye, Trash } from 'iconsax-react';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import * as XLSX from 'xlsx';
import moment from 'moment';
const avatarImage = require.context('assets/images/users', true);

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'status', value: '' }],
      hiddenColumns: ['avatar', 'email'],
      pageIndex: 0,
      pageSize: 5
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      initialState
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const componentRef = useRef(null);

  // ================ Tab ================

  const groups = ['All', ...new Set(data.map((item) => item.status))];
  const countGroup = data.map((item) => item.status);
  const counts = countGroup.reduce(
    (acc, value) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('status', activeTab === 'All' ? '' : activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <>
      <Box sx={{ p: 3, pb: 0, width: '100%' }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {groups.map((status, index) => (
            <Tab
              key={index}
              label={status}
              value={status}
              icon={
                <Chip
                  label={
                    status === 'All'
                      ? data.length
                      : status === 'Paid'
                      ? counts.Paid
                      : status === 'Unpaid'
                      ? counts.Unpaid
                      : counts.Cancelled
                  }
                  color={status === 'All' ? 'primary' : status === 'Paid' ? 'success' : status === 'Unpaid' ? 'warning' : 'error'}
                  variant="light"
                  size="small"
                />
              }
              iconPosition="end"
            />
          ))}
        </Tabs>
      </Box>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        </Stack>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={matchDownSM ? 1 : 2}>
          <>
            {headerGroups.map((group) => (
              <Stack key={group} direction={matchDownSM ? 'column' : 'row'} spacing={2} {...group.getHeaderGroupProps()}>
                {group.headers.map(
                  (column) =>
                    column.canFilter && (
                      <Box key={column} {...column.getHeaderProps([{ className: column.className }])}>
                        {column.render('Filter')}
                      </Box>
                    )
                )}
              </Stack>
            ))}
          </>
          <CSVExport data={data} filename={'invoice-list.csv'} />
        </Stack>
      </Stack>
      <Box ref={componentRef}>
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
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
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
      </Box>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| INVOICE - LIST ||============================== //

const ViewRosterTest = () => {
  const [loading, setLoading] = useState(true);
  const { alertPopup } = useSelector((state) => state.invoice);
  const location = useLocation();
  const { fileData, selectedValue } = location.state || {}; // Destructure fileData and selectedValue from location state
  const navigate = useNavigate();
  const [excelData, setExcelData] = useState(null); // State to hold parsed Excel data

  // Extract the required headers from mappedData in selectedValue
  const requiredHeaders = Object.values(selectedValue?.mappedData);

  // Fetch Excel data when rosterUrl is available
  useEffect(() => {
    if (fileData?.rosterUrl) {
      fetchExcelData(fileData.rosterUrl);
    }
  }, [fileData?.rosterUrl]);

  // Function to fetch and parse the Excel file from the URL
  const fetchExcelData = async (url) => {
    try {
      const response = await fetch(url); // Fetch the Excel file
      const data = await response.arrayBuffer(); // Convert to binary data
      const workbook = XLSX.read(data, { type: 'array' }); // Read the workbook
      const sheetName = workbook.SheetNames[0]; // Get the first sheet name
      const sheet = workbook.Sheets[sheetName]; // Get the sheet by name
      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]; // Extract headers

      checkHeaders(headers, sheet); // Check if required headers are present
    } catch (error) {
      console.error('Error fetching or parsing Excel file:', error);
    }
  };

  // Function to check if the Excel file contains all required headers
  const checkHeaders = (headers, sheet) => {
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header)); // Find missing headers

    if (missingHeaders.length > 0) {
      // If any headers are missing, show an alert and navigate back
      alert(`Missing headers: ${missingHeaders.join(', ')}`);
      navigate(-1);
    } else {
      // Otherwise, map the data to mapped keys
      mapDataToMappedKeys(sheet, headers);
    }
  };

  // Function to map data rows based on the mappedData keys
  const mapDataToMappedKeys = (sheet, headers) => {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Extract rows (including header)
    const dataRows = rows.slice(1); // Exclude header row

    const mappedRows = dataRows.map((row) => {
      const rowObject = {}; // Object to hold mapped row data
      const mappedData = selectedValue?.mappedData; // Mapped key-value pairs
      const dateFormat = selectedValue?.dateFormat; // Date format
      const timeFormat = selectedValue?.timeFormat; // Time format
      const pickupType = selectedValue?.pickupType; // Pickup type value
      const dropType = selectedValue?.dropType; // Drop type value

      // Iterate over each mappedData key
      Object.keys(mappedData).forEach((key) => {
        const excelHeader = mappedData[key]; // Get the corresponding Excel header
        const headerIndex = headers.indexOf(excelHeader); // Find the index of the header in Excel

        if (headerIndex !== -1) {
          let value = row[headerIndex]; // Get the cell value at headerIndex

          // Format tripDate based on provided dateFormat
          if (key === 'tripDate' && value) {
            value = moment(value, ['MM-DD-YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY']).format(dateFormat);
          }

          // Format tripTime based on provided timeFormat
          if (key === 'tripTime' && value) {
            value = moment(value, ['HH:mm', 'HH:mm:ss', 'h:mm A']).format(timeFormat);
          }

          // Convert tripType to pickupType or dropType
          if (key === 'tripType') {
            if (value.toLowerCase() === 'pickup') {
              value = pickupType;
            } else if (value.toLowerCase() === 'drop') {
              value = dropType;
            }
          }

          // Assign the value to rowObject
          rowObject[key] = value;
        }
      });

      return rowObject; // Return the mapped row object
    });

    setExcelData(mappedRows); // Update the state with the mapped data
  };
  //
  console.log('excelData', excelData);

  useEffect(() => {
    dispatch(getInvoiceList()).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [invoiceId, setInvoiceId] = useState(0);
  const [getInvoiceId, setGetInvoiceId] = useState(0);

  const dummyData = [
    {
      id: 1,
      customer_name: 'John Doe',
      email: 'john.doe@example.com',
      date: '2024-09-01',
      due_date: '2024-10-01',
      quantity: 10,
      status: 'Paid',
      avatar: 1
    },
    {
      id: 2,
      customer_name: 'Jane Smith',
      email: 'jane.smith@example.com',
      date: '2024-09-05',
      due_date: '2024-10-05',
      quantity: 5,
      status: 'Unpaid',
      avatar: 2
    },
    {
      id: 3,
      customer_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      date: '2024-09-10',
      due_date: '2024-10-10',
      quantity: 20,
      status: 'Cancelled',
      avatar: 3
    },
    {
      id: 4,
      customer_name: 'Alice Williams',
      email: 'alice.williams@example.com',
      date: '2024-09-12',
      due_date: '2024-10-12',
      quantity: 8,
      status: 'Paid',
      avatar: 4
    },
    {
      id: 5,
      customer_name: 'Steve Brown',
      email: 'steve.brown@example.com',
      date: '2024-09-15',
      due_date: '2024-10-15',
      quantity: 12,
      status: 'Unpaid',
      avatar: 5
    }
  ];

  const navigation = useNavigate();
  const handleClose = (status) => {
    if (status) {
      dispatch(getInvoiceDelete(invoiceId));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Column deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
    dispatch(
      alertPopupToggle({
        alertToggle: false
      })
    );
  };

  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        Header: ({ getToggleAllPageRowsSelectedProps }) => <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />,
        accessor: 'selection',
        Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Invoice Id',
        accessor: 'id',
        className: 'cell-center',
        disableFilters: true
      },
      {
        Header: 'User Name',
        accessor: 'customer_name',
        disableFilters: true,
        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar alt="Avatar" size="sm" src={avatarImage(`./avatar-${!values.avatar ? 1 : values.avatar}.png`)} />
              <Stack spacing={0}>
                <Typography variant="subtitle1">{values.customer_name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {values.email}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Avatar',
        accessor: 'avatar',
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Email',
        accessor: 'email',
        disableFilters: true
      },
      {
        Header: 'Create Date',
        accessor: 'date'
      },
      {
        Header: 'Due Date',
        accessor: 'due_date'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        disableFilters: true
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
        filter: 'includes',
        Cell: ({ value }) => {
          switch (value) {
            case 'Cancelled':
              return <Chip color="error" label="Cancelled" size="small" variant="light" />;
            case 'Paid':
              return <Chip color="success" label="Paid" size="small" variant="light" />;
            case 'Unpaid':
            default:
              return <Chip color="info" label="Unpaid" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigation(`/apps/invoice/details/${row.values.id}`);
                  }}
                >
                  <Eye />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigation(`/apps/invoice/edit/${row.values.id}`);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInvoiceId(row.values.id);
                    setGetInvoiceId(row.values.invoice_id); // row.original
                    dispatch(
                      alertPopupToggle({
                        alertToggle: true
                      })
                    );
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Roster', to: '/apps/roster/test' }, { title: 'Create Roster' }];

  if (loading) return <Loader />;

  return (
    <>
      <Breadcrumbs custom heading="Create Roster" links={breadcrumbLinks} />

      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={dummyData} />
        </ScrollX>
      </MainCard>
      <AlertColumnDelete title={`${getInvoiceId}`} open={alertPopup} handleClose={handleClose} />
    </>
  );
};

ViewRosterTest.propTypes = {
  row: PropTypes.object,
  values: PropTypes.object,
  email: PropTypes.string,
  avatar: PropTypes.node,
  customer_name: PropTypes.string,
  invoice_id: PropTypes.string,
  id: PropTypes.number,
  value: PropTypes.object,
  toggleRowExpanded: PropTypes.func,
  isExpanded: PropTypes.bool,
  getToggleAllPageRowsSelectedProps: PropTypes.func,
  getToggleRowSelectedProps: PropTypes.func
};

export default ViewRosterTest;
