import { configureStore } from '@reduxjs/toolkit';
import { notesApi } from '../features/notes/notesApi';
import notesUiReducer from '../features/notes/notesUiSlice';

export const store = configureStore({
  reducer: {
    [notesApi.reducerPath]: notesApi.reducer,
    notesUi: notesUiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(notesApi.middleware),
});