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
        // Set first client as active if no active client is set
        if (!activeClient && response.data.length > 0) {
          setActiveClient(response.data[0]);
        }
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load clients");
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
        setActiveClient,
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
