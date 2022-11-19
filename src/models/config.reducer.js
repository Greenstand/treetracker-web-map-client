const ACTION_TYPES = {
  UPDATE_LOGO_URL: 'UPDATE_LOGO_URL',
  ADD_NAV_ITEM: 'ADD_NAV_ITEM',
  REMOVE_NAV_ITEM: 'REMOVE_NAV_ITEM',
  UPDATE_NAV_ITEM: 'UPDATE_NAV_ITEM',
  UPDATE_MAP_LOCATION: 'UPDATE_MAP_LOCATION',
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
      // get the next id of the nav items, if curr ids [1,3,4] returns 2
      const nextId = () => {
        let next = 1;
        // eslint-disable-next-line no-loop-func
        while (state.navbar.items.find((item) => item.id === next)) {
          next += 1;
        }
        return next;
      };
      const newId = nextId();
      const newItem = {
        id: newId,
        title: 'New Url',
        url: '/new-url',
      };

      // check if title or url already exist
      const isAlreadyNewItem = state.navbar.items
        .map((item) => {
          if (item.title === newItem.title || item.url === newItem.url) {
            return true;
          }
          return false;
        })
        .some((x) => x === true);

      // if item is already in the state; return state
      if (isAlreadyNewItem) return state;

      const newNavItems = [...state.navbar.items, newItem];

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
        (item) => item.id !== action.payload,
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
        if (item.id !== action.payload.id) return item;
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

export default configReducer;

// Actions
export const updateLogoUrl = (newUrl) => ({
  type: ACTION_TYPES.UPDATE_LOGO_URL,
  payload: newUrl,
});

export const addNavItem = (newNavItem) => ({
  type: ACTION_TYPES.ADD_NAV_ITEM,
  payload: newNavItem,
});

export const removeNavItem = (navItem) => ({
  type: ACTION_TYPES.REMOVE_NAV_ITEM,
  payload: navItem,
});

export const updateNavItem = (updatedNavItem) => ({
  type: ACTION_TYPES.UPDATE_NAV_ITEM,
  payload: updatedNavItem,
});

export const updateMapLocation = (updatedMapLocation) => ({
  type: ACTION_TYPES.UPDATE_MAP_LOCATION,
  payload: updatedMapLocation,
});
