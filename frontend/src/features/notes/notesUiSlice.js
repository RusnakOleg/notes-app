import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editor: { mode: 'closed' }, // { mode: 'closed' } | { mode: 'create' } | { mode: 'edit', note }
  deleteTarget: null,
  toast: null, // { id, type: 'success' | 'error', messageKey }
};

const notesUiSlice = createSlice({
  name: 'notesUi',
  initialState,
  reducers: {
    openCreate(state) {
      state.editor = { mode: 'create' };
    },
    openEdit(state, action) {
      state.editor = { mode: 'edit', note: action.payload };
    },
    closeEditor(state) {
      state.editor = { mode: 'closed' };
    },
    askDelete(state, action) {
      state.deleteTarget = action.payload;
    },
    cancelDelete(state) {
      state.deleteTarget = null;
    },
    showToast: {
      reducer(state, action) {
        state.toast = action.payload;
      },
      // messageKey - ключ перекладу
      prepare(toast) {
        return { payload: { ...toast, id: Date.now() } };
      },
    },
    hideToast(state) {
      state.toast = null;
    },
  },
});

export const {
  openCreate,
  openEdit,
  closeEditor,
  askDelete,
  cancelDelete,
  showToast,
  hideToast,
} = notesUiSlice.actions;

export default notesUiSlice.reducer;