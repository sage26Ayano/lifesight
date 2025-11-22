import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import mockData from '../data/mockData.json';

interface DataRecord {
  id: number;
  channel: string;
  spend: number;
  impressions: number;
  conversions: number;
}

interface DashboardContextType {
  data: DataRecord[];
  filterChannel: string;
  setFilterChannel: (channel: string) => void;
  sortField: keyof DataRecord | null;
  sortDirection: 'asc' | 'desc';
  setSorting: (field: keyof DataRecord) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  filteredData: DataRecord[];
  sortedData: DataRecord[];
  paginatedData: DataRecord[];
  totalPages: number;
  uniqueChannels: string[];
  totalSpend: number;
  totalConversions: number;
  totalImpressions: number;
  ctr: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [data] = useState<DataRecord[]>(mockData as DataRecord[]);
  const [filterChannel, setFilterChannel] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof DataRecord | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Get unique channels for filter dropdown
  const uniqueChannels = useMemo(() => {
    const channels = Array.from(new Set(data.map(item => item.channel)));
    return ['All', ...channels.sort()];
  }, [data]);

  // Filter data based on selected channel
  const filteredData = useMemo(() => {
    if (filterChannel === 'All') return data;
    return data.filter(item => item.channel === filterChannel);
  }, [data, filterChannel]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(sortedData.length / pageSize);
  }, [sortedData.length, pageSize]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // Summary metrics calculations
  const totalSpend = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.spend, 0);
  }, [filteredData]);

  const totalConversions = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.conversions, 0);
  }, [filteredData]);

  const totalImpressions = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.impressions, 0);
  }, [filteredData]);

  const ctr = useMemo(() => {
    return totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;
  }, [totalConversions, totalImpressions]);

  // Memoized callback for sorting
  const setSorting = useCallback((field: keyof DataRecord) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  }, [sortField]);

  // Memoized callback for filter change
  const handleFilterChange = useCallback((channel: string) => {
    setFilterChannel(channel);
    setCurrentPage(1); // Reset to first page on filter
  }, []);

  const value = {
    data,
    filterChannel,
    setFilterChannel: handleFilterChange,
    sortField,
    sortDirection,
    setSorting,
    currentPage,
    setCurrentPage,
    pageSize,
    filteredData,
    sortedData,
    paginatedData,
    totalPages,
    uniqueChannels,
    totalSpend,
    totalConversions,
    totalImpressions,
    ctr,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
