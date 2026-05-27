import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type UserRole = "owner" | "admin" | "operator" | "viewer" | "";
export type Edition = "standard" | "lite";

export interface TenantMembership {
  id: string;
  name: string;
  slug: string;
  isOwner: boolean;
}

interface AuthState {
  token: string;
  userId: string;
  senderID: string;
  connected: boolean;
  role: UserRole;
  serverInfo: { name?: string; version?: string } | null;
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  isOwner: boolean;
  isMasterScope: boolean;
  edition: Edition;
  availableTenants: TenantMembership[];
  tenantSelected: boolean;
}

interface AuthActions {
  setCredentials: (token: string, userId: string) => void;
  setPairing: (senderID: string, userId: string) => void;
  setConnected: (connected: boolean, serverInfo?: { name?: string; version?: string }) => void;
  setRole: (role: UserRole) => void;
  setTenant: (id: string, name: string, slug: string, isOwner: boolean) => void;
  setConnectInfo: (info: { isMasterScope: boolean; edition: Edition }) => void;
  setAvailableTenants: (tenants: TenantMembership[]) => void;
  setTenantSelected: (selected: boolean) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

const LOCAL_STORAGE_KEYS = {
  TENANT_ID: 'goclaw:tenant_id',
  TENANT_HINT: 'goclaw:tenant_hint',
  AUTH: 'goclaw:auth'
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState & AuthActions>({
    token: "",
    userId: "",
    senderID: "",
    connected: false,
    role: "" as UserRole,
    serverInfo: null,
    tenantId: "",
    tenantName: "",
    tenantSlug: "",
    isOwner: false,
    isMasterScope: false,
    edition: "standard" as Edition,
    availableTenants: [],
    tenantSelected: false,
    
    // Actions will be added after store creation
    setCredentials: () => {},
    setPairing: () => {},
    setConnected: () => {},
    setRole: () => {},
    setTenant: () => {},
    setConnectInfo: () => {},
    setAvailableTenants: () => {},
    setTenantSelected: () => {},
    logout: () => {},
    loadFromStorage: () => {}
  });

  const store = {
    subscribe,
    setCredentials: (token: string, userId: string) => {
      update(s => ({ ...s, token, userId }));
    },
    
    setPairing: (senderID: string, userId: string) => {
      update(s => ({ ...s, senderID, userId }));
    },
    
    setConnected: (connected: boolean, serverInfo?: { name?: string; version?: string }) => {
      update(s => ({ ...s, connected, serverInfo: serverInfo ?? null }));
    },
    
    setRole: (role: UserRole) => {
      update(s => ({ ...s, role }));
    },
    
    setTenant: (id: string, name: string, slug: string, isOwner: boolean) => {
      update(s => ({ ...s, tenantId: id, tenantName: name, tenantSlug: slug, isOwner }));
    },
    
    setConnectInfo: ({ isMasterScope, edition }: { isMasterScope: boolean; edition: Edition }) => {
      update(s => ({ ...s, isMasterScope, edition }));
    },
    
    setAvailableTenants: (tenants: TenantMembership[]) => {
      update(s => ({ ...s, availableTenants: tenants }));
    },
    
    setTenantSelected: (selected: boolean) => {
      update(s => ({ ...s, tenantSelected: selected }));
    },
    
    logout: () => {
      if (browser) {
        localStorage.removeItem("goclaw:tenant_id");
        localStorage.removeItem("goclaw:tenant_hint");
      }
      set({
        token: "", userId: "", senderID: "", connected: false, role: "", serverInfo: null,
        tenantId: "", tenantName: "", tenantSlug: "", isOwner: false,
        isMasterScope: false, edition: "standard",
        availableTenants: [], tenantSelected: false,
        
        // Keep actions
        setCredentials: store.setCredentials,
        setPairing: store.setPairing,
        setConnected: store.setConnected,
        setRole: store.setRole,
        setTenant: store.setTenant,
        setConnectInfo: store.setConnectInfo,
        setAvailableTenants: store.setAvailableTenants,
        setTenantSelected: store.setTenantSelected,
        logout: store.logout,
        loadFromStorage: store.loadFromStorage
      });
    },
    
    loadFromStorage: () => {
      if (!browser) return;
      
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH);
        if (stored) {
          const parsed = JSON.parse(stored);
          update(s => ({
            ...s,
            token: parsed.token || "",
            userId: parsed.userId || "",
            senderID: parsed.senderID || "",
            tenantSelected: !!localStorage.getItem(LOCAL_STORAGE_KEYS.TENANT_ID)
          }));
        }
      } catch (e) {
        console.error('Failed to load auth from storage:', e);
      }
    }
  };

  // Auto-load from storage on creation (browser only)
  if (browser) {
    store.loadFromStorage();
  }

  // Persist to localStorage on changes
  if (browser) {
    let unsubscribe: (() => void) | undefined;
    unsubscribe = subscribe((state) => {
      try {
        const toPersist = {
          token: state.token,
          userId: state.userId,
          senderID: state.senderID
        };
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, JSON.stringify(toPersist));
      } catch (e) {
        console.error('Failed to persist auth:', e);
      }
    });
  }

  return store;
}

export const authStore = createAuthStore();

// Helper функция для установки пользователя (для совместимости)
export function setUser(user: { id: string; name: string; email: string }) {
	authStore.setCredentials('mock-token', user.id);
	authStore.setConnected(true, { name: 'Goclaw', version: '1.0.0' });
}

// Helper функция для выхода (для совместимости)
export function logout() {
	authStore.logout();
}
