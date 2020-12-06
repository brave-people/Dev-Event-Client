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
    activeFilter(state, action: { payload: any, type: string }) {
      const payload = action.payload as never;
      const findFilter = state.activeTags.findIndex(el => el === payload);
      if (findFilter > -1) {
        state.activeTags.splice(findFilter, 1);
      } else {
        state.activeTags.push(payload);
        state.activeTags.sort();
      }
    }
  }
});

export const { addFilter, activeFilter } = filter.actions;
export default filter.reducer;
