// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Calendar1 } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: Calendar1
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const invoice = {
  id: 'invoices',
  title: <FormattedMessage id="invoices" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'invoice',
      title: <FormattedMessage id="invoice" />,
      type: 'item',
      url: '/invoices/invoice',
      icon: icons.samplePage,
      permissions: {
        [MODULE.INVOICE]: PERMISSIONS.READ
      }
    },
    {
      id: 'loans',
      title: <FormattedMessage id="loans" />,
      type: 'item',
      url: '/invoices/loans',
      icon: icons.samplePage,
      permissions: {
        [MODULE.LOAN]: PERMISSIONS.READ
      }
    },
    {
      id: 'advance',
      title: <FormattedMessage id="advance" />,
      type: 'item',
      url: '/invoices/advance',
      icon: icons.samplePage,
      permissions: {
        [MODULE.ADVANCE]: PERMISSIONS.READ
      }
    }
  ]
};

export default invoice;
