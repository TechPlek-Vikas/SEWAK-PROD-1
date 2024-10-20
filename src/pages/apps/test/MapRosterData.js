import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { MandatoryFields } from 'utils/ExcelSheetFormat';

export default function MapRosterFileTest() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {MandatoryFields.map((item) => (
        <Grid
          container
          display={'flex'}
          flexDirection={'column'}
          spacing={3}
          xs={12}
          key={item.name}
          sx={{ padding: 3, marginBottom: 2, fontSize: 10 }}
        >
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
      {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Header 1</TableCell>
              <TableCell align="right">Header 2</TableCell>
              <TableCell align="right">Header 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Row 1 Col 1
              </TableCell>
              <TableCell align="right">Row 1 Col 2</TableCell>
              <TableCell align="right">Row 1 Col 3</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Row 2 Col 1
              </TableCell>
              <TableCell align="right">Row 2 Col 2</TableCell>
              <TableCell align="right">Row 2 Col 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer> */}
    </Box>
  );

  return (
    <div>
      {['left', 'right', 'top', 'bottom'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
