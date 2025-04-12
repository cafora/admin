import { Route, Routes } from 'react-router-dom';
import AdminSignupPage from './pages/Auth/Signup/AdminSignup';
import { ToastContainer } from 'react-toastify';
import AdminLoginPage from './pages/Auth/Login/AdminLogin';
import Layout from './ui/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './components/Users/Users';
import Products from './components/Product/Product';
import Order from './components/Order/Order';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/admin/sign-up" element={<AdminSignupPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/order" element={<Order />} />
          <Route path="/admin/product" element={<Products />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
