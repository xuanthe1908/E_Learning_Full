import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../src/redux/api/baseApi';
import { authReducer } from '../src/redux/reducers/authSlice';

describe('RTK Query API slice', () => {
  it('registers the api reducer path', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
    });

    expect(store.getState()).toHaveProperty('api');
  });
});
