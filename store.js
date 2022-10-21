import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createWrapper } from "next-redux-wrapper";

import rootReducer from "configs/reducer.config";
import rootSaga from "sagas";
const { composeWithDevTools } = require("redux-devtools-extension");


// tool redux
const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const { persistReducer, persistStore } = require("redux-persist");

const storage = require("redux-persist/lib/storage").default;

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage: storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const configureStore = (initialState) => {
  if (process.env.NODE_ENV === "development") {
    const store = createStore(
      persistedReducer,
      initialState,
      bindMiddleware([sagaMiddleware])
    );
    sagaMiddleware.run(rootSaga);
    return store;
  }

  const store = createStore(
    persistedReducer,
    initialState,
    bindMiddleware([sagaMiddleware])
  );
  sagaMiddleware.run(rootSaga);
  return store;
};

const store = configureStore();
const persistor = persistStore(store);
const makeStore = () => store;
const wrapper = createWrapper(makeStore, { debug: false });
export { wrapper, persistor, store };
