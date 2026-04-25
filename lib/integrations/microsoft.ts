import axios from 'axios';

export interface MicrosoftSyncStatus {
  connected: boolean;
  lastSync: string | null;
  itemsSynced: number;
  errors: number;
}

class MicrosoftService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL ?? '';

  async getStatus(): Promise<MicrosoftSyncStatus> {
    try {
      const { data } = await axios.get(
        `${this.baseURL}/api/integrations/microsoft/status`,
        { timeout: 5000 },
      );
      return data;
    } catch {
      return { connected: false, lastSync: null, itemsSynced: 0, errors: 0 };
    }
  }

  connect(): void {
    if (typeof window !== 'undefined') {
      window.location.href = `${this.baseURL}/api/integrations/microsoft/connect`;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/api/integrations/microsoft/disconnect`);
    } catch {}
  }
}

export const microsoftService = new MicrosoftService();
