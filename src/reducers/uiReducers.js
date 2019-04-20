export default function uiReducer(state = {}, action) {
  switch (action.type) {
    case 'SIDEBAR_VISIBLE':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    case 'SIDEBAR_VISIBLE_MOBILE':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
        sidebarMobile: !state.sidebarMobile
      };
    default:
      return state;
  }
}