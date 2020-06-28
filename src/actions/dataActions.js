import ApiService from '../services/ApiService';
import { ENTRY, CATEGORIES, SERIES} from './actionTypes';

export function getEntry(){
    return async (dispatch, getState) =>
      {
      const entry = await ApiService.getEntry();
  
      const [categories, series] 
          = await Promise.all([
                          ApiService.get(entry.links.categories),
                          ApiService.get(entry.links.series)]);
  
      dispatch({
        type: ENTRY,
        payload: entry
      });
  
      dispatch({
        type: CATEGORIES,
        payload: categories
      });
  
      dispatch({
        type: SERIES,
        payload: series
      });
    }
  }

export function addCategory(addLink, name){
  return async (dispatch, getState) => {
    await ApiService.post(addLink, { name : name});
    const categories = await ApiService.get(getState().apiReducers.entry.links.categories);
    dispatch({
      type: CATEGORIES,
      payload: categories
    });
  }
}

export function addSeries(addLink, name){
  return async (dispatch, getState) => {
    await ApiService.post(addLink, { name : name});
    const series = await ApiService.get(getState().apiReducers.entry.links.series);
    dispatch({
      type: SERIES,
      payload: series
    });
  }
}