import { useState, useEffect } from 'react';
import {
  NetworkConnection,
  ThreatAlert,
  DeviceStats,
  TrafficDataPoint,
} from '@/types/security';
import {
  mockConnections,
  mockDeviceStats,
  mockTrafficData,
  mockThreatAlert,
} from '@/data/mockData';

export function useConnections() {
  const [connections, setConnections] = useState<NetworkConnection[]>(
    mockConnections
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setConnections(mockConnections);
    setIsLoading(false);
  }, []);

  return { connections, isLoading };
}

export function useDeviceStats() {
  const [stats, setStats] = useState<DeviceStats>(mockDeviceStats);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setStats(mockDeviceStats);
    setIsLoading(false);
  }, []);

  return { stats, isLoading };
}

export function useTrafficData() {
  const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>(
    mockTrafficData
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTrafficData(mockTrafficData);
    setIsLoading(false);
  }, []);

  return { trafficData, isLoading };
}

export function useThreatAlerts() {
  const [activeThreat, setActiveThreat] = useState<ThreatAlert | null>(null);

  const blockConnection = async (ip: string) => {
    console.log(`Blocking connection to: ${ip}`);
    setActiveThreat(null);
  };

  const allowConnection = async (ip: string) => {
    console.log(`Allowing connection to: ${ip}`);
    setActiveThreat(null);
  };

  return {
    activeThreat,
    setActiveThreat,
    blockConnection,
    allowConnection,
  };
}
