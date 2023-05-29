import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getFoods } from "../../api";

const initialState = {
  isLoading: false,
  foods: [],
  error: "",
};

const foodsSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        const transformFoods = action.payload
          .map((item) => item.foods.map((food) => ({ ...food })))
          .flat(1);
        state.foods = [...transformFoods];
        state.isLoading = false;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.foods = [];
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const fetchFoods = createAsyncThunk("foods/fetchFoods", async (data) => {
  try {
    const response = await getFoods(data);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
});

export const selectAllFoods = (state) => state.foods;

export default foodsSlice.reducer;
