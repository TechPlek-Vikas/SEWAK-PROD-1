// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { MenuBoard } from 'iconsax-react';

// icons
const icons = {
  samplePage: MenuBoard
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const master = {
  id: 'master',
  title: <FormattedMessage id="master" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'role',
      title: <FormattedMessage id="role" />,
      type: 'item',
      url: '/master/role',
      icon: icons.samplePage
    },
    {
      id: 'zone',
      title: <FormattedMessage id="zone" />,
      type: 'item',
      url: '/master/zone',
      icon: icons.samplePage
    },
    {
      id: 'cab-type',
      title: <FormattedMessage id="cab-type" />,
      type: 'item',
      url: '/master/cab-type',
      icon: icons.samplePage
    },
    {
      id: 'cab-rate',
      title: <FormattedMessage id="cab-rate" />,
      type: 'item',
      url: '/master/cab-rate',
      icon: icons.samplePage
    }
  ]
};

export default master;
