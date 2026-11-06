import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { useCreateNoteMutation, useUpdateNoteMutation } from '../notesApi';
import { closeEditor, showToast } from '../notesUiSlice';

// Ті самі ліміти, що й на бекенді (DTO та AppDbContext)
const TITLE_MAX = 200;
const CONTENT_MAX = 10000;

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 aria-[invalid=true]:border-red-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';
const errorClass = 'text-sm text-red-600 dark:text-red-400';

export function NoteForm({ note }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [createNote, { isLoading: creating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: updating }] = useUpdateNoteMutation();

  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    title: !title.trim()
      ? t('validation.titleRequired')
      : title.length > TITLE_MAX
        ? t('validation.titleTooLong', { max: TITLE_MAX })
        : null,
    content:
      content.length > CONTENT_MAX ? t('validation.contentTooLong', { max: CONTENT_MAX }) : null,
  };
  const saving = creating || updating;
  const close = () => dispatch(closeEditor());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.title || errors.content) return;

    try {
      if (note) {
        await updateNote({ id: note.id, title, content }).unwrap();
        dispatch(showToast({ type: 'success', messageKey: 'toast.updated' }));
      } else {
        await createNote({ title, content }).unwrap();
        dispatch(showToast({ type: 'success', messageKey: 'toast.created' }));
      }
      close();
    } catch (err) {
      const notFound = err?.status === 404;
      dispatch(
        showToast({ type: 'error', messageKey: notFound ? 'toast.notFound' : 'toast.error' }),
      );
      if (notFound) close();
    }
  };

  return (
    <Modal titleId="note-form-title" onClose={close}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 id="note-form-title" className="mb-4 text-xl font-semibold">
          {note ? t('form.editTitle') : t('form.createTitle')}
        </h2>

        <div className="mb-3 grid gap-1.5">
          <label htmlFor="note-title" className="text-sm font-medium">
            {t('form.titleLabel')}
          </label>
          <input
            id="note-title"
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            aria-invalid={submitted && !!errors.title}
          />
          {submitted && errors.title && <p className={errorClass}>{errors.title}</p>}
        </div>

        <div className="mb-3 grid gap-1.5">
          <label htmlFor="note-content" className="text-sm font-medium">
            {t('form.contentLabel')}
          </label>
          <textarea
            id="note-content"
            className={inputClass}
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-invalid={submitted && !!errors.content}
          />
          {submitted && errors.content && <p className={errorClass}>{errors.content}</p>}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={close}>{t('form.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? t('form.saving') : t('form.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}