// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, MenuBoard, Setting2, Wallet } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: MenuBoard,
  setting:Setting2,
  invoice: Bill,
  account:Wallet
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
      icon: icons.setting,
      children: [
        // Account
        {
          id: 'account-setting',
          title: <FormattedMessage id="account setting" />,
          type: 'item',
          icon: icons.account,
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
          icon: icons.invoice,
          url: '/settings/invoice'
        }
      ]
    }
  ]
};

export default setting;
