import { configureStore,combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authSlice";
import { productReducer } from "./reducers/productSlice";
import { customerReducer } from "./reducers/customerSlice";
import { helperReducer } from "./reducers/helperSlice";
import { sellerReducer } from "./reducers/sellerSlice";
import { cartReducer } from "./reducers/cartSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root', // Key to use for storing data in storage
  storage,     // Storage mechanism (local storage or session storage)
  whitelist: ['product', 'customer', 'seller', 'cart'], // Reducers to persist
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
  auth: authReducer,
  product: productReducer,
  customer: customerReducer,
  seller: sellerReducer,
  helper: helperReducer,
  cart: cartReducer,
}));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store); 

export type State = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export {store,persistor}






















