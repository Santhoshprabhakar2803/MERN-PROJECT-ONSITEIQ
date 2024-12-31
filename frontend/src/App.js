// npm install react-icons
// npm install axios react-router-dom
// npm install react-modal
// npm install leaflet react-leaflet
// npm install react-leaflet leaflet
import './App.css';

// For maps
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './JS/HomeScreen';
import MainScreen from './JS/MainScreen';
import SidePanel from './JS/SidePanel';
import Structure from './JS/Structure';
import Maps from './JS/Maps';
import Contract from './JS/Contract';
import TopBar from './JS/TopBar';
import CreatingConstruction from './JS/CreatingConstruction';
import Register from './JS/Register'
import RegisterValidation from './JS/Registervalidation';
import Login from './JS/Login';
import Members from './JS/Members';
import SplashScreen from './JS/SplashScreen';
import SubConstruction from './JS/SubConstruction';
import EstimationForm from './JS/EstimationForm';
import Aboutus from './JS/Aboutus';
import Alert from './JS/Alert';
import AlertHistory from './JS/AlertHistory';
import Progress from './JS/Progress';
import ContractDownloadPdf from './JS/ContractDownloadPdf';
import Safety from './JS/Safety';
import EstimationDownload from './JS/EstimationDownload';
import Material from './JS/Material';
import Password from './JS/Password';
import Page2 from './JS/Page2';
import Dashboard from './JS/Dashboard';
import SiteOverView from './JS/SiteOverView';
import Sitedashboard from './JS/Sitedashboard';
import ConstructionProgressChart from './JS/ConstructionProgressChart';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/Main" element={<MainScreen />} />
        <Route path="/SidePanel" element={<SidePanel />} />
        <Route path="/Structure" element={<Structure />} />
        <Route path="/Maps" element={<Maps />} />
        <Route path="/TopBar" element={<TopBar />} />
        <Route path="/Contract" element={<Contract />} />
        <Route path="/CreatingConstruction" element={<CreatingConstruction />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/RegisterValidation" element={<RegisterValidation />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Members" element={<Members />} />
        <Route path="/SubConstruction" element={<SubConstruction />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/EstimationForm" element={<EstimationForm />} />
        <Route path="/Alert" element={<Alert />} />
        <Route path="/AlertHistory" element={<AlertHistory />} />
        <Route path="/Progress" element={<Progress />} />
        <Route path="/ContractDownloadPdf" element={<ContractDownloadPdf />} />
        <Route path="/Safety" element={<Safety />} />
        <Route path="/EstimationDownload" element={<EstimationDownload />} />
        <Route path="/Material" element={<Material />} />
        <Route path="/Password" element={<Password />} />
        <Route path="/Page2" element={<Page2 />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/SiteOverView" element={<SiteOverView />} />
        <Route path="/Sitedashboard" element={<Sitedashboard />} />
        <Route path="/ConstructionProgressChart" element={<ConstructionProgressChart />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;