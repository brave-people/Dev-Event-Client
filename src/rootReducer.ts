import { combineReducers } from '@reduxjs/toolkit';
import filter from './slices/filter';
import textCard from './slices/textCard';
import month from './slices/month';

const rootReducer = combineReducers({ filter, textCard, month });

export type ReducerType = ReturnType<typeof rootReducer>;

export default rootReducer;
