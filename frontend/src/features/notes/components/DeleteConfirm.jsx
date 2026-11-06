import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { useDeleteNoteMutation } from '../notesApi';
import { cancelDelete, showToast } from '../notesUiSlice';

export function DeleteConfirm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const note = useSelector((state) => state.notesUi.deleteTarget);
  const [deleteNote, { isLoading }] = useDeleteNoteMutation();

  if (!note) return null;

  const close = () => dispatch(cancelDelete());

  const confirm = async () => {
    try {
      await deleteNote(note.id).unwrap();
      dispatch(showToast({ type: 'success', messageKey: 'toast.deleted' }));
    } catch (err) {
      const notFound = err?.status === 404;
      dispatch(
        showToast({ type: 'error', messageKey: notFound ? 'toast.notFound' : 'toast.error' }),
      );
    } finally {
      close();
    }
  };

  return (
    <Modal titleId="delete-title" onClose={close}>
      <h2 id="delete-title" className="mb-2 text-xl font-semibold">
        {t('confirmDelete.title')}
      </h2>
      <p className="wrap-break-word">{t('confirmDelete.message', { title: note.title })}</p>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={close}>{t('confirmDelete.cancel')}</Button>
        <Button variant="danger" onClick={confirm} disabled={isLoading}>
          {t('confirmDelete.confirm')}
        </Button>
      </div>
    </Modal>
  );
}