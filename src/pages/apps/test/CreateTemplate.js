import { Button, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { read, utils } from 'xlsx'; // Ensure you have xlsx library installed

const CreateTemplate = ({ file }) => {
  const [templateName, setTemplateName] = useState(''); // Template name
  const [headers, setHeaders] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY'); // Default date format
  const [timeFormat, setTimeFormat] = useState('HH:mm'); // Default time format
  const [tripTypeMapping, setTripTypeMapping] = useState({ pickup: '', drop: '' }); // Mapping for pickup and drop

  const MandatoryFields = [
    {
      name: 'tripDate',
      headerName: 'Trip Date',
      required: true,
      defaultValue: '2022-12-12T00:00:00.000'
    },
    {
      name: 'tripTime',
      headerName: 'Trip Time',
      required: true
    },
    {
      name: 'tripType',
      headerName: 'Trip Type',
      required: true
    },
    {
      name: 'zoneName',
      headerName: 'Zone Name',
      required: true
    },
    {
      name: 'zoneType',
      headerName: 'Zone Type',
      required: true
    },
    {
      name: 'vehicleType',
      headerName: 'Vehicle Type',
      required: true
    },
    {
      name: 'location',
      headerName: 'Location',
      required: false,
      defaultValue: ''
    },
    {
      name: 'guard',
      headerName: 'Guard',
      required: false,
      defaultValue: 0
    },
    {
      name: 'guardPrice',
      headerName: 'Guard Price',
      required: false,
      defaultValue: 0
    },
    {
      name: 'vehicleNumber',
      headerName: 'Vehicle Number',
      required: false,
      defaultValue: ''
    },
    {
      name: 'vehicleRate',
      headerName: 'Vehicle Rate',
      required: false,
      defaultValue: 0
    },
    {
      name: 'addOnRate',
      headerName: 'Add On Rate',
      required: false,
      defaultValue: 0
    },
    {
      name: 'penalty',
      headerName: 'Penalty',
      required: false,
      defaultValue: 0
    },
    {
      name: 'remarks',
      headerName: 'Remarks',
      required: false,
      defaultValue: ''
    }
  ];

  const fetchHeadersFromExcel = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(new Uint8Array(arrayBuffer), { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const rows = utils.sheet_to_json(worksheet, { header: 1, raw: true });

      if (rows.length > 0) {
        const headers = rows[0]; // First row is headers
        console.log('headers', headers);
        setHeaders(headers);
      } else {
        console.warn('No headers found in rows'); // Warn if no headers found
      }
    } catch (error) {
      console.error('Error fetching headers:', error);
    }
  };

  useEffect(() => {
    fetchHeadersFromExcel(file);
  }, [file]);

  return (
    <>
      <DialogTitle>Mapping Column</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Typography>{'Required fields for Roster excel'}</Typography>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Typography>{'Fetched fields from excel'}</Typography>
          </Grid>
        </Grid>

        {MandatoryFields.map((item) => (
          <Grid container spacing={3} xs={12} key={item.name} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} lg={6}>
              <Stack>
                <Typography>{item.headerName}</Typography>
                <Typography variant="body2" color={item.required ? 'error' : 'primary'}>
                  {item.required ? '(Mandatory)' : '(Optional)'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} spacing={3} lg={6}></Grid>
          </Grid>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            console.log('CANCEL');
          }}
          variant="outlined"
          color="error"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            console.log('CONFIRM');
          }}
          variant="contained"
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export default CreateTemplate;
