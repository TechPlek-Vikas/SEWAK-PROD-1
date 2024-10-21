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

const master = {
  id: 'group-master',
  title: <FormattedMessage id="master" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    // Role
    {
      id: 'role',
      title: <FormattedMessage id="role" />,
      type: 'collapse',
      icon: icons.samplePage,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/master/role',
          icon: icons.samplePage
        }
      ]
    },
    // Zone
    {
      id: 'zone',
      title: <FormattedMessage id="zone" />,
      type: 'collapse',
      icon: icons.samplePage,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/master/zone',
          icon: icons.samplePage
        }
      ]
    },
    // Zone Type
    {
      id: 'zone-type',
      title: <FormattedMessage id="zone type" />,
      type: 'collapse',
      icon: icons.samplePage,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/master/zone-type',
          icon: icons.samplePage
        }
      ]
    }
  ]
};

export default master;
