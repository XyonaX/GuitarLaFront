import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/routes/PrivateRoute";
/* Common */
import HeaderNavbar from "./components/common/HeaderNavbar";
import Footer from "./components/common/Footer";
/* Sections */
import Features from "./components/home/Features";
import Offers from "./components/home/Offers";
import AboutUs from "./components/home/AboutUs";
import Blogs from "./components/home/Blogs";
import Testimonials from "./components/home/Testimonials";
/* Pages */
import AboutUsPage from "./components/pages/AboutUsPage";
import ProductsStoragePage from "./components/pages/ProductsStorePage";
import ProductIDetailsPage from "./components/pages/ProductIDetailsPage";
import BlogsPage from "./components/pages/BlogsPage";
import ContactPage from "./components/pages/ContactPage";
import ProfilePage from "./components/pages/ProfilePage";
/* Dashboard */
import DashboardProducts from "./components/dashboard/DashboardProducts";
import DashboardUsers from "./components/dashboard/DashBoardUsers";
import DashboardBlogs from "./components/dashboard/DashboardBlogs";
/* Auth */
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import GoogleAuthCallback from './components/auth/GoogleAuthCallback';
/* Utilities */
import ScrollToTop from "./utilities/ScrollToTop";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { PaymentSuccess } from "./components/paymentComponents/PaymentSuccess";
import { PaymentFailure } from "./components/paymentComponents/PaymentFailure";
import { MyOrders } from "./components/pages/MyOrders";

function App() {
  return (
    <>
      <ScrollToTop />
      <HeaderNavbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Features />
              <AboutUs />
              <Offers />
              <Blogs />
              <Testimonials />
            </>
          }
        />
        <Route path="/about_us" element={<AboutUsPage />} />
        <Route path="/about_us_page" element={<AboutUsPage />} />
        <Route path="/products" element={<ProductsStoragePage />} />
        <Route path="/product/:id" element={<ProductIDetailsPage />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />

        {/* Rutas protegidas */}
        <Route
          path="/my_orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />

        <Route
          path="/DashboardBlogs"
          element={
            <PrivateRoute>
              <DashboardBlogs />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Rutas protegidas para administradores */}
        <Route
          path="/dashboard/DashBoardUsers"
          element={
            <PrivateRoute requiredRole="admin">
              <DashboardUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/DashboardProducts"
          element={
            <PrivateRoute requiredRole="admin">
              <DashboardProducts />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
