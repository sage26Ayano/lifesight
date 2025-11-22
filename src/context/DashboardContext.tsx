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
  setPageSize: (size: number) => void;
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
  const [pageSize, setPageSize] = useState<number>(10);

  // Get unique channels for filter dropdown - optimized with Set
  const uniqueChannels = useMemo(() => {
    const channelSet = new Set<string>();
    for (let i = 0; i < data.length; i++) {
      channelSet.add(data[i].channel);
    }
    const channels = Array.from(channelSet).sort();
    return ['All', ...channels];
  }, [data]);

  // Filter data based on selected channel - optimized with early return
  const filteredData = useMemo(() => {
    if (filterChannel === 'All') return data;
    
    // Use for loop for better performance with large datasets
    const filtered: DataRecord[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].channel === filterChannel) {
        filtered.push(data[i]);
      }
    }
    return filtered;
  }, [data, filterChannel]);

  // Sort filtered data - optimized to only sort when needed
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    
    // Create typed sort function for better performance
    const sorted = new Array(filteredData.length);
    for (let i = 0; i < filteredData.length; i++) {
      sorted[i] = filteredData[i];
    }
    
    sorted.sort((a, b) => {
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

  // Get paginated data - optimized slice
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // Summary metrics calculations - OPTIMIZED: single pass instead of multiple reduces
  const { totalSpend, totalConversions, totalImpressions } = useMemo(() => {
    let spend = 0;
    let conversions = 0;
    let impressions = 0;
    
    // Single pass through filteredData instead of 3 separate reduces
    for (let i = 0; i < filteredData.length; i++) {
      const item = filteredData[i];
      spend += item.spend;
      conversions += item.conversions;
      impressions += item.impressions;
    }
    
    return { totalSpend: spend, totalConversions: conversions, totalImpressions: impressions };
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

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
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
    setPageSize: handlePageSizeChange,
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
