export function entry(){
  return async (dispatch, getState, { apiService }) =>
	{
    const entry = await apiService.entry();

    dispatch({
      type: 'ENTRY',
      payload: entry
    });
  }
}

export function getLatestBooks(){
  return async (dispatch, getState, { apiService }) =>
	{
    const latestBooks = await apiService.getLatestBooks();

    dispatch({
      type: 'LATEST_BOOKS',
      payload: latestBooks
    });
  }
}

export function getRecentBook(){
  return async (dispatch, getState, { apiService }) =>
	{
    const recentBooks = await apiService.getRecentBooks();

    dispatch({
      type: 'RECENT_BOOKS',
      payload: recentBooks
    });
  }
}


export function getFavoriteBook(){
  return async (dispatch, getState, { apiService }) =>
	{
    const favoriteBooks = await apiService.getFavoriteBooks();

    dispatch({
      type: 'FAVORITE_BOOKS',
      payload: favoriteBooks
    });
  }
}

export function getBooks()
{
  return async (dispatch, getState, { apiService }) =>
  {
    const books = await apiService.getBooks();

    dispatch({
      type:'BOOKS',
      payload : books
    });
  };
}

export function getAuthors()
{
  return async (dispatch, getState, { apiService }) =>
  {
    const authors = await apiService.getAuthors();

    dispatch({
      type:'AUTHORS',
      payload : authors
    });
  };
}
