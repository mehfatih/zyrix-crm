"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  Edit2,
  Trash2,
  AtSign,
  CornerDownRight,
  X,
  Check,
  User as UserIcon,
} from "lucide-react";
import {
  listComments,
  createComment,
  updateComment,
  deleteComment,
  listMentionableUsers,
  type Comment,
  type CommentEntityType,
  type MentionableUser,
} from "@/lib/api/advanced";
import { useAuth } from "@/lib/auth/context";

// ============================================================================
// COMMENT THREAD
// ----------------------------------------------------------------------------
// Drop-in component for customer/deal/activity detail pages. Shows the
// thread, handles new-comment form with @picker autocomplete, per-row
// Reply/Edit/Delete.
//
// @mention wire format: @[userId:Display Name]
// Rendered as a cyan chip that links nowhere yet (future: link to user profile).
// ============================================================================

interface Props {
  entityType: CommentEntityType;
  entityId: string;
  locale: "en" | "ar" | "tr";
}

export default function CommentThread({ entityType, entityId, locale }: Props) {
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const { user } = useAuth();
  const currentUserId = (user as any)?.id ?? "";
  const currentRole = (user as any)?.role ?? "member";

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [editing, setEditing] = useState<Comment | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listComments(entityType, entityId);
      setComments(data);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (body: string, parentId?: string) => {
    const created = await createComment({
      entityType,
      entityId,
      body,
      parentId,
    });
    setComments((prev) => [...prev, created]);
    setReplyTo(null);
  };

  const handleEdit = async (id: string, body: string) => {
    const updated = await updateComment(id, body);
    setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        tr("Delete this comment?", "حذف هذا التعليق؟", "Bu yorum silinsin mi?")
      )
    )
      return;
    await deleteComment(id);
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, deletedAt: new Date().toISOString(), body: "[deleted]" } : c
      )
    );
  };

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesByParent = new Map<string, Comment[]>();
  for (const c of comments) {
    if (c.parentId) {
      if (!repliesByParent.has(c.parentId)) repliesByParent.set(c.parentId, []);
      repliesByParent.get(c.parentId)!.push(c);
    }
  }

  return (
    <div className="space-y-4" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-sky-600" />
        <h2 className="text-sm font-bold text-sky-900">
          {tr("Comments", "التعليقات", "Yorumlar")}
          <span className="text-xs font-normal text-slate-500 ms-1">
            ({topLevel.length})
          </span>
        </h2>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* New comment form (top-level) */}
      {!replyTo && !editing && (
        <CommentForm
          locale={locale}
          tr={tr}
          onSubmit={handleSubmit}
          placeholder={tr(
            "Add a comment… use @ to mention teammates",
            "أضف تعليق… استعمل @ لذكر زميل",
            "Yorum ekle… meslektaşınızı bahsetmek için @ kullanın"
          )}
        />
      )}

      {/* Thread */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
        </div>
      ) : topLevel.length === 0 ? (
        <div className="rounded-xl border border-dashed border-sky-200 bg-white p-6 text-center">
          <MessageSquare className="w-6 h-6 text-slate-300 mx-auto mb-1" />
          <p className="text-xs text-slate-500">
            {tr(
              "No comments yet — be the first.",
              "لا تعليقات بعد — كن الأول.",
              "Henüz yorum yok — ilk sen ol."
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topLevel.map((c) => (
            <CommentCard
              key={c.id}
              comment={c}
              replies={repliesByParent.get(c.id) ?? []}
              currentUserId={currentUserId}
              currentRole={currentRole}
              locale={locale}
              tr={tr}
              isReplying={replyTo?.id === c.id}
              editingId={editing?.id}
              onStartReply={() => setReplyTo(c)}
              onCancelReply={() => setReplyTo(null)}
              onStartEdit={(com) => setEditing(com)}
              onCancelEdit={() => setEditing(null)}
              onSubmitReply={(body) => handleSubmit(body, c.id)}
              onSubmitEdit={(id, body) => handleEdit(id, body)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMMENT CARD
// ============================================================================

function CommentCard({
  comment,
  replies,
  currentUserId,
  currentRole,
  locale,
  tr,
  isReplying,
  editingId,
  onStartReply,
  onCancelReply,
  onStartEdit,
  onCancelEdit,
  onSubmitReply,
  onSubmitEdit,
  onDelete,
  isReply = false,
}: {
  comment: Comment;
  replies: Comment[];
  currentUserId: string;
  currentRole: string;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  isReplying: boolean;
  editingId: string | undefined;
  onStartReply: () => void;
  onCancelReply: () => void;
  onStartEdit: (c: Comment) => void;
  onCancelEdit: () => void;
  onSubmitReply: (body: string) => Promise<void>;
  onSubmitEdit: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => void;
  isReply?: boolean;
}) {
  const isDeleted = !!comment.deletedAt;
  const isMine = comment.authorId === currentUserId;
  const canEdit = isMine && !isDeleted;
  const canDelete =
    !isDeleted &&
    (isMine || currentRole === "owner" || currentRole === "admin");
  const isEditing = editingId === comment.id;

  return (
    <div className={isReply ? "ms-8" : ""}>
      <div
        className={`rounded-xl border p-3 ${
          isDeleted
            ? "border-slate-200 bg-slate-50 opacity-70"
            : "border-sky-100 bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <Avatar name={comment.author.fullName} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-sky-900">
                {comment.author.fullName}
              </span>
              <span
                className="text-[10px] text-slate-400 tabular-nums"
                dir="ltr"
                title={new Date(comment.createdAt).toLocaleString()}
              >
                {relativeTime(comment.createdAt, locale)}
                {comment.editedAt && " · edited"}
              </span>
            </div>

            {isEditing ? (
              <div className="mt-2">
                <CommentForm
                  locale={locale}
                  tr={tr}
                  initialBody={comment.body}
                  onSubmit={async (body) => {
                    await onSubmitEdit(comment.id, body);
                  }}
                  onCancel={onCancelEdit}
                  compact
                />
              </div>
            ) : (
              <div className="mt-1 text-sm text-slate-800 whitespace-pre-wrap break-words">
                {renderCommentBody(comment.body, isDeleted, tr)}
              </div>
            )}

            {!isEditing && !isDeleted && (
              <div className="mt-2 flex items-center gap-3 text-[11px]">
                {!isReply && (
                  <button
                    onClick={onStartReply}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-sky-600 font-semibold"
                  >
                    <CornerDownRight className="w-3 h-3" />
                    {tr("Reply", "رد", "Yanıtla")}
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => onStartEdit(comment)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-sky-600 font-semibold"
                  >
                    <Edit2 className="w-3 h-3" />
                    {tr("Edit", "تعديل", "Düzenle")}
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-700 font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    {tr("Delete", "حذف", "Sil")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply form inline */}
        {isReplying && (
          <div className="mt-3 ms-11 pt-3 border-t border-sky-50">
            <CommentForm
              locale={locale}
              tr={tr}
              onSubmit={async (body) => {
                await onSubmitReply(body);
              }}
              onCancel={onCancelReply}
              placeholder={tr(
                "Write a reply…",
                "اكتب ردًا…",
                "Bir yanıt yaz…"
              )}
              compact
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {replies.map((r) => (
            <CommentCard
              key={r.id}
              comment={r}
              replies={[]}
              currentUserId={currentUserId}
              currentRole={currentRole}
              locale={locale}
              tr={tr}
              isReplying={false}
              editingId={editingId}
              onStartReply={() => {}}
              onCancelReply={() => {}}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              onSubmitReply={async () => {}}
              onSubmitEdit={onSubmitEdit}
              onDelete={onDelete}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMMENT FORM with @picker
// ============================================================================

function CommentForm({
  locale,
  tr,
  onSubmit,
  onCancel,
  initialBody = "",
  placeholder,
  compact,
  autoFocus,
}: {
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
  initialBody?: string;
  placeholder?: string;
  compact?: boolean;
  autoFocus?: boolean;
}) {
  const [body, setBody] = useState(initialBody);
  const [submitting, setSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [candidates, setCandidates] = useState<MentionableUser[]>([]);
  const [cursorPos, setCursorPos] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Detect @-prefix to trigger picker
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    const pos = e.target.selectionStart ?? newVal.length;
    setBody(newVal);
    setCursorPos(pos);

    // Find last @ before cursor that isn't already part of a completed mention
    const upToCursor = newVal.slice(0, pos);
    const atIdx = upToCursor.lastIndexOf("@");
    if (atIdx === -1) {
      setPickerOpen(false);
      return;
    }
    // If there's a ']' between atIdx and cursor, the previous mention is complete
    const between = upToCursor.slice(atIdx);
    if (between.includes("]") || between.includes("\n") || between.includes(" ")) {
      setPickerOpen(false);
      return;
    }
    const query = between.slice(1); // after '@'
    setPickerQuery(query);
    setPickerOpen(true);
  };

  // Fetch candidates when picker query changes
  useEffect(() => {
    if (!pickerOpen) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const users = await listMentionableUsers(pickerQuery);
        setCandidates(users);
      } catch {
        setCandidates([]);
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [pickerQuery, pickerOpen]);

  const selectMention = (user: MentionableUser) => {
    // Replace the @query prefix with the wire format
    const atIdx = body.slice(0, cursorPos).lastIndexOf("@");
    if (atIdx === -1) return;
    const before = body.slice(0, atIdx);
    const after = body.slice(cursorPos);
    const insertion = `@[${user.id}:${user.fullName}] `;
    const next = `${before}${insertion}${after}`;
    setBody(next);
    setPickerOpen(false);
    setPickerQuery("");
    // Restore focus with cursor after the inserted mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newPos = before.length + insertion.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleSubmit = async () => {
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(body.trim());
      setBody("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="rounded-xl border border-sky-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200 bg-white overflow-hidden">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
            if (e.key === "Escape" && pickerOpen) {
              setPickerOpen(false);
            }
          }}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className="w-full px-3 py-2 text-sm resize-none focus:outline-none bg-transparent"
        />
        <div className="flex items-center justify-between gap-2 px-2 pb-2 border-t border-sky-50 pt-2">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <AtSign className="w-3 h-3" />
            {tr("to mention", "للذكر", "bahsetmek için")}
          </div>
          <div className="flex items-center gap-1">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-2 py-1 text-xs text-slate-500 hover:text-slate-900 font-semibold"
              >
                {tr("Cancel", "إلغاء", "İptal")}
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!body.trim() || submitting}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold"
            >
              {submitting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              {tr("Send", "إرسال", "Gönder")}
            </button>
          </div>
        </div>
      </div>

      {/* Mention picker */}
      {pickerOpen && candidates.length > 0 && (
        <div className="absolute top-full start-0 mt-1 w-64 max-h-48 overflow-y-auto rounded-xl border border-sky-100 bg-white shadow-lg z-20">
          {candidates.map((u) => (
            <button
              key={u.id}
              onClick={() => selectMention(u)}
              className="w-full text-left rtl:text-right flex items-center gap-2 px-3 py-2 hover:bg-sky-50 border-b border-sky-50 last:border-b-0"
            >
              <Avatar name={u.fullName} small />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-sky-900 truncate">
                  {u.fullName}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {u.email}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function Avatar({ name, small }: { name: string; small?: boolean }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-sky-300 to-sky-600 text-white font-bold flex items-center justify-center flex-shrink-0 ${
        small ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
      }`}
    >
      {initials || <UserIcon className={small ? "w-3 h-3" : "w-4 h-4"} />}
    </div>
  );
}

/**
 * Parses @[uuid:Display Name] tokens and renders them as inline chips.
 * Preserves other text as-is.
 */
function renderCommentBody(
  body: string,
  deleted: boolean,
  tr: (en: string, ar: string, trk: string) => string
): React.ReactNode {
  if (deleted) {
    return (
      <span className="italic text-slate-400">
        {tr("[deleted]", "[محذوف]", "[silindi]")}
      </span>
    );
  }
  const parts: React.ReactNode[] = [];
  const re = /@\[([a-f0-9-]+):([^\]]*)\]/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push(body.slice(lastIndex, match.index));
    }
    parts.push(
      <span
        key={`m-${key++}`}
        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-semibold mx-0.5"
      >
        <AtSign className="w-2.5 h-2.5" />
        {match[2]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < body.length) parts.push(body.slice(lastIndex));
  return parts;
}

function relativeTime(
  iso: string,
  locale: "en" | "ar" | "tr"
): string {
  const date = new Date(iso);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(
    locale === "ar" ? "ar" : locale === "tr" ? "tr" : "en",
    { numeric: "auto" }
  );
  if (diffSec < 60) return rtf.format(-diffSec, "second");
  if (diffSec < 3600) return rtf.format(-Math.floor(diffSec / 60), "minute");
  if (diffSec < 86400) return rtf.format(-Math.floor(diffSec / 3600), "hour");
  if (diffSec < 604800) return rtf.format(-Math.floor(diffSec / 86400), "day");
  return date.toLocaleDateString(
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US",
    { month: "short", day: "numeric" }
  );
}
