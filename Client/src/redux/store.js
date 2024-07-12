import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import cartReducer from './cartSlice'
import userReducer from './userSlice'
import itemsReducer from './itemsSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    items: itemsReducer
  }
});

export default store;
