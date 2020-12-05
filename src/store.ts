import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import rootReducer from './rootReducer';
import logger from 'redux-logger';

const middleware = [ ...getDefaultMiddleware(), logger ];
const store = configureStore({
  reducer: rootReducer,
  middleware
})

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch

export default store
