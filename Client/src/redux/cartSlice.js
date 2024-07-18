import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  try {
    const { data } = await axios.get('http://localhost:3001/user'); // Replace with your API endpoint
    const { cart } = data;
    if(cart.length > 1) console.log("Empty cart")
    
    return cart;

  } catch (error) {
    console.error("Error in fetchCart: ", error.message);
    throw error;
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (itemInfo) => {
  try {
    const { data } = await axios.post('http://localhost:3001/user/addCart', itemInfo);
    return data;
  } catch (error) {
    console.error("Error in addToCart: ", error.message);
    throw error;
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId) => {
  try {
    const { data } = await axios.delete(`http://localhost:3001/users/removeCart/${itemId}`);
    return data;
  } catch (error) {
    console.error("Error in removeFromCart: ", error.message);
    throw error;
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    loadItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      });
  }
});

export const { loadItems, addItem, removeItem } = cartSlice.actions;

export default cartSlice.reducer;
