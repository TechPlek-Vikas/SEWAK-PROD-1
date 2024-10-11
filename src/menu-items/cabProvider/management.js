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

const management = {
  id: 'management',
  title: <FormattedMessage id="management" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'user',
      title: <FormattedMessage id="user" />,
      type: 'item',
      url: '/management/user',
      icon: icons.samplePage,
      permissions: {
        [MODULE.USER]: PERMISSIONS.READ
      }
    },
    {
      id: 'company',
      title: <FormattedMessage id="company" />,
      type: 'item',
      url: '/management/company',
      icon: icons.samplePage,
      permissions: {
        [MODULE.COMPANY]: PERMISSIONS.READ
      }
    },
    {
      id: 'vendor',
      title: <FormattedMessage id="vendor" />,
      type: 'item',
      url: '/management/vendor',
      icon: icons.samplePage,
      permissions: {
        [MODULE.VENDOR]: PERMISSIONS.READ
      }
    },
    {
      id: 'driver',
      title: <FormattedMessage id="driver" />,
      type: 'item',
      url: '/management/driver',
      icon: icons.samplePage,
      permissions: {
        [MODULE.DRIVER]: PERMISSIONS.READ
      }
    },
    {
      id: 'cabs',
      title: <FormattedMessage id="cabs" />,
      type: 'item',
      url: '/management/cab',
      icon: icons.samplePage,
      permissions: {
        [MODULE.CAB]: PERMISSIONS.READ
      }
    }
  ]
};

export default management;
