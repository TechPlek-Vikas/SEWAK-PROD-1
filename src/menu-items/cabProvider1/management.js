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
          icon: icons.samplePage
        },
        {
          id: 'create',
          title: <FormattedMessage id="create user" />,
          type: 'item',
          url: '/management/user/add-user',
          icon: icons.samplePage
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
          icon: icons.samplePage
        },
        {
          id: 'create-company',
          title: <FormattedMessage id="add company" />,
          type: 'item',
          url: '/management/company/add-company',
          icon: icons.samplePage
        },
        {
          id: 'create-branch-company',
          title: <FormattedMessage id="add company branch" />,
          type: 'item',
          url: '/management/company/add-company-branch',
          icon: icons.samplePage
        },
        {
          id: 'create-company-rate',
          title: <FormattedMessage id="add company rate" />,
          type: 'item',
          url: '/management/company/add-company-rate',
          icon: icons.samplePage
        }
      ]
    },

    // Vendor
    {
      id: 'vendor',
      title: <FormattedMessage id="vendor" />,
      type: 'collapse',
      url: '/management/vendor/dashboard',
      icon: icons.samplePage,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/management/vendor/view',
          icon: icons.samplePage
        },
        {
          id: 'create-vendor',
          title: <FormattedMessage id="add vendor" />,
          type: 'item',
          url: '/management/vendor/add-vendor',
          icon: icons.samplePage
        },
        {
          id: 'create-vendor-rate',
          title: <FormattedMessage id="add vendor rate" />,
          type: 'item',
          url: '/management/vendor/add-vendor-rate',
          icon: icons.samplePage
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
          icon: icons.samplePage
        },
        {
          id: 'create-driver-rate',
          title: <FormattedMessage id="add driver rate" />,
          type: 'item',
          url: '/management/driver/add-driver-rate',
          icon: icons.samplePage
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
          icon: icons.samplePage
        },
        {
          id: 'create-cab',
          title: <FormattedMessage id="add cab" />,
          type: 'item',
          url: '/management/cab/add-cab',
          icon: icons.samplePage
        }
      ]
    }
  ]
};

export default management;
