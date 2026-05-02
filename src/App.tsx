import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Circle,
  ListTodo,
  LogOut,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react'
import { supabase, type Task, type TaskWithProfile } from './supabaseClient'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'info'; text: string } | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      setMessage({ type: 'error', text: 'ユーザー名を入力してください。' })
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, username: trimmedUsername })

      if (profileError) {
        setMessage({
          type: 'error',
          text: `アカウントは作成されましたが、プロフィールの保存に失敗しました: ${profileError.message}`,
        })
        setLoading(false)
        return
      }
    }

    if (!data.session) {
      setMessage({
        type: 'info',
        text: '確認メールを送信しました。メールを確認してアカウントを有効化してください。',
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 sm:py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ListTodo size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-800">Shared Tasks</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            {mode === 'login' ? 'おかえりなさい' : 'はじめまして'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {mode === 'login'
              ? 'メールアドレスとパスワードでログイン'
              : 'アカウントを作成してチームでタスクを共有しましょう'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  ユーザー名
                </label>
                <input
                  type="text"
                  required
                  maxLength={32}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="チームに表示される名前"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                メールアドレス
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                パスワード
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="6文字以上"
              />
            </div>

            {message && (
              <div
                className={`text-sm rounded-xl px-3 py-2.5 ${
                  message.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'bg-blue-50 text-blue-700 border border-blue-100'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
            >
              {loading
                ? '処理中...'
                : mode === 'login'
                  ? 'ログイン'
                  : 'アカウントを作成'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {mode === 'login'
              ? 'アカウントをお持ちでない方は'
              : 'すでにアカウントをお持ちの方は'}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setMessage(null)
              }}
              className="ml-1 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              {mode === 'login' ? 'サインアップ' : 'ログイン'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type ProfileEditModalProps = {
  open: boolean
  currentUsername: string
  onClose: () => void
  onSave: (newUsername: string) => Promise<{ error?: string }>
}

function ProfileEditModal({
  open,
  currentUsername,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  const [value, setValue] = useState(currentUsername)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setValue(currentUsername)
      setError(null)
      setSaving(false)
    }
  }, [open, currentUsername])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setError('ユーザー名を入力してください。')
      return
    }
    if (trimmed === currentUsername) {
      onClose()
      return
    }

    setSaving(true)
    setError(null)
    const result = await onSave(trimmed)
    setSaving(false)

    if (result.error) {
      setError(result.error)
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-default"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-5 sm:p-6 animate-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">プロフィール編集</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              チームに表示される名前を変更します
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="閉じる"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              ユーザー名
            </label>
            <input
              type="text"
              required
              maxLength={32}
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
              placeholder="新しい名前"
            />
          </div>

          {error && (
            <div className="text-sm bg-red-50 text-red-700 border border-red-100 rounded-xl px-3 py-2.5">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving || !value.trim()}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 transition-all"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function avatarColor(seed: string) {
  const palette = [
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-sky-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
  ]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return palette[Math.abs(hash) % palette.length]
}

function Avatar({ name, userId }: { name: string; userId: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold text-white ${avatarColor(userId)}`}
    >
      {initial}
    </div>
  )
}

type TaskItemProps = {
  task: Task
  authorName: string
  isMine: boolean
  onToggle: (task: Task) => void
  onRequestDelete: (task: Task) => void
  onEdit: (task: Task, newTitle: string) => Promise<{ error?: string }>
}

function TaskItem({
  task,
  authorName,
  isMine,
  onToggle,
  onRequestDelete,
  onEdit,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  useEffect(() => {
    if (!editing) setDraft(task.title)
  }, [task.title, editing])

  const startEdit = () => {
    setDraft(task.title)
    setEditError(null)
    setEditing(true)
  }

  const cancelEdit = () => {
    setDraft(task.title)
    setEditError(null)
    setEditing(false)
  }

  const saveEdit = async () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      setEditError('タイトルを入力してください。')
      return
    }
    if (trimmed === task.title) {
      setEditing(false)
      return
    }

    setSaving(true)
    setEditError(null)
    const result = await onEdit(task, trimmed)
    setSaving(false)

    if (result.error) {
      setEditError(result.error)
      return
    }
    setEditing(false)
  }

  return (
    <li className="px-3 sm:px-4 py-3 sm:py-3.5 hover:bg-slate-50/70 transition-colors group">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={() => onToggle(task)}
          disabled={!isMine || editing}
          className="flex-shrink-0 p-1 -m-1 text-slate-300 hover:text-indigo-600 disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-colors"
          aria-label="完了切り替え"
        >
          {task.is_completed ? (
            <CheckCircle2 size={22} className="text-indigo-600" />
          ) : (
            <Circle size={22} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              autoFocus
              value={draft}
              maxLength={200}
              disabled={saving}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void saveEdit()
                } else if (e.key === 'Escape') {
                  e.preventDefault()
                  cancelEdit()
                }
              }}
              className="w-full px-3 py-1.5 border border-indigo-300 rounded-lg text-[15px] text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-60"
            />
          ) : (
            <div
              className={`text-[15px] break-all ${
                task.is_completed ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {task.title}
            </div>
          )}
          {!isMine && !editing && (
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 truncate">
              <Avatar name={authorName} userId={task.user_id} />
              <span className="truncate">{authorName}</span>
            </div>
          )}
        </div>

        {isMine && !editing && (
          <div className="flex-shrink-0 flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-all">
            <button
              onClick={startEdit}
              className="p-2 rounded-lg text-slate-400 sm:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label="編集"
              title="編集"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onRequestDelete(task)}
              className="p-2 rounded-lg text-slate-400 sm:text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="削除"
              title="削除"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {isMine && editing && (
          <div className="flex-shrink-0 flex items-center gap-1">
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
              aria-label="キャンセル"
              title="キャンセル (Esc)"
            >
              <X size={16} />
            </button>
            <button
              onClick={() => void saveEdit()}
              disabled={saving || !draft.trim()}
              className="p-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-500/20 transition-all"
              aria-label="保存"
              title="保存 (Enter)"
            >
              <Check size={16} />
            </button>
          </div>
        )}
      </div>

      {editing && editError && (
        <div className="ml-9 mt-1.5 text-xs text-red-600">{editError}</div>
      )}
    </li>
  )
}

type ConfirmDialogProps = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'OK',
  cancelLabel = 'キャンセル',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
      else if (e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onCancel, onConfirm])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onCancel}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-default"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-5 sm:p-6">
        <div className="flex gap-3 items-start mb-4">
          {destructive && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-800">{title}</h2>
            {description && (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-sm font-medium text-white shadow-lg transition-all ${
              destructive
                ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/30'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function TaskApp({ session }: { session: Session }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [profiles, setProfiles] = useState<Record<string, string>>({})
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const myUserId = session.user.id

  const resolveProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .maybeSingle()
    if (data?.username) {
      setProfiles((prev) => ({ ...prev, [userId]: data.username }))
    }
  }

  useEffect(() => {
    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const items = (data ?? []) as TaskWithProfile[]
      const fetchedTasks: Task[] = items.map(({ profiles: _p, ...t }) => t)
      const profileMap: Record<string, string> = {}
      for (const item of items) {
        if (item.profiles?.username) {
          profileMap[item.user_id] = item.profiles.username
        }
      }

      // Always make sure the current user's profile is in the cache
      if (!profileMap[myUserId]) {
        const { data: me } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', myUserId)
          .maybeSingle()
        if (me?.username) profileMap[myUserId] = me.username
      }

      setTasks(fetchedTasks)
      setProfiles(profileMap)
      setLoading(false)
    }

    fetchInitial()

    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tasks' },
        (payload) => {
          const newTask = payload.new as Task
          setTasks((prev) => {
            if (prev.some((t) => t.id === newTask.id)) return prev
            return [newTask, ...prev]
          })
          setProfiles((prev) => {
            if (prev[newTask.user_id]) return prev
            void resolveProfile(newTask.user_id)
            return prev
          })
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tasks' },
        (payload) => {
          const updated = payload.new as Task
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'tasks' },
        (payload) => {
          const deleted = payload.old as Task
          setTasks((prev) => prev.filter((t) => t.id !== deleted.id))
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        (payload) => {
          const profile = payload.new as { id: string; username: string }
          setProfiles((prev) => ({ ...prev, [profile.id]: profile.username }))
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          const profile = payload.new as { id: string; username: string }
          setProfiles((prev) => ({ ...prev, [profile.id]: profile.username }))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId])

  const addTask = async (e: FormEvent) => {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title) return

    setNewTitle('')

    const tempId = `temp-${crypto.randomUUID()}`
    const optimistic: Task = {
      id: tempId,
      title,
      is_completed: false,
      user_id: myUserId,
      created_at: new Date().toISOString(),
    }
    setTasks((prev) => [optimistic, ...prev])

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, is_completed: false, user_id: myUserId })
      .select()
      .single()

    if (error) {
      setError(error.message)
      setTasks((prev) => prev.filter((t) => t.id !== tempId))
      return
    }

    setTasks((prev) => {
      const withoutTemp = prev.filter((t) => t.id !== tempId)
      if (withoutTemp.some((t) => t.id === data.id)) return withoutTemp
      return [data as Task, ...withoutTemp]
    })
  }

  const toggleTask = async (task: Task) => {
    if (task.user_id !== myUserId) return
    const next = !task.is_completed
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, is_completed: next } : t)),
    )

    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: next })
      .eq('id', task.id)

    if (error) {
      setError(error.message)
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, is_completed: !next } : t)),
      )
    }
  }

  const deleteTask = async (id: string) => {
    const target = tasks.find((t) => t.id === id)
    if (!target || target.user_id !== myUserId) return
    const snapshot = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))

    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      setError(error.message)
      setTasks(snapshot)
    }
  }

  const editTask = async (
    task: Task,
    newTitle: string,
  ): Promise<{ error?: string }> => {
    if (task.user_id !== myUserId) {
      return { error: '他のユーザーのタスクは編集できません。' }
    }
    const previousTitle = task.title
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, title: newTitle } : t)),
    )

    const { error } = await supabase
      .from('tasks')
      .update({ title: newTitle })
      .eq('id', task.id)

    if (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, title: previousTitle } : t)),
      )
      return { error: error.message }
    }
    return {}
  }

  const requestDelete = (task: Task) => {
    if (task.user_id !== myUserId) return
    setTaskToDelete(task)
  }

  const confirmDelete = async () => {
    if (!taskToDelete) return
    const id = taskToDelete.id
    setTaskToDelete(null)
    await deleteTask(id)
  }

  const updateProfile = async (
    newUsername: string,
  ): Promise<{ error?: string }> => {
    const previous = profiles[myUserId]
    setProfiles((prev) => ({ ...prev, [myUserId]: newUsername }))

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: myUserId, username: newUsername })

    if (error) {
      setProfiles((prev) => {
        const next = { ...prev }
        if (previous === undefined) delete next[myUserId]
        else next[myUserId] = previous
        return next
      })
      return { error: error.message }
    }
    return {}
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const myTasks = useMemo(
    () => tasks.filter((t) => t.user_id === myUserId),
    [tasks, myUserId],
  )
  const teamTasks = useMemo(
    () => tasks.filter((t) => t.user_id !== myUserId),
    [tasks, myUserId],
  )

  const myName = profiles[myUserId] ?? session.user.email?.split('@')[0] ?? 'あなた'
  const remaining = myTasks.filter((t) => !t.is_completed).length
  const completed = myTasks.length - remaining

  const renderAuthor = (userId: string) =>
    profiles[userId] ?? '匿名ユーザー'

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <ListTodo size={18} className="text-white" />
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-base font-bold text-slate-800 truncate">
                Shared Tasks
              </div>
              <div className="text-xs text-slate-500 truncate">
                <span className="font-medium">{myName}</span>
                <span className="hidden sm:inline"> ({session.user.email})</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="プロフィール編集"
            >
              <Pencil size={16} />
              <span className="hidden sm:inline">プロフィール</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="ログアウト"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">ログアウト</span>
            </button>
          </div>
        </div>
      </header>

      <ProfileEditModal
        open={profileModalOpen}
        currentUsername={myName}
        onClose={() => setProfileModalOpen(false)}
        onSave={updateProfile}
      />

      <ConfirmDialog
        open={taskToDelete !== null}
        title="このタスクを削除しますか？"
        description={
          taskToDelete
            ? `「${taskToDelete.title}」を削除します。この操作は元に戻せません。`
            : undefined
        }
        confirmLabel="削除する"
        cancelLabel="キャンセル"
        destructive
        onConfirm={() => void confirmDelete()}
        onCancel={() => setTaskToDelete(null)}
      />

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
            タスク共有アプリ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-500 flex-shrink-0" />
            <span>みんなでタスクを共有しましょう</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
          <div className="bg-white rounded-xl border border-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
            <div className="text-[11px] sm:text-xs font-medium text-slate-500">
              自分
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-800">
              {myTasks.length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
            <div className="text-[11px] sm:text-xs font-medium text-slate-500">
              残り
            </div>
            <div className="text-xl sm:text-2xl font-bold text-indigo-600">
              {remaining}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
            <div className="text-[11px] sm:text-xs font-medium text-slate-500">
              完了
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {completed}
            </div>
          </div>
        </div>

        <form onSubmit={addTask} className="flex gap-2 mb-6 sm:mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="新しいタスクを入力..."
            className="flex-1 min-w-0 px-3 sm:px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-white shadow-sm text-[15px]"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            aria-label="タスクを追加"
            className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 transition-all min-w-[48px]"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">追加</span>
          </button>
        </form>

        {error && (
          <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-12 text-center text-slate-400 text-sm">
            読み込み中...
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <User size={15} className="text-indigo-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">自分のタスク</h2>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {myTasks.length}
                </span>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {myTasks.length === 0 ? (
                  <div className="p-8 sm:p-10 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-50 flex items-center justify-center">
                      <ListTodo size={22} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 text-sm">自分のタスクはまだありません</p>
                    <p className="text-slate-400 text-xs mt-1">
                      上のフォームから追加しましょう
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {myTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        authorName={myName}
                        isMine={true}
                        onToggle={toggleTask}
                        onRequestDelete={requestDelete}
                        onEdit={editTask}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users size={15} className="text-purple-600" />
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  みんなのタスク
                </h2>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {teamTasks.length}
                </span>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {teamTasks.length === 0 ? (
                  <div className="p-8 sm:p-10 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-50 flex items-center justify-center">
                      <Users size={22} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 text-sm">
                      まだみんなのタスクはありません
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {teamTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        authorName={renderAuthor(task.user_id)}
                        isMine={false}
                        onToggle={toggleTask}
                        onRequestDelete={requestDelete}
                        onEdit={editTask}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-400 text-sm">
        読み込み中...
      </div>
    )
  }

  return session ? <TaskApp session={session} /> : <Auth />
}
