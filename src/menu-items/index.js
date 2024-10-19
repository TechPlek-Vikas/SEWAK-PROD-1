/* eslint-disable no-unused-vars */
// project-imports

import invoice from './cabProvider/invoices';
import management from './cabProvider/management';
import master from './cabProvider/master';
import reports from './cabProvider/reports';
import roster from './cabProvider/roster';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [roster, management, invoice, reports, master]
  // items: [roster]
};

export default menuItems;
