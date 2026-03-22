import { useState } from 'react'
import { MessageSquare, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { formatDateTime } from '#/lib/mock-data'
import type { Note } from '#/lib/types'

interface NoteFormValues {
  content: string
}

interface NotesThreadProps {
  reportId: string
  initialNotes: Note[]
}

export function NotesThread({ reportId, initialNotes }: NotesThreadProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({ defaultValues: { content: '' } })

  const onSubmit = (values: NoteFormValues) => {
    const newNote: Note = {
      id: `nt_${Date.now()}`,
      reportId,
      authorId: 'mod_current',
      authorName: 'Current Moderator',
      content: values.content,
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [...prev, newNote])
    reset()
    setIsFormOpen(false)
  }

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
          <MessageSquare size={16} />
          Internal Notes ({notes.length})
        </h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-1 rounded-lg bg-accent-subtle px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
        >
          <Plus size={14} />
          Add Note
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-b border-border p-5"
        >
          <textarea
            {...register('content', { required: 'Note content is required.' })}
            rows={3}
            placeholder="Write an internal note..."
            className="w-full resize-none rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-primary outline-none"
          />
          {errors.content && (
            <p className="mt-1 text-xs text-danger">{errors.content.message}</p>
          )}
          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Post Note
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false)
                reset()
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-surface-hover"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-border-subtle">
        {notes.length === 0 ? (
          <p className="p-5 text-sm text-muted">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="px-5 py-3.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">
                  {note.authorName}
                </span>
                <span className="text-[10px] text-muted">
                  {formatDateTime(note.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-secondary">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
