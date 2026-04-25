'use client';

import { useEffect } from 'react';
import { useAIStore, type AIPanelContext } from '@/lib/stores/aiStore';

/**
 * Auto-sync AI panel context with the current page.
 * Call at the top of any authenticated page component.
 *
 * Example:
 *   usePageContextSync('customers');
 */
export function usePageContextSync(
  context: AIPanelContext,
  selectedEntity?: { id: string; type: string } | null,
) {
  const setContext = useAIStore((s) => s.setContext);
  const setSelectedEntity = useAIStore((s) => s.setSelectedEntity);

  useEffect(() => {
    setContext(context);
  }, [context, setContext]);

  useEffect(() => {
    if (selectedEntity) {
      setSelectedEntity(selectedEntity.id, selectedEntity.type);
    } else {
      setSelectedEntity(null, null);
    }
  }, [selectedEntity?.id, selectedEntity?.type, setSelectedEntity, selectedEntity]);
}
