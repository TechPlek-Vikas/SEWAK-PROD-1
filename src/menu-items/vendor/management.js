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

const management = {
  id: 'group-management',
  title: <FormattedMessage id="management" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    // User
    {
      id: 'user',
      title: <FormattedMessage id="user" />,
      type: 'collapse',
      url: '/management/user/dashboard',
      icon: icons.samplePage,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/management/user/view',
          icon: icons.samplePage,
          permissions: {
            [MODULE.USER]: PERMISSIONS.READ
          }
        },
        {
          id: 'create',
          title: <FormattedMessage id="create user" />,
          type: 'item',
          url: '/management/user/add-user',
          icon: icons.samplePage,
          permissions: {
            [MODULE.USER]: PERMISSIONS.CREATE
          }
        }
      ]
    },

    // Company
    {
      id: 'company',
      title: <FormattedMessage id="company" />,
      type: 'collapse',
      url: '/management/company/dashboard',
      icon: icons.samplePage,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/management/company/view',
          icon: icons.samplePage,
          permissions: {
            [MODULE.COMPANY]: PERMISSIONS.READ
          }
        }
      ]
    },

    // Driver
    {
      id: 'driver',
      title: <FormattedMessage id="driver" />,
      type: 'collapse',
      url: '/management/driver/dashboard',
      icon: icons.samplePage,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/management/driver/view',
          icon: icons.samplePage,
          permissions: {
            [MODULE.DRIVER]: PERMISSIONS.READ
          }
        }
      ]
    },

    // Cab
    {
      id: 'cab',
      title: <FormattedMessage id="cab" />,
      type: 'collapse',
      url: '/management/cab/dashboard',
      icon: icons.samplePage,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/management/cab/view',
          icon: icons.samplePage,
          permissions: {
            [MODULE.CAB]: PERMISSIONS.READ
          }
        },
        {
          id: 'create-cab',
          title: <FormattedMessage id="add cab" />,
          type: 'item',
          url: '/management/cab/add-cab',
          icon: icons.samplePage,
          permissions: {
            [MODULE.CAB]: PERMISSIONS.CREATE
          }
        }
      ]
    }
  ]
};

export default management;
