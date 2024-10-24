import PropTypes from 'prop-types';
import { useMemo, useState, forwardRef, useEffect } from 'react';

// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// third-party
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

// project-imports
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';

import makeData from 'data/react-table';
// material-ui
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { Add } from 'iconsax-react';
import CSVExport from 'components/third-party/CSVExport';
import CellEditable from 'components/third-party/CellEditable';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AssignTripsDialog({ data: tripData, open, handleClose, handleAssignTrips }) {
  // const [data, setData] = useState(() => makeData(10));
  console.log({ tripData });
  const [data, setData] = useState([]);

  useEffect(() => {
    if (tripData && tripData.length > 0) {
      const mappedData = tripData.map((item) => ({
        ...item, // Spread existing properties
        discount_1: 0, // Add discount key with default value null
        penalty_1: 0, // Add penalty key with default value null
        dualTrip_1: 0,
        guard_1: 0,
        revenue_1: 0,
        incoming_price_1: {
          additionalCharge: 0, // Add additionalCharge key with default value null
          guardPrice: 0, // Add guardPrice key with default value null
          companyRate: 0, // Add vehicleRate key with default value null
          penalty: 0,
          totalAmount: 0
        },
        outGoing_price_1: {
          additionalCharge: 0, // Add additionalCharge key with default value null
          guardPrice: 0, // Add guardPrice key with default value null
          companyRate: 0, // Add vehicleRate key with default value null
          penalty: 0,
          totalAmount: 0
        },
        taxInformation_1: {
          additionalCharge: 0, // Add additionalCharge key with default value null
          guardPrice: 0, // Add guardPrice key with default value null
          companyRate: 0, // Add vehicleRate key with default value null
          penalty: 0,
          totalAmount: 0
        },
        cabInformation_1: {
          driver_OR_vendor: {
            _id: null, // Add driver id with default value null
            userName: null, // Add driver name with default value null
            incoming: 0,
            outgoing: 0,
            tax: 0
          },
          vehicle: {
            _id: null, // Add vehicle id with default value null
            vehicleNumber: null, // Add vehicle number with default value null
            incoming: 0,
            outgoing: 0,
            tax: 0
          }
        }
      }));
      setData(mappedData);
    }
  }, [tripData]);

  console.log({ data });
  const columns = useMemo(
    () => [
      {
        header: 'Date',
        accessorKey: 'tripDate',
        dataType: 'date'
      },
      {
        header: 'Time',
        accessorKey: 'tripTime',
        dataType: 'plain_text'
      },
      {
        header: 'Zone Name',
        accessorKey: 'zoneName',
        dataType: 'zoneName'
      },
      {
        header: 'Zone Type',
        accessorKey: 'zoneType',
        dataType: 'zoneName'
      },
      {
        header: 'Vehicle Type',
        accessorKey: 'vehicleType',
        dataType: 'zoneName'
      },
      {
        header: 'Dual Trip',
        accessorKey: 'guard',
        dataType: 'checkbox',
        meta: {
            className: 'cell-center'
          }
      },
      {
        header: 'Guard',
        accessorKey: 'guard',
        dataType: 'checkbox',
        meta: {
            className: 'cell-center'
          }
      },
      {
        header: 'Visits',
        accessorKey: 'visits',
        dataType: 'text',
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        dataType: 'select'
      }
      //   {
      //     header: 'Profile Progress',
      //     accessorKey: 'progress',
      //     dataType: 'progress'
      //   }
    ],
    []
  );

  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <Add style={{ transform: 'rotate(45deg)' }} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              Assign New Trips
            </Typography>
            <Button color="primary" variant="contained" onClick={handleAssignTrips}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <ReactTable {...{ data, columns, setData }} />
      </Dialog>
    </>
  );
}
// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, setData }) {
  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      cell: CellEditable
    },
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value
              };
            }
            return row;
          })
        );
      }
    },
    debugTable: true
  });

  let headers = [];
  table.getAllColumns().map(
    (columns) =>
      // @ts-ignore
      columns.columnDef.accessorKey &&
      headers.push({
        label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
        // @ts-ignore
        key: columns.columnDef.accessorKey
      })
  );

  return (
    //   <MainCard
    //     content={false}
    //     title="Editable Cell"
    //     secondary={
    //       <CSVExport {...{ data: table.getRowModel().flatRows.map((row) => row.original), headers, filename: 'editable-cell.csv' }} />
    //     }
    //   >
    <ScrollX>
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} {...header.column.columnDef.meta}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell sx={{ p: 0 }} key={cell.id} {...cell.column.columnDef.meta}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ScrollX>
    //   </MainCard>
  );
}
ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
