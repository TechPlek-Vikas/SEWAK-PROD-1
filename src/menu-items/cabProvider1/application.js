// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { MenuBoard } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: MenuBoard
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
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/apps/roster/view',
          icon: icons.samplePage,
          permissions: {
            [MODULE.ROSTER]: PERMISSIONS.READ
          }
        },
        {
          id: 'upload',
          title: <FormattedMessage id="upload" />,
          type: 'item',
          url: '/apps/roster/create',
          icon: icons.samplePage,
          permissions: {
            [MODULE.ROSTER]: PERMISSIONS.CREATE
          }
        }
      ]
    },

    // Invoices
    {
      id: 'invoices',
      title: <FormattedMessage id="invoices" />,
      type: 'collapse',
      url: '/apps/invoices/dashboard',
      icon: icons.samplePage,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/apps/invoices/view',
          icon: icons.samplePage,
          permissions: {
            [MODULE.INVOICE]: PERMISSIONS.READ
          }
        },
        {
          id: 'upload',
          title: <FormattedMessage id="upload" />,
          type: 'item',
          url: '/apps/invoices/create',
          icon: icons.samplePage,
          permissions: {
            [MODULE.INVOICE]: PERMISSIONS.CREATE
          }
        }
      ]
    }
  ]
};

export default application;
