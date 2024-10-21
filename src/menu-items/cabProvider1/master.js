// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { AddCircle, Eye, Location, MenuBoard, Profile2User } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: MenuBoard,
  zone:Location,
  role:Profile2User,
  view:Eye,
  add:AddCircle
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
      icon: icons.role,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/master/role',
          icon: icons.view
        }
      ]
    },
    // Zone
    {
      id: 'zone',
      title: <FormattedMessage id="zone" />,
      type: 'collapse',
      icon: icons.zone,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/master/zone',
          icon: icons.view
        }
      ]
    },
    // Zone Type
    {
      id: 'zone-type',
      title: <FormattedMessage id="zone type" />,
      type: 'collapse',
      icon: icons.zone,
      children: [
        {
          id: 'view',
          title: <FormattedMessage id="view" />,
          type: 'item',
          url: '/master/zone-type',
          icon: icons.view
        }
      ]
    }
  ]
};

export default master;
