export default function   apiReducer(state = {}, action) {
  switch (action.type) {
    case 'ENTRY':
      return {
        ...state,
        entry: action.payload,
      };

      case 'LATEST_BOOKS':
      return {
        ...state,
        latestBooks: action.payload,
      };

    case 'RECENT_BOOKS':
      return {
        ...state,
        recentBooks: action.payload,
      };

    case 'FAVORITE_BOOKS':
      return {
        ...state,
        favoriteBooks: action.payload,
      };
    case 'BOOKS':
      return {
        ...state,
        books: action.payload
      };

    case 'BOOK':
      return {
        ...state,
        book: action.payload
      };
    case 'AUTHORS':
      return {
        ...state,
        authors: action.payload
      };
    case 'AUTHOR':
      return {
        ...state,
        author: action.payload
      };

    case 'AUTHOR_BOOKS':
      return {
        ...state,
        authorBooks: action.payload
      };
    default:
      return state;
  }
}
