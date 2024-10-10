/* eslint-disable no-unused-vars */
import { useLayoutEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';

// project-imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

import { useSelector } from 'store';
import useConfig from 'hooks/useConfig';
import { HORIZONTAL_MAX_ITEM } from 'config';
import { MenuOrientation } from 'config';
import cabProviderMenuItems from 'menu-items/cabProvider';
import { getCaseInsensitiveValue, PERMISSIONS } from 'constant';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const theme = useTheme();

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);

  // const { userSpecificData, userPermissions: deo, user } = useSelector((state) => state.auth);
  // console.log('userPermissions', deo);
  const { userSpecificData, userPermissions, user } = useSelector((state) => state.auth);
  console.log(`🚀 ~ Navigation ~ userPermissions:`, userPermissions);
  // console.log('user', user);
  // console.log('userSpecificData', userSpecificData);
  // const userPermissions = {
  //   company: ['read', 'edit'],
  //   vendor: ['add', 'Read'],
  //   driver: ['add'],
  //   invoice: ['add'],
  //   reports: ['add'],
  //   user: [''],
  //   roster: ['READ'],
  //   role: ['READ', 'CREATE'],
  //   zone: ['CREATE', 'UPDATE', 'DELETE'],
  //   'cab-rate': ['read']
  // };

  const [selectedItems, setSelectedItems] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [menuItems, setMenuItems] = useState({ items: [] });
  const { userType } = useSelector((state) => state.auth);

  // Helper function to check if a user has the required permissions
  const hasPermissionItem = (itemId, userPermissions, requiredPermission) => {
    console.log(`🚀 ~ hasPermissionItem ~ itemId:`, itemId);
    console.log(`🚀 ~ hasPermissionItem ~ userPermissions:`, userPermissions);
    console.log({ itemId, requiredPermission });

    const modifiedUserPermissions = Object.keys(userPermissions).reduce((acc, key) => {
      if (Array.isArray(userPermissions[key])) {
        acc[key] = userPermissions[key]; // Add the key-value pair where the value is an array
      }
      return acc;
    }, {});
    console.log(`🚀 ~ modifiedUserPermissions ~ modifiedUserPermissions:`, modifiedUserPermissions);

    return hasPermissionForItem(modifiedUserPermissions, itemId, requiredPermission);
  };

  const hasPermissionCheckForGroup = (itemId, children, userPermissions, requiredPermission) => {
    console.log(`🚀 ~ hasPermissionCheckForGroup ~ itemId:`, itemId);
    console.log(`🚀 ~ hasPermissionCheckForGroup ~ children:`, children);
    console.log(`🚀 ~ hasPermissionCheckForGroup ~ userPermissions:`, userPermissions);
    console.log(`🚀 ~ hasPermissionCheckForGroup ~ requiredPermission:`, requiredPermission);

    const modifiedUserPermissions = Object.keys(userPermissions).reduce((acc, key) => {
      if (Array.isArray(userPermissions[key])) {
        acc[key] = userPermissions[key]; // Add the key-value pair where the value is an array
      }
      return acc;
    }, {});

    const allChildren = children.map((i) => i.id);
    console.log(`🚀 ~ hasPermissionCheckForGroup ~ allChildren:`, allChildren);

    // const x = children
    //   .map((i) => i.extraModule)
    //   .filter(Boolean)
    //   .flat(Infinity);
    // console.log(`🚀 ~ hasPermissionCheckForGroup ~ x:`, x);

    // console.log(`🚀 ~ modifiedUserPermissions ~ modifiedUserPermissions:`, modifiedUserPermissions);
    // const extraAllChildren = [...allChildren, ...x];
    // console.log(`🚀 ~ hasPermissionCheckForGroup ~ extraAllChildren:`, extraAllChildren);
    // const result = hasPermissionForGroup(modifiedUserPermissions, extraAllChildren, 'rEad');
    const result = hasPermissionForGroup(modifiedUserPermissions, allChildren, 'rEad');
    console.log(`🚀 ~ hasPermissionCheckForGroup ~ result:`, result);

    return result;
  };

  // Recursive function to filter menu items based on permissions
  const filterMenuItems = (items, userPermissions) => {
    console.log(`🚀 ~ filterMenuItems ~ items:`, items);
    // console.log(`🚀 ~ filterMenuItems ~ userPermissions:`, userPermissions);
    const result = items.reduce((acc, item) => {
      const filteredItem = { ...item };
      console.log(`🚀 ~ result ~ filteredItem:`, filteredItem);

      // If the item has children, filter them first
      if (item.children) {
        filteredItem.children = filterMenuItems(item.children, userPermissions);
      }

      if (item.type === 'group') {
        if (hasPermissionCheckForGroup(item.id, item.children, userPermissions, PERMISSIONS.READ)) {
          acc.push(filteredItem);
        }
      } else if (item.type === 'item') {
        if (hasPermissionItem(item.id, userPermissions, PERMISSIONS.READ)) {
          acc.push(filteredItem);
        }
      }

      return acc;
    }, []);

    return result;
  };

  useLayoutEffect(() => {
    let menu;
    console.log('userType', userType);

    switch (userType) {
      case 0:
        menu = menuItem;
        break;
      case 1:
        menu = cabProviderMenuItems;
        break;

      default:
        menu = menuItem; // Default case if userType is not recognized
        break;
    }
    setMenuItems(menu);
    // eslint-disable-next-line
  }, [menuItem]);

  useLayoutEffect(() => {
    const menu = menuItem; // This is your static menu data
    console.log(`🚀 ~ useLayoutEffect ~ menu:`, menu);
    const filteredMenu = {
      ...menu,
      items: filterMenuItems(menu.items, userPermissions)
    };

    // Only update state if filtered menu is different from current state
    if (JSON.stringify(filteredMenu.items) !== JSON.stringify(menuItems.items)) {
      setMenuItems(filteredMenu);
    }
  }, [userPermissions, menuItems.items]); // Run effect when permissions change or menuItems change

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });
  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block'
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;

