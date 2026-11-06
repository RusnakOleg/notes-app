import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button } from '../../../components/Button';
import { askDelete, openEdit } from '../notesUiSlice';

export function NoteCard({ note }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-1.5 wrap-break-word text-lg font-semibold">{note.title}</h2>
      {note.content && <p className="mb-3 whitespace-pre-wrap wrap-break-word">{note.content}</p>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <time className="text-sm text-slate-500 dark:text-slate-400" dateTime={note.updatedAt}>
          {t('notes.updatedAt', { date: new Date(note.updatedAt).toLocaleString(i18n.language) })}
        </time>
        <div className="flex gap-2">
          <Button onClick={() => dispatch(openEdit(note))}>{t('notes.edit')}</Button>
          <Button variant="danger" onClick={() => dispatch(askDelete(note))}>
            {t('notes.delete')}
          </Button>
        </div>
      </div>
    </li>
  );
}