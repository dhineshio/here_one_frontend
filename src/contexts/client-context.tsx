"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ClientService, { Client } from "@/lib/api-services";
import { useSession } from "next-auth/react";

interface ClientContextType {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  activeClient: Client | null;
  setActiveClient: (client: Client | null) => void;
  refreshClients: () => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const {status } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  // Helper function to get stored active client ID
  const getStoredActiveClientId = (): number | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("activeClientId");
    return stored ? parseInt(stored, 10) : null;
  };

  // Helper function to store active client ID
  const storeActiveClientId = (clientId: number | null) => {
    if (typeof window === "undefined") return;
    if (clientId) {
      localStorage.setItem("activeClientId", clientId.toString());
    } else {
      localStorage.removeItem("activeClientId");
    }
  };

  // Enhanced setActiveClient function with persistence
  const handleSetActiveClient = (client: Client | null) => {
    setActiveClient(client);
    storeActiveClientId(client?.id || null);
  };

  const fetchClients = async () => {
    // Only fetch if user is authenticated
    if (status !== "authenticated") {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await ClientService.getMyClients();
      if (response.success) {
        setClients(response.data);
        
        // Restore previously selected client or set first as default
        if (!activeClient && response.data.length > 0) {
          const storedClientId = getStoredActiveClientId();
          let clientToSet: Client | null = null;
          
          if (storedClientId) {
            // Try to find the previously selected client
            clientToSet = response.data.find(client => client.id === storedClientId) || null;
          }
          
          // If no stored client found or stored client doesn't exist, use first client
          if (!clientToSet) {
            clientToSet = response.data[0];
          }
          
          setActiveClient(clientToSet);
          // Store the selected client ID (in case it was the first client fallback)
          storeActiveClientId(clientToSet.id);
        }
      } else {
        setError(response.message);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load clients";
      setError(errorMessage);
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshClients = async () => {
    await fetchClients();
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchClients();
    }
  }, [status]);

  return (
    <ClientContext.Provider
      value={{
        clients,
        isLoading,
        error,
        activeClient,
        setActiveClient: handleSetActiveClient,
        refreshClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientProvider");
  }
  return context;
}
