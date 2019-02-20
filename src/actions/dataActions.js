import ApiService from '../services/ApiService';
import rel from '../services/rel';
import { ENTRY, LANGUAGES, ATTRIBUTES, RELATIONSHIPTYPES, CATEGORIES} from './actionTypes';

export function getEntry(){
    return async (dispatch, getState) =>
      {
      const api = new ApiService(getState().oidc.user);
      const entry = await api.getEntry();
  
      const languages = await api.get(rel(entry.links, 'languages'));
      const attributes = await api.get(rel(entry.links, 'attributes'));
      const relationshipTypes = await api.get(rel(entry.links, 'relationshiptypes'));
      const categories = await api.get(rel(entry.links, 'categories'));
  
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