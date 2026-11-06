import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';
import { useGetNotesQuery } from '../notesApi';
import { NoteCard } from './NoteCard';

const stateClass = 'py-12 text-center text-slate-500 dark:text-slate-400';

export function NoteList() {
  const { t } = useTranslation();
  const { data: notes, isLoading, isError, refetch } = useGetNotesQuery();

  if (isLoading) {
    return (
      <p className={stateClass} role="status">
        {t('notes.loading')}
      </p>
    );
  }

  if (isError) {
    return (
      <div className={stateClass} role="alert">
        <p className="mb-3">{t('notes.loadError')}</p>
        <Button onClick={() => refetch()}>{t('notes.retry')}</Button>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return <p className={stateClass}>{t('notes.empty')}</p>;
  }

  return (
    <ul className="grid gap-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </ul>
  );
}