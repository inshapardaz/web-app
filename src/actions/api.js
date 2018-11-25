export function entry(){
  return async (dispatch, getState, { apiService }) =>
	{
    const entry = await apiService.entry();

    dispatch({
      type: 'ENTRY',
      entry: entry
    });
  }
}
