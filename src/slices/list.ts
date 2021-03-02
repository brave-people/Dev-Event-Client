import { createSlice } from "@reduxjs/toolkit";

export const list = createSlice({
  name: "list",
  initialState: {
    years: [] as string[],
  },
  reducers: {
    updateYears(state, { payload }) {
      const year = payload as string;
      if (state.years.includes(year)) {
        const index = state.years.findIndex((v) => v === year);
        state.years.splice(index, 1);
      } else {
        state.years.push(year);
      }
    },
  },
});

export const { updateYears } = list.actions;
export default list.reducer;
