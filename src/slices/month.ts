import { createSlice } from "@reduxjs/toolkit";

export const month = createSlice({
  name: 'month',
  initialState: {
    date: '',
    showMonth: false
  },
  reducers: {
    setShowMonth(state, { payload }) {
      state.showMonth = payload;
    },
    activeMonth(state, { payload }) {
      state.date = payload;
    },
  }
});

export const { setShowMonth, activeMonth } = month.actions;
export default month.reducer;
