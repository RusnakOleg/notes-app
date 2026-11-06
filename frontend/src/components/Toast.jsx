import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../features/notes/notesUiSlice';

export function Toast() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.notesUi.toast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch(hideToast()), 4000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const color = toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600';

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2.5 text-white shadow-lg ${color}`}
      role={toast.type === 'error' ? 'alert' : 'status'}
    >
      {t(toast.messageKey)}
    </div>
  );
}