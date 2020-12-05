import { combineReducers } from '@reduxjs/toolkit';
import filter from './slices/filter';

const rootReducer = combineReducers({ filter });

export type ReducerType = ReturnType<typeof rootReducer>;

export default rootReducer;
