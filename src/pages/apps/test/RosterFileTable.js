import { Button, Chip, Dialog, MenuItem, Popover, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { PopupTransition } from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import EmptyTableWithoutButton from 'components/tables/EmptyTableWithoutButton';
import PaginationBox from 'components/tables/Pagination';
import PropTypes from 'prop-types';
import { Fragment, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useExpanded, useTable } from 'react-table';
import AddRosterFileForm from './forms/AddRosterFileForm';
import ViewRosterForm from './forms/ViewRosterForm';

const RosterFileTable = ({ data, page, setPage, limit, setLimit, lastPageNo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyID = queryParams.get('companyID');
  const companyName = queryParams.get('companyName');
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [currentRowData, setCurrentRowData] = useState(null); // Hold row data for processing

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTemplateSelect = (event) => {
    setSelectedTemplate(event.target.value);
  };

  const handleProcessFile = () => {
    console.log('Processing file with template:', selectedTemplate);
    console.log('File data:', currentRowData);
    handleClose(); // Close the popover after processing
  };

  const handleMapClick = (event, rowData) => {
    setAnchorEl(event.currentTarget);
    setCurrentRowData(rowData); // Store row data for later use
  };

  const handleViewClick = (rowData) => {
    navigate('/roster/view-roster', { state: { fileData: rowData } });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
        Header: 'Added By',
        accessor: 'addedBy',
        Cell: ({ row }) => {
          return <Typography>{row.original.addedBy?.userName}</Typography>;
        }
      },
      {
        Header: 'Start Date',
        accessor: (row) => (row.startDate ? new Date(row.startDate).toLocaleDateString('en-IN') : '')
      },
      {
        Header: 'End Date',
        accessor: (row) => (row.endDate ? new Date(row.endDate).toLocaleDateString('en-IN') : '')
      },
      {
        Header: 'Roster Url',
        accessor: 'rosterUrl'
      },
      {
        Header: 'Upload Date',
        accessor: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN') : '')
      },
      {
        Header: 'Action',
        accessor: 'isVisited',
        Cell: ({ row }) => {
          const isVisited = row.original.isVisited;
          if (isVisited === 1) {
            return (
              <Chip
                color="success"
                label="View Roster"
                size="small"
                variant="light"
                onClick={() => handleViewClick(row.original)}
                sx={{
                  ':hover': {
                    backgroundColor: 'rgba(0, 255, 5, 0.3)',
                    cursor: 'pointer'
                  }
                }}
              />
            );
          } else if (isVisited === 0) {
            return (
              <>
                <Chip
                  color="error"
                  variant="light"
                  size="small"
                  onClick={(e) => handleMapClick(e, row.original)} // Pass event and row data
                  label="Generate Roster"
                  sx={{
                    ':hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.3)',
                      cursor: 'pointer'
                    }
                  }}
                />
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                 
                >
                  <div style={{ padding: 16 }}>
                    <Select
                      value={selectedTemplate}
                      onChange={handleTemplateSelect}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Template
                      </MenuItem>
                      <MenuItem value="template1">Template 1</MenuItem>
                      <MenuItem value="template2">Template 2</MenuItem>
                      {/* Add more templates as needed */}
                    </Select>
                    <Button
                      onClick={handleProcessFile}
                      variant="contained"
                      color="primary"
                      disabled={!selectedTemplate}
                      style={{ marginTop: 16 }}
                    >
                      Process File
                    </Button>
                  </div>
                </Popover>
              </>
            );
          }
        }
      },
    ],
    [navigate, anchorEl, selectedTemplate] // Add dependencies
  );

  const [fileDialogue, setFileDialogue] = useState(false);
  const [viewDialogue, setViewDialogue] = useState(false);

  const handleFileUploadDialogue = () => {
    setFileDialogue(!fileDialogue);
  };
  const handleViewUploadDialogue = () => {
    setViewDialogue(!viewDialogue);
  };

  return (
    <>
     
      {data.length === 0 ? (
        <EmptyTableWithoutButton />
      ) : (
        <>
          <MainCard content={true}>
            <ScrollX>
              <ReactTable columns={columns} data={data} />
            </ScrollX>
          </MainCard>
          <div style={{ marginTop: '10px' }}>
          <PaginationBox pageIndex={page} gotoPage={setPage} pageSize={limit} setPageSize={setLimit} lastPageIndex={lastPageNo} />
          </div>
        </>
      )}

      <Dialog
        open={viewDialogue}
        onClose={handleViewUploadDialogue}
        fullWidth
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <ViewRosterForm handleClose={handleViewUploadDialogue} companyName={companyName} companyID={companyID} />
      </Dialog>

      <Dialog
        open={fileDialogue}
        onClose={handleFileUploadDialogue}
        fullWidth
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <AddRosterFileForm handleClose={handleFileUploadDialogue} companyName={companyName} companyID={companyID} />
      </Dialog>
    </>
  );
};

RosterFileTable.propTypes = {
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

export default RosterFileTable;

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
