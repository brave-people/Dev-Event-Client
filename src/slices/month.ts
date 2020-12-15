import { createSlice } from "@reduxjs/toolkit";

export const month = createSlice({
  name: 'month',
  initialState: {
    month: false,
  },
  reducers: {
    activeMonth(state, { payload }) {
      state.month = payload;
    },
  }
});

export const { activeMonth } = month.actions;
export default month.reducer;
