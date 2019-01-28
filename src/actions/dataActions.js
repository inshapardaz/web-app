import ApiService from '../services';
import rel from '../utils/rel';
 
export function getEntry(){
    return async (dispatch, getState) =>
      {
      const api = new ApiService(getState().oidc.user);
      const entry = await api.getEntry();
  
      const languages = await api.get(rel(entry.links, 'languages'));
      const attributes = await api.get(rel(entry.links, 'attributes'));
      const relationshipTypes = await api.get(rel(entry.links, 'relationshiptypes'));
  
      dispatch({
        type: 'ENTRY',
        payload: entry
      });
  
      dispatch({
        type: 'LANGUAGES',
        payload: languages
      });
  
      dispatch({
        type: 'ATTRIBUTES',
        payload: attributes
      });
  
      dispatch({
        type: 'RELATIONSHIPTYPES',
        payload: relationshipTypes
      });
    }
  }
  