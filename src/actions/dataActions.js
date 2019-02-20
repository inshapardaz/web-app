import ApiService from '../services/ApiService';
import { ENTRY, LANGUAGES, ATTRIBUTES, RELATIONSHIPTYPES, CATEGORIES} from './actionTypes';

export function getEntry(){
    return async (dispatch, getState) =>
      {
      const entry = await ApiService.getEntry();
  
      console.log(entry)
      const languages = await ApiService.get(entry.links.languages) ;
      const attributes = await ApiService.get(entry.links.attributes);
      const relationshipTypes = await ApiService.get(entry.links.relationshiptypes);
      const categories = await ApiService.get(entry.links.categories);
  
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
    }
  }