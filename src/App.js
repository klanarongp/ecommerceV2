import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import Home from './Home/Home';
import Promotion from './Promotion/Promotion';
import Products from './Products/Products';
import Details from './Details/Details';
import PromotionDetails from './PromotionDetails/PromotionDetails';
import Cart from './Cart/Cart';
import Payment from './Payment/Payment';
import NotFound from './NotFound'; 
import ManageProducts from './admin/ManageProducts/ManageProducts';
import ManageUsers from './admin/ManageUsers/ManageUsers';
// import ManagePromotion from './admin/ManagePromotion/ManagePromotion';
import ManagePaymentVerification from './admin/ManagePaymentVerification/ManagePaymentVerification';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Promotion" element={<Promotion />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Details/:id" element={<Details />} />
        <Route path="/PromotionDetails/:id" element={<PromotionDetails />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Payment" element={<Payment />} />
        
        {/* admin */}
        <Route path="/admin/ManageProducts" element={<ManageProducts />} />
        <Route path="/admin/ManageUsers" element={<ManageUsers />} />
        {/* <Route path="/admin/ManagePromotion" element={<ManagePromotion />} /> */}
        <Route path="/admin/ManagePaymentVerification" element={<ManagePaymentVerification />} />

        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </div>
  );
};

export default App;
