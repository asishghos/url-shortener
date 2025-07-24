import TopLinksChart from './components/TopLinksChart';
import DailyClicksChart from './components/DailyClicksChart';
import axios from 'axios';

function App() {
  return (
    <div className="p-4">
      <h1>Admin Analytics Dashboard</h1>
      <TopLinksChart />
      <DailyClicksChart />
    </div>
  );
}

export default App;
