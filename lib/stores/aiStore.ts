'use client';

import { create } from 'zustand';

export type AIPanelContext =
  | 'dashboard'
  | 'customers'
  | 'deals'
  | 'pipeline'
  | 'reports'
  | 'messaging'
  | 'agents'
  | 'settings'
  | 'generic';

export interface AIPanelState {
  isOpen: boolean;
  context: AIPanelContext;
  selectedEntityId: string | null;
  selectedEntityType: string | null;
}

export interface AIStore extends AIPanelState {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setContext: (context: AIPanelContext) => void;
  setSelectedEntity: (id: string | null, type: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE: AIPanelState = {
  isOpen: false,
  context: 'generic',
  selectedEntityId: null,
  selectedEntityType: null,
};

export const useAIStore = create<AIStore>((set) => ({
  ...INITIAL_STATE,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setContext: (context) => set({ context }),
  setSelectedEntity: (id, type) =>
    set({ selectedEntityId: id, selectedEntityType: type }),
  reset: () => set(INITIAL_STATE),
}));
