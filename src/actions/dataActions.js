import ApiService from '../services/ApiService';
import rel from '../services/rel';
import { ENTRY, LANGUAGES, ATTRIBUTES, RELATIONSHIPTYPES, CATEGORIES} from './actionTypes';

export function getEntry(){
    return async (dispatch, getState) =>
      {
      const entry = await ApiService.getEntry();
  
      const languages = await ApiService.get(rel(entry.links, 'languages'));
      const attributes = await ApiService.get(rel(entry.links, 'attributes'));
      const relationshipTypes = await ApiService.get(rel(entry.links, 'relationshiptypes'));
      const categories = await ApiService.get(rel(entry.links, 'categories'));
  
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