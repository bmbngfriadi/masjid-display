import { Routes, Route } from 'react-router-dom';
import TvDisplay from './pages/tv/TvDisplay';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import Pairing from './pages/admin/Pairing';
import Devices from './pages/admin/Devices';
import Announcements from './pages/admin/Announcements';
import FridaySchedule from './pages/admin/FridaySchedule';
import MasjidProfile from './pages/admin/MasjidProfile';
import UserProfile from './pages/admin/UserProfile';
import Users from './pages/admin/Users';
import PrayerTimeConfig from './pages/admin/PrayerTimeConfig';
import LayoutConfig from './pages/admin/LayoutConfig';
import AdzanScreenConfig from './pages/admin/AdzanScreenConfig';
import IqomahScreenConfig from './pages/admin/IqomahScreenConfig';
import SholatScreenConfig from './pages/admin/SholatScreenConfig';
import Register from './pages/admin/Register';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import VerifyEmail from './pages/admin/VerifyEmail';
import AuditLogs from './pages/admin/AuditLogs';
import { DialogProvider } from './contexts/DialogContext';

function App() {
  return (
    <DialogProvider>
      <Routes>
        <Route path="/" element={<TvDisplay />} />
        <Route path="/pair/:code" element={<Pairing />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="devices" element={<Devices />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="friday" element={<FridaySchedule />} />
          <Route path="profile" element={<MasjidProfile />} />
          <Route path="prayer-config" element={<PrayerTimeConfig />} />
          <Route path="adzan-screen" element={<AdzanScreenConfig />} />
          <Route path="iqomah-screen" element={<IqomahScreenConfig />} />
          <Route path="sholat-screen" element={<SholatScreenConfig />} />
          <Route path="users" element={<Users />} />
          <Route path="my-profile" element={<UserProfile />} />
          <Route path="layout" element={<LayoutConfig />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </DialogProvider>
  );
}

export default App;
