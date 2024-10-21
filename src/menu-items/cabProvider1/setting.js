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

const setting = {
  id: 'group-setting',
  title: <FormattedMessage id="setting" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'setting',
      title: <FormattedMessage id="setting" />,
      type: 'collapse',
      icon: icons.samplePage,
      children: [
        // Account
        {
          id: 'account-setting',
          title: <FormattedMessage id="account setting" />,
          type: 'item',
          icon: icons.samplePage,
          url: '/settings/account'
        },

        // Roster
        {
          id: 'roster-setting',
          title: <FormattedMessage id="roster setting" />,
          type: 'item',
          icon: icons.samplePage,
          url: '/settings/roster'
        },

        // Invoice
        {
          id: 'invoice-setting',
          title: <FormattedMessage id="invoice setting" />,
          type: 'item',
          icon: icons.samplePage,
          url: '/settings/invoice'
        }
      ]
    }
  ]
};

export default setting;
