export default function  apiReducer(state = {}, action) {
  switch (action.type) {
    case 'ENTRY':
      return {
        ...state,
        entry: action.payload,
      };
    default:
      return state;
  }
}
