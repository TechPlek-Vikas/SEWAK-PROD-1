// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Calendar1 } from 'iconsax-react';

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
      icon: icons.samplePage
    },
    {
      id: 'loans',
      title: <FormattedMessage id="loans" />,
      type: 'item',
      url: '/invoices/loans',
      icon: icons.samplePage
    },
    {
      id: 'advance',
      title: <FormattedMessage id="advance" />,
      type: 'item',
      url: '/invoices/advance',
      icon: icons.samplePage
    }
  ]
};

export default invoice;
