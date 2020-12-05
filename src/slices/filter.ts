import { createSlice } from "@reduxjs/toolkit";

export const filter = createSlice({
  name: 'filter',
  initialState: {
    tags: [],
    activeTags: [],
  },
  reducers: {
    addFilter(state, { payload }) {
      state.tags = payload;
    },
    activeFilter(state, { payload }) {
      // @ts-ignore
      state.activeTags.push(payload);
      // const text = payload.active as never;
      // if (text) state.active.push(text)
      // state.active.push(action.payload);
    }
  }
});

export const { addFilter, activeFilter } = filter.actions;
export default filter.reducer;
