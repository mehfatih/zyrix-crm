"use client";

import { useEffect, useRef } from "react";

type ShortcutHandler = (event: KeyboardEvent) => void;

export interface ShortcutBinding {
  key: string;
  handler: ShortcutHandler;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  allowInInput?: boolean;
  preventDefault?: boolean;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return false;
}

export function useKeyboardShortcuts(
  bindings: ShortcutBinding[],
  enabled = true,
) {
  const ref = useRef(bindings);
  ref.current = bindings;

  useEffect(() => {
    if (!enabled) return;

    const onKey = (e: KeyboardEvent) => {
      for (const b of ref.current) {
        if (!b.allowInInput && isTypingTarget(e.target)) continue;
        if (b.ctrl !== undefined && b.ctrl !== (e.ctrlKey || false)) continue;
        if (b.meta !== undefined && b.meta !== (e.metaKey || false)) continue;
        if (b.shift !== undefined && b.shift !== (e.shiftKey || false)) continue;
        if (b.alt !== undefined && b.alt !== (e.altKey || false)) continue;

        if (b.key.toLowerCase() === e.key.toLowerCase()) {
          if (b.preventDefault !== false) e.preventDefault();
          b.handler(e);
          return;
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}

export interface SequenceBinding {
  prefix: string;
  key: string;
  handler: () => void;
}

export function useSequenceShortcuts(
  bindings: SequenceBinding[],
  enabled = true,
  timeoutMs = 1200,
) {
  const ref = useRef(bindings);
  ref.current = bindings;

  useEffect(() => {
    if (!enabled) return;

    let pending: { prefix: string; at: number } | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const clearPending = () => {
      pending = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) {
        clearPending();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();

      if (!pending) {
        const prefixes = new Set(ref.current.map((b) => b.prefix.toLowerCase()));
        if (prefixes.has(key)) {
          pending = { prefix: key, at: Date.now() };
          timer = setTimeout(clearPending, timeoutMs);
          return;
        }
        return;
      }

      const match = ref.current.find(
        (b) =>
          b.prefix.toLowerCase() === pending!.prefix &&
          b.key.toLowerCase() === key,
      );
      clearPending();
      if (match) {
        e.preventDefault();
        match.handler();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearPending();
    };
  }, [enabled, timeoutMs]);
}
