import { createSlice } from "@reduxjs/toolkit";
import { isEqual } from "lodash";

const initialState = {
  orderFoods: [],
  hasUpdate: false,
  statusPayment: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearCart: (state) => {
      state.orderFoods = [];
    },
    clearOrder: (state) => {
      state.orderId = null;
      state.orderCode = null;
      state.statusOrder = false;
      state.statusPayment = false;
      state.message = "";
      state.orderFoods = [];
      localStorage.removeItem("orderId");
    },
    addToCart: (state, action) => {
      const orderItem = action.payload;
      const itemIndex = state.orderFoods.findIndex(
        (x) =>
          x.id === orderItem.id &&
          x.updatedAt === orderItem.updatedAt &&
          isEqual(x.options, orderItem.options) 
          //&& (x.note || "").toLowerCase() === (orderItem.note || "").toLowerCase()
      );

      if (itemIndex > -1) {
        if (orderItem.newQuantity) {
          state.orderFoods[itemIndex].quantity = orderItem.newQuantity;
        } else {
          state.orderFoods[itemIndex].quantity += 1;
        }

        if(orderItem.newOptions){
          state.orderFoods[itemIndex].options = orderItem.newOptions;
        }
        
        if (orderItem.note) {
          state.orderFoods[itemIndex].note = orderItem.note;
        }
      } else {
        if (orderItem.quantity && orderItem.quantity > 0) {
          state.orderFoods = [
            {
              ...orderItem,
              quantity: orderItem.quantity,
            },
            ...state.orderFoods,
          ];
        } else {
          state.orderFoods = [
            { ...orderItem, quantity: 1 },
            ...state.orderFoods,
          ];
        }
      }
    },
    addAllToCart: (state, action) => {
      const orderItems = action.payload;
      state.orderFoods = [...orderItems];
    },
    addNoteToCart: (state, action) => {
      const orderItem = action.payload;
      const itemIndex = state.orderFoods.findIndex(
        (x) => x.index === orderItem.index
      );

      if (itemIndex > -1) {
        state.orderFoods[itemIndex].note = orderItem.note;
      }
    },
    saveToCart: (state, action) => {
      const orderItem = action.payload;
      const itemIndex = state.orderFoods.findIndex(
        (x) => x.id === orderItem.id
      );
      if (itemIndex > -1) {
        state.orderFoods[itemIndex].quantity = orderItem.quantity;
        state.orderFoods[itemIndex].note = orderItem?.note;
      } else {
        state.orderFoods = [...state.orderFoods, { ...orderItem, quantity: 1 }];
      }
    },
    decreaseCart: (state, action) => {
      const orderItem = action.payload;
      const itemIndex = state.orderFoods.findIndex(
        (x) =>
          x.id === orderItem.id &&
          x.updatedAt === orderItem.updatedAt &&
          isEqual(x.options, orderItem.options) &&
          (x.note || "").toLowerCase() === (orderItem.note || "").toLowerCase()
      );
      state.orderFoods[itemIndex].quantity -= 1;
    },
    removeFromCart: (state, action) => {
      const orderItem = action.payload;
      const itemIndex = state.orderFoods.findIndex(
        (x) =>
          x.id === orderItem.id &&
          x.updatedAt === orderItem.updatedAt &&
          isEqual(x.options, orderItem.options) &&
          (x.note || "").toLowerCase() === (orderItem.note || "").toLowerCase()
      );
      if (itemIndex > -1) {
        state.orderFoods = [
          ...state.orderFoods.slice(0, itemIndex),
          ...state.orderFoods.slice(itemIndex + 1),
        ];
      }
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
    setOrderCode: (state, action) => {
      state.orderCode = action.payload;
    },
    setStatusOrder: (state, action) => {
      state.statusOrder = action.payload;
    },
    setStatusPayment: (state, action) => {
      state.statusPayment = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setUpdate: (state, action) => {
      state.hasUpdate = action.payload;
    },
  },
});

export const selectMenuItems = (state) => state.cart.cartItems;
export const selectMenuItemWithId = (state, id) =>
  state.cart.orderFoods.find((item) => item.id === id);
export const calculateTotalItemsWithId = (state, food) => {
  return state.cart.orderFoods
    .filter(
      (item) =>
        item.id === food.id &&
        item.updatedAt === food.updatedAt &&
        isEqual(item.options, food.options) &&
        (item.note || "").toLowerCase() === (food.note || "").toLowerCase()
    )
    .reduce((total, item) => (total += item.quantity), 0);
};

export const calculateTotalItemsWithIdNote = (state, food) => {
  return state.cart.orderFoods
    .filter(
      (item) =>
        item.id === food.id &&
        (item.note || "").toLowerCase() === (food.note || "").toLowerCase()
    )
    .reduce((total, item) => (total += item.currentQuantity), 0);
};

export const calculateTotalItems = (state) =>
  state.cart.orderFoods.reduce((total, item) => (total += item.quantity), 0);

export const calculateTotalMoney = (state) =>
  state.cart.orderFoods.reduce((price, item) => {
    let totalMoneyFoodOption = 0;
    if (item.options) {
      totalMoneyFoodOption = item.options.flat(1).reduce(
        (priceOption, itemOption) => priceOption + itemOption.price,
        0
      );
    }
    return (item.price + totalMoneyFoodOption) * item.quantity + price;
  }, 0);

export const {
  setLoading,
  clearCart,
  clearOrder,
  addToCart,
  addAllToCart,
  addNoteToCart,
  saveToCart,
  removeFromCart,
  decreaseCart,
  setOrderId,
  setOrderCode,
  setStatusOrder,
  setStatusPayment,
  setMessage,
  setUpdate,
} = cartSlice.actions;
export default cartSlice.reducer;
