
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer  from '../reducers/rootReducer';
import { loadUser } from "redux-oidc";
import userManager from "../services/userManager";

export const history = createBrowserHistory();

export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  var store = createStore(
    createRootReducer(history),
    composeEnhancers(
      applyMiddleware(thunk, routerMiddleware(history)),
    )
  );

  loadUser(store, userManager);

  return store;
}