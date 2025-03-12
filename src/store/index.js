import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice';
import dogsReducer from '../features/dogs/slice';
import favoritesReducer from '../features/favorites/slice';
import performanceMiddleware from './middleware/performanceMiddleware';

// Store setup with all reducers and middleware
const store = configureStore({
  reducer: {
    auth: authReducer,
    dogs: dogsReducer,
    favorites: favoritesReducer,
    // ui: uiReducer - will be added later if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(performanceMiddleware),
});

// Export store hooks for typing
export * from './hooks';
export default store; 