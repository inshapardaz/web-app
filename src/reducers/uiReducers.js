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
    case 'READER_FONT':
      return {
        ...state,
        font: action.value
      };
    case 'READER_FONT_SIZE':
      return {
        ...state,
        fontSize: action.value
      };
    case 'READER_THEME':
      return {
        ...state,
        theme: action.theme
      };
    default:
      return state;
  }
}