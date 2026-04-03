import { API_URL } from '#/lib/env';
import { authClient } from '#/lib/auth-client';
import { createReportNote } from '@repo/shared/api/moderation';
import { formatDateTime } from '#/lib/format';
import { MessageSquare, Plus } from 'lucide-react';
import type { ModerationNote } from '@repo/types';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface NoteFormValues {
  content: string;
}

interface NotesThreadProps {
  reportId: string;
  initialNotes: ModerationNote[];
}

export function NotesThread({ reportId, initialNotes }: NotesThreadProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({ defaultValues: { content: '' } });

  const createNoteMutation = useMutation({
    mutationFn: (content: string) => createReportNote(authClient as never, API_URL, reportId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-notes', reportId] });
      reset();
      setIsFormOpen(false);
    },
  });

  const onSubmit = (values: NoteFormValues) => {
    createNoteMutation.mutate(values.content);
  };

  return (
    <div className="border-border bg-surface rounded-xl border">
      <div className="border-border flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-primary flex items-center gap-2 text-sm font-semibold">
          <MessageSquare size={16} />
          Internal Notes ({initialNotes.length})
        </h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-accent-subtle text-accent hover:bg-accent/20 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
        >
          <Plus size={14} />
          Add Note
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="border-border border-b p-5">
          <textarea
            {...register('content', { required: 'Note content is required.' })}
            rows={3}
            placeholder="Write an internal note..."
            className="border-border bg-surface-raised text-primary w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
          />
          {errors.content && <p className="text-danger mt-1 text-xs">{errors.content.message}</p>}
          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              disabled={createNoteMutation.isPending}
              className="bg-accent hover:bg-accent-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {createNoteMutation.isPending ? 'Posting...' : 'Post Note'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                reset();
              }}
              className="border-border text-secondary hover:bg-surface-hover rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="divide-border-subtle divide-y">
        {initialNotes.length === 0 ? (
          <p className="text-muted p-5 text-sm">No notes yet.</p>
        ) : (
          initialNotes.map(note => (
            <div key={note.id} className="px-5 py-3.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-primary text-xs font-semibold">{note.authorName}</span>
                <span className="text-muted text-[10px]">{formatDateTime(note.createdAt)}</span>
              </div>
              <p className="text-secondary text-sm leading-relaxed">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
