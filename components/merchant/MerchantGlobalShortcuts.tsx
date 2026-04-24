"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { QuickAddModal } from "./QuickAddModal";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import {
  useKeyboardShortcuts,
  useSequenceShortcuts,
} from "@/hooks/useKeyboardShortcuts";

interface MerchantGlobalShortcutsProps {
  locale: string;
  isRTL: boolean;
}

const QUICK_ADD_EVENT = "zyrix:merchant:open-quick-add";
const CHEATSHEET_EVENT = "zyrix:merchant:open-cheatsheet";

export function openQuickAdd() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(QUICK_ADD_EVENT));
}

export function openCheatSheet() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHEATSHEET_EVENT));
}

export function MerchantGlobalShortcuts({
  locale,
  isRTL,
}: MerchantGlobalShortcutsProps) {
  const router = useRouter();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [cheatOpen, setCheatOpen] = useState(false);

  const go = useCallback(
    (path: string) => {
      router.push(`/${locale}/merchant${path}`);
    },
    [router, locale],
  );

  // Global one-key shortcuts
  useKeyboardShortcuts(
    [
      {
        key: "c",
        handler: () => setQuickAddOpen(true),
        ctrl: false,
        meta: false,
        shift: false,
        alt: false,
      },
      {
        key: "?",
        handler: () => setCheatOpen(true),
      },
    ],
    !quickAddOpen && !cheatOpen,
  );

  // Navigation sequences: G then H/D/C/T/M/S
  useSequenceShortcuts(
    [
      { prefix: "g", key: "h", handler: () => go("") },
      { prefix: "g", key: "d", handler: () => go("/deals") },
      { prefix: "g", key: "c", handler: () => go("/contacts") },
      { prefix: "g", key: "t", handler: () => go("/tasks") },
      { prefix: "g", key: "m", handler: () => go("/conversations") },
      { prefix: "g", key: "s", handler: () => go("/settings") },
    ],
    !quickAddOpen && !cheatOpen,
  );

  // Listen for custom events (triggered by "+" button or sidebar)
  useEffect(() => {
    const openAdd = () => setQuickAddOpen(true);
    const openCheat = () => setCheatOpen(true);
    window.addEventListener(QUICK_ADD_EVENT, openAdd);
    window.addEventListener(CHEATSHEET_EVENT, openCheat);
    return () => {
      window.removeEventListener(QUICK_ADD_EVENT, openAdd);
      window.removeEventListener(CHEATSHEET_EVENT, openCheat);
    };
  }, []);

  return (
    <>
      <QuickAddModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        locale={locale}
        isRTL={isRTL}
      />
      <KeyboardShortcutsModal
        open={cheatOpen}
        onClose={() => setCheatOpen(false)}
        isRTL={isRTL}
      />
    </>
  );
}
