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
    case 'CLOSE_SIDEBAR_MOBILE':
    return {
      ...state,
      sidebarMobile: false
    };
    default:
      return state;
  }
}