export function getEntry(){
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

export function getBooks(link)
{
  return async (dispatch, getState, { apiService }) =>
  {
    const books = await apiService.getBooks(link);

    dispatch({
      type:'BOOKS',
      payload : books
    });
  };
}

export function getBook(id)
{
  return async (dispatch, getState, { apiService }) =>
  {
    const book = await apiService.getBook(id);

    dispatch({
      type:'BOOK',
      payload : book
    });
  };
}

export function getAuthors(link)
{
  return async (dispatch, getState, { apiService }) =>
  {
    const authors = await apiService.getAuthors(link);

    dispatch({
      type:'AUTHORS',
      payload : authors
    });
  };
}

export function getAuthor(id)
{
  return async (dispatch, getState, { apiService }) =>
  {
    const author = await apiService.getAuthor(id);

    dispatch({
      type:'AUTHOR',
      payload : author
    });
  };
}

export function getAuthorBooks(link)
{
  return async (dispatch, getState, { apiService }) =>
  {
    const books = await apiService.getAuthorBooks(link);

    dispatch({
      type:'AUTHOR_BOOKS',
      payload : books
    });
  };
}