/**
 * Checks if any of the specified keys have the given permission type in the permissions object.
 *
 * @param {Object} permissions - An object where keys are resource names and values are arrays of permission types.
 * @param {Array<string>} keys - An array of resource names to check against the permissions object.
 * @param {string} permissionType - The type of permission to check for (e.g., "Read", "Create"). The comparison is case-insensitive.
 * @returns {boolean} - Returns true if any of the specified keys have the given permission type; otherwise, returns false.
 *
 * @example
 * const hasReadAccess = hasPermissionForGroup(permissions, ["roster", "company"], "Read");
 * console.log(hasReadAccess); // true or false based on the permissions object
 */
function hasPermissionForGroup(permissions, keys, permissionType) {
  // Normalize the permission type for case-insensitive comparison
  const normalizedPermissionType = permissionType.toLowerCase();

  return keys.some((key) => {
    // Normalize the key to capitalize the first letter
    const normalizedKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

    // Check against all keys in permissions, normalizing them as well
    return Object.keys(permissions).some((permissionKey) => {
      return (
        permissionKey.toLowerCase() === normalizedKey.toLowerCase() &&
        permissions[permissionKey].map((p) => p.toLowerCase()).includes(normalizedPermissionType)
      );
    });
  });
}

/**
 * Checks if a specific permission exists within the given permissions object.
 *
 * @param {Object} permissionsObject - The object containing permissions for various entities.
 * @param {string} permissionKey - The key representing the entity (e.g., "InvoiceSettings") to check for permissions.
 * @param {string} action - The action (e.g., "Read", "Update") to verify against the permissions for the specified entity.
 * @returns {boolean} - Returns true if the specified action exists for the given entity, false otherwise.
 *
 * The function performs a case-insensitive comparison by normalizing both the permissionKey
 * and action to lower case. It iterates over the keys of the permissions object to find a match
 * for the permissionKey. If a matching key is found, it checks whether the specified action exists
 * in the corresponding array of permissions. If either the key or action does not exist, it returns false.
 */
function hasPermissionForItem(permissionsObject, permissionKey, action) {
  // Normalize the permissionKey and action to lower case
  const normalizedKey = permissionKey.toLowerCase();
  const normalizedAction = action.toLowerCase();

  // Check if the permissions object has the normalized key
  for (const key in permissionsObject) {
    if (key.toLowerCase() === normalizedKey) {
      // Check if the action exists in the corresponding permission array
      return permissionsObject[key].some((permission) => permission.toLowerCase() === normalizedAction);
    }
  }

  return false; // Return false if the key or action does not exist
}

/**
 * Checks if the user has at least one required permission from a given set of permission pairs.
 *
 * @param {Object} permissionsObject - The object representing the user's permissions.
 *        The keys are permission categories (e.g., "Company", "Role") and the values
 *        are arrays of actions (e.g., "Read", "Create") allowed for each category.
 * @param {Object} permissionPairs - An object where each key represents a permission category
 *        and the corresponding value is either a single action (string) or an array of actions (string[]).
 *        The method will check if any action within the array matches the user's permissions.
 * @returns {boolean} - Returns true if the user has at least one of the required actions for any category;
 *        otherwise, returns false.
 *
 * @example
 * const permissions = {
 *   "Company": ["Read", "Create"],
 *   "Role": ["Read", "Update", "Delete"]
 * };
 * const requiredPermissions = {
 *   "Company": "Create",
 *   "Role": ["Delete", "Update"]
 * };
 *
 * isPermissionGranted(permissions, requiredPermissions); // true
 */
export function isPermissionGranted(permissionsObject, permissionPairs) {
  // Iterate over each key-action pair in the permissionPairs object
  for (const [key, actions] of Object.entries(permissionPairs)) {
    // Normalize the permission key to lowercase for case-insensitive comparison
    const normalizedKey = key.toLowerCase();

    // Check if the permissions object contains the normalized key
    for (const permissionKey in permissionsObject) {
      if (permissionKey.toLowerCase() === normalizedKey) {
        // Normalize actions to an array, even if a single action is provided
        const actionsArray = Array.isArray(actions) ? actions : [actions];

        // Check if any of the actions in actionsArray match the user's permissions for the given key
        for (const action of actionsArray) {
          const normalizedAction = action.toLowerCase();
          if (permissionsObject[permissionKey].some((permission) => permission.toLowerCase() === normalizedAction)) {
            return true; // Return true if a match is found
          }
        }
      }
    }
  }

  // Return false if none of the permission pairs match the user's permissions
  return false;
}
