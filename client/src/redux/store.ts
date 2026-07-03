import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authSlice";
import { courseReducer } from "./reducers/courseSlice";
import { studentReducer } from "./reducers/studentSlice";
import { helperReducer } from "./reducers/helperSlice";
import { instructorReducer } from "./reducers/instructorSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { baseApi } from './api/baseApi';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['course', 'student', 'instructor'],
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
  auth: authReducer,
  course: courseReducer,
  student: studentReducer,
  instructor: instructorReducer,
  helper: helperReducer,
  [baseApi.reducerPath]: baseApi.reducer,
}));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
});

const persistor = persistStore(store); 

export type State = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export {store,persistor}
