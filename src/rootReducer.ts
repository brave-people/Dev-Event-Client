import { combineReducers } from '@reduxjs/toolkit';
import filter from './slices/filter';
import textCard from './slices/textCard';

const rootReducer = combineReducers({ filter, textCard });

export type ReducerType = ReturnType<typeof rootReducer>;

export default rootReducer;
