import axios from 'axios';

export interface DriveSyncStatus {
  connected: boolean;
  lastSync: string | null;
  itemsSynced: number;
  errors: number;
}

class GoogleDriveService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL ?? '';

  async getStatus(): Promise<DriveSyncStatus> {
    try {
      const { data } = await axios.get(
        `${this.baseURL}/api/integrations/google-drive/status`,
        { timeout: 5000 },
      );
      return data;
    } catch {
      return { connected: false, lastSync: null, itemsSynced: 0, errors: 0 };
    }
  }

  connect(): void {
    if (typeof window !== 'undefined') {
      window.location.href = `${this.baseURL}/api/integrations/google-drive/connect`;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/api/integrations/google-drive/disconnect`);
    } catch {}
  }
}

export const googleDriveService = new GoogleDriveService();
