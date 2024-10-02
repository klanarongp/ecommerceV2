import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import Promotion from './Promotion/Promotion';
import Products from './Products/Products';
import Details from './Details/Details ';
import Cart from './Cart/Cart';
import Payment from './Payment/Payment';
import ManageProducts from './admin/ManageProducts/ManageProducts';
import ManageUsers from './admin/ManageUsers/ManageUsers';
import ManagePromotion from './admin/ManagePromotion/ManagePromotion';
import ManagePaymentVerification from './admin/ManagePaymentVerification/ManagePaymentVerification';
import Testh from './Testh';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Promotion" element={<Promotion />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Details" element={<Details />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/ManageProducts" element={<ManageProducts />} />
        <Route path="/ManageUsers" element={<ManageUsers />} />
        <Route path="/ManagePromotion" element={<ManagePromotion />} />
        <Route path="/ManagePaymentVerification" element={<ManagePaymentVerification />} />
        <Route path="/Testh" element={<Testh />} />
        
        {/* เส้นทางอื่น ๆ */}
      </Routes>
    </div>
  );
};
export default App;