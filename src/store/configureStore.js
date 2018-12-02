import {createStore, compose, applyMiddleware} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createOidcMiddleware, { loadUser } from "redux-oidc";
import rootReducer from '../reducers';
import userManager from "../utils/userManager";

export const history = createHistory();
const connectRouterHistory = connectRouter(history);

function configureStoreProd(initialState) {
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [
    thunk.withExtraArgument({  }),
    reactRouterMiddleware,
  ];

  return createStore(
    connectRouterHistory(rootReducer),
    initialState,
    compose(applyMiddleware(...middlewares))
  );
}

function configureStoreDev(initialState) {
  const oidcMiddleware = createOidcMiddleware(userManager);
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [
    oidcMiddleware,
    reduxImmutableStateInvariant(),
    thunk.withExtraArgument(),
    reactRouterMiddleware,
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    connectRouterHistory(rootReducer),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  loadUser(store, userManager);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(connectRouterHistory(nextRootReducer));
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;
