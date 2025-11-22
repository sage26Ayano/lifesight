import { DashboardProvider } from '../context/DashboardContext';
import Summary from '../components/Summary';
import Filters from '../components/Filters';
import Chart from '../components/Chart';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import '../styles/layout.css';

const Index = () => {
  return (
    <DashboardProvider>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Marketing Performance Dashboard</h1>
          <p className="dashboard-subtitle">
            Track and analyze your marketing campaigns across all channels
          </p>
        </header>

        <Summary />
        
        <Filters />
        
        <Chart />
        
        <Table />
        <Pagination />
      </div>
    </DashboardProvider>
  );
};

export default Index;
