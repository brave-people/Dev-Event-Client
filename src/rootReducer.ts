import { combineReducers } from "@reduxjs/toolkit";
import filter from "./slices/filter";
import list from "./slices/list";
import month from "./slices/month";

const rootReducer = combineReducers({ filter, list, month });

export type ReducerType = ReturnType<typeof rootReducer>;

export default rootReducer;
