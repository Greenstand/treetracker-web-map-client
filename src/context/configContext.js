import { createContext, useReducer, useContext, useMemo } from 'react';

const ConfigContext = createContext(null);

const ACTION_TYPES = {
  UPDATE_LOGO_URL: 'UPDATE_LOGO_URL',
  ADD_NAV_ITEM: 'ADD_NAV_ITEM',
  REMOVE_NAV_ITEM: 'REMOVE_NAV_ITEM',
  UPDATE_NAV_ITEM: 'UPDATE_NAV_ITEM',
  UPDATE_MAP_LOCATION: 'UPDATE_MAP_LOCATION',
};

export const ACTIONS = {
  updateLogoUrl: (newUrl) => ({
    type: ACTION_TYPES.UPDATE_LOGO_URL,
    payload: newUrl,
  }),
  addNavItem: (newNavItem) => ({
    type: ACTION_TYPES.ADD_NAV_ITEM,
    payload: newNavItem,
  }),
  removeNavItem: (navItem) => ({
    type: ACTION_TYPES.REMOVE_NAV_ITEM,
    payload: navItem,
  }),
  updateNavItem: (updatedNavItem) => ({
    type: ACTION_TYPES.UPDATE_NAV_ITEM,
    payload: updatedNavItem,
  }),
  updateMapLocation: (updatedMapLocation) => ({
    type: ACTION_TYPES.UPDATE_MAP_LOCATION,
    payload: updatedMapLocation,
  }),
};

const configReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_LOGO_URL: {
      return {
        ...state,
        navbar: {
          ...state.navbar,
          logoUrl: action.payload,
        },
      };
    }
    case ACTION_TYPES.ADD_NAV_ITEM: {
      const newNavItems = [...state.navbar.items, action.payload];

      return {
        ...state,
        navbar: {
          ...state.navbar,
          items: newNavItems,
        },
      };
    }
    case ACTION_TYPES.REMOVE_NAV_ITEM: {
      const newNavItems = state.navbar.items.filter(
        (item) => item !== action.payload,
      );

      return {
        ...state,
        navbar: {
          ...state.navbar,
          items: newNavItems,
        },
      };
    }
    case ACTION_TYPES.UPDATE_NAV_ITEM: {
      const newNavItems = state.navbar.items.map((item) => {
        if (item !== action.payload) return item;
        return action.payload;
      });

      return {
        ...state,
        navbar: {
          ...state.navbar,
          items: newNavItems,
        },
      };
    }
    case ACTION_TYPES.UPDATE_MAP_LOCATION: {
      return {
        ...state,
        map: {
          ...state.map,
          initialLocation: {
            ...state.map.initialLocation,
            ...action.payload,
          },
        },
      };
    }
    default: {
      return state;
    }
  }
};

const initialState = {
  navbar: {
    logoUrl: 'http://localhost:3000/images/greenstand_logo.svg',
    items: [],
  },
  map: {
    initialLocation: {
      lat: '',
      lon: '',
      zoom: '',
    },
  },
};

export function ConfigProvider({ children }) {
  const [state, dispatch] = useReducer(configReducer, initialState);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export const useConfigContext = () => useContext(ConfigContext);

export default ConfigContext;
