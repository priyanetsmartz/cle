import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import rootSaga from "./sagas";
import { sessionService } from 'redux-react-session';
const history = createBrowserHistory()

const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, sagaMiddleware, routeMiddleware];

const store = createStore(
  combineReducers({
    ...reducers,
    router: connectRouter(history)
  }),
  compose(applyMiddleware(...middlewares))
);
sessionService.initSessionService(store);
sagaMiddleware.run(rootSaga,"");
export { store, history };

