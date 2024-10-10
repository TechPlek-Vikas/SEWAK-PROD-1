// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Calendar1 } from 'iconsax-react';

// icons
const icons = {
  samplePage: Calendar1
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const roster = {
  id: 'roster',
  title: <FormattedMessage id="roster" />,
  type: 'group',
  icon: icons.samplePage,
  children: [
    {
      id: 'roster',
      title: <FormattedMessage id="roster" />,
      type: 'item',
      url: '/roster',
      icon: icons.samplePage
    }
  ]
};

export default roster;
