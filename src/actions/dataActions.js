import ApiService from '../services/ApiService';
import { ENTRY, LANGUAGES, ATTRIBUTES, RELATIONSHIPTYPES, CATEGORIES, SERIES} from './actionTypes';

export function getEntry(){
    return async (dispatch, getState) =>
      {
      const entry = await ApiService.getEntry();
  
      const [languages,attributes, relationshipTypes, categories, series] 
          = await Promise.all([
                          ApiService.get(entry.links.languages),
                          ApiService.get(entry.links.attributes),
                          ApiService.get(entry.links.relationshiptypes),
                          ApiService.get(entry.links.categories),
                          ApiService.get(entry.links.series)]);
  
      dispatch({
        type: ENTRY,
        payload: entry
      });
  
      dispatch({
        type: LANGUAGES,
        payload: languages
      });
  
      dispatch({
        type: ATTRIBUTES,
        payload: attributes
      });

      dispatch({
        type: CATEGORIES,
        payload: categories
      });
  
      dispatch({
        type: RELATIONSHIPTYPES,
        payload: relationshipTypes
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