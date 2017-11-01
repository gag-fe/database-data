import { createStore, applyMiddleware, compose } from 'redux';
// reducer
import rootReducer from '../../reducers/index';
// middleware
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const enforceImmutableMiddleware = require('redux-immutable-state-invariant')();

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const createStoreWithMiddleware = composeEnhancers(
  applyMiddleware(
    enforceImmutableMiddleware,
    thunkMiddleware,
    promiseMiddleware,
    loggerMiddleware
  ),
)(createStore);

/**
 * Creates a preconfigured store.
 */

export default function configureStore (preloadedState) {
  const store = createStoreWithMiddleware(rootReducer, preloadedState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../../reducers', () => {
      const nextRootReducer = require('../../reducers/index');
      store.replaceReducer(nextRootReducer);
    })
  }

  return store
}
