import PropTypes from 'prop-types';
import { createContext, useEffect } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { INITIALIZE, LOGIN, LOGOUT } from 'store/reducers/actions';

// project-imports
import axios from 'utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import { MODULE, PERMISSIONS } from 'constant';

// const x = {
//   company: ['CREATE', 'edit'],
//   vendor: ['CREATE', 'Read'],
//   // vendor: ['Read'],
//   driver: ['add', 'read'],
//   invoice: ['add'],
//   reports: ['add'],
//   user: [''],
//   roster: ['READ'],
//   // role: ['READ', 'CREATE'],
//   // role: ['READ'],
//   // role: ['READ', 'UPDATE'],
//   role: ['READ', 'DELETE'],
//   // role: ['READ', 'CREATE', 'UPDATE'],
//   zone: ['CREATE', 'UPDATE', 'DELETE', 'READ'],
//   'cab-rate': ['read']
// };

const x = {
  [MODULE.ROSTER]: [PERMISSIONS.READ],

  [MODULE.USER]: [PERMISSIONS.READ],
  [MODULE.COMPANY]: [PERMISSIONS.READ, PERMISSIONS.CREATE],
  [MODULE.VENDOR]: [PERMISSIONS.READ],
  [MODULE.DRIVER]: [PERMISSIONS.READ],
  [MODULE.CAB]: [PERMISSIONS.READ],

  [MODULE.ROLE]: [PERMISSIONS.READ, PERMISSIONS.UPDATE, PERMISSIONS.DELETE],
  [MODULE.ZONE]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.DELETE],
  [MODULE.ZONE_TYPE]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.UPDATE],
  [MODULE.CAB_TYPE]: [PERMISSIONS.READ],
  [MODULE.CAB_RATE]: [PERMISSIONS.READ],
  [MODULE.CAB_RATE_VENDOR]: [PERMISSIONS.READ],
  [MODULE.CAB_RATE_DRIVER]: [PERMISSIONS.CREATE],

  [MODULE.INVOICE]: [PERMISSIONS.READ],
  [MODULE.REPORT]: [PERMISSIONS.READ],
  [MODULE.LOAN]: [PERMISSIONS.READ],
  [MODULE.ADVANCE]: [PERMISSIONS.READ],
  [MODULE.ADVANCE_TYPE]: [PERMISSIONS.READ]
};

const chance = new Chance();

// Define the structure of your decoded JWT token if needed
const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(serviceToken);
    // change token verification logic here

    // return decoded.exp > Date.now() / 1000;
    return !!decoded;
  } catch (error) {
    console.error('Token verification failed', error);
    return false;
  }
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common['Authorization'] = `${serviceToken}`; // Added `Bearer` for better token handling
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // this function will check the session validation and will redirect to home/ login page
    const init = async () => {
      try {
        const serviceToken = localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const response = await axios.get('/user/view');
          // eslint-disable-next-line no-unused-vars
          const { userData, userSpecificData, userPermissions } = response.data;
          dispatch({
            type: LOGIN,
            payload: {
              user: userData,
              userType: userData.userType,
              userSpecificData: userSpecificData,
              // userPermissions: userPermissions
              userPermissions: x
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      } finally {
        dispatch({
          type: INITIALIZE
        });
      }
    };

    init();
  }, [dispatch]); // Added `dispatch` dependency

  const login = async (email, password) => {
    const payload = {
      data: {
        userEmail: email,
        userPassword: password
      }
    };

    const response = await axios.post('/user/login', payload);
    const { userData, userSpecificData } = response.data;

    setSession(userData.token);
    dispatch({
      type: LOGIN,
      payload: {
        user: userData,
        userType: userData.userType,
        userSpecificData: userSpecificData,
        userPermissions: x
      }
    });
  };

  const register = async (email, password, firstName, lastName) => {
    // Recode this flow to ensure user verification logic
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    // Handle local storage 'users'
    const localUsers = localStorage.getItem('users');
    if (localUsers) {
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    } else {
      users = [
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async () => {
    // Handle reset password logic
  };

  const updateProfile = () => {
    // Handle profile update logic
  };
  if (auth.isInitialized !== undefined && !auth.isInitialized) {
    return <Loader />;
  }
  return (
    <JWTContext.Provider
      value={{
        ...auth, // Assuming auth contains the necessary state
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node.isRequired // Ensure children are required
};

export default JWTContext;
