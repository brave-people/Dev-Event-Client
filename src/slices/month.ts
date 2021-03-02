import { createSlice } from "@reduxjs/toolkit";

export const month = createSlice({
  name: "month",
  initialState: {
    date: "",
  },
  reducers: {
    activeMonth(state, { payload }) {
      state.date = payload;
    },
  },
});

export const { activeMonth } = month.actions;
export default month.reducer;
