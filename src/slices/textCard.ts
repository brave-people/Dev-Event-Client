import { createSlice } from "@reduxjs/toolkit";

export const textCard = createSlice({
  name: 'textCard',
  initialState: {
    id: 1,
  },
  reducers: {
    updateTextCard(state, { payload }) {
      state.id = payload;
    },
  }
});

export const { updateTextCard } = textCard.actions;
export default textCard.reducer;
