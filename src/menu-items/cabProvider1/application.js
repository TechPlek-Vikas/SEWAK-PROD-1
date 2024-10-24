// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, DocumentUpload, Eye, MenuBoard } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: MenuBoard,
  view: Eye,
  upload: DocumentUpload,
  invoice: Bill
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const application = {
  id: 'group-application',
  title: <FormattedMessage id="application" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    // Roster
    {
      id: 'roster',
      title: <FormattedMessage id="roster" />,
      type: 'collapse',
      icon: icons.samplePage,
      url: '/apps/roster/dashboard',
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/apps/roster/view',
          // icon: icons.view
        },
        {
          id: 'upload',
          title: <FormattedMessage id="upload" />,
          type: 'item',
          url: '/apps/roster/create',
          // icon: icons.upload
        },

        {
          id: 'test',
          title: <FormattedMessage id="test" />,
          type: 'item',
          url: '/apps/roster/test',
          // icon: icons.samplePage
        }
      ]
    },

    // Invoices
    {
      id: 'invoices',
      title: <FormattedMessage id="invoices" />,
      type: 'collapse',
      url: '/apps/invoices/dashboard',
      icon: icons.invoice,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/apps/invoices/view',
          // icon: icons.view
        },
        {
          id: 'upload',
          title: <FormattedMessage id="upload" />,
          type: 'item',
          url: '/apps/invoices/create',
          // icon: icons.upload
        }
      ]
    }
  ]
};

export default application;
