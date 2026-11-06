import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './components/Button';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Toast } from './components/Toast';
import { DeleteConfirm } from './features/notes/components/DeleteConfirm';
import { NoteForm } from './features/notes/components/NoteForm';
import { NoteList } from './features/notes/components/NoteList';
import { openCreate } from './features/notes/notesUiSlice';

export default function App() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const editor = useSelector((state) => state.notesUi.editor);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">{t('app.title')}</h1>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="primary" onClick={() => dispatch(openCreate())}>
              {t('notes.add')}
            </Button>
          </div>
        </header>

        <main>
          <NoteList />
        </main>
      </div>

      {editor.mode === 'create' && <NoteForm />}
      {editor.mode === 'edit' && <NoteForm key={editor.note.id} note={editor.note} />}
      <DeleteConfirm />
      <Toast />
    </div>
  );
}