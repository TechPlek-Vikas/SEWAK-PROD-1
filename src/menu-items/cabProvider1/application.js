// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Bill, Car, DocumentUpload, Eye, MenuBoard } from 'iconsax-react';
import { MODULE, PERMISSIONS } from 'constant';

// icons
const icons = {
  samplePage: MenuBoard,
  view: Eye,
  upload: DocumentUpload,
  invoice: Bill,
  trip:Car
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
      url: '/apps/roster/dashboard',
      children: [
        {
          id: 'list',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/apps/roster/all-roster',
          // icon: icons.view
        },
        {
          id: 'upload',
          title: <FormattedMessage id="upload" />,
          type: 'item',
          url: '/apps/roster/create',
          // icon: icons.upload
        },

        // {
        //   id: 'test',
        //   title: <FormattedMessage id="test" />,
        //   type: 'item',
        //   url: '/apps/roster/test',
        //   // icon: icons.samplePage
        // }
      ]
    },

    // Invoices
    {
      id: 'invoices',
      title: <FormattedMessage id="invoices" />,
      type: 'collapse',
      url: '/apps/invoices/dashboard',
      icon: icons.invoice,
      children: [
        {
          id: 'list',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/apps/invoices/list',
          // icon: icons.view
        },
        {
          id: 'upload',
          title: <FormattedMessage id="upload" />,
          type: 'item',
          url: '/apps/invoices/create',
          // icon: icons.upload
        }
      ]
    },

     // Trips
     {
      id: 'trips',
      title: <FormattedMessage id="trips" />,
      type: 'collapse',
      // url: '/apps/invoices/dashboard',
      icon: icons.trip,
      children: [
        {
          id: 'list',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/apps/trips/list',
          // icon: icons.view
        },
      ]
    }
  ]
};

export default application;
