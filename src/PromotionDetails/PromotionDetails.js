import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, InputNumber, Row, Col, Image, Typography, Select, Modal } from 'antd';
import { Link, useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PromotionDetails.css';
import Navbar from '../Components/Navbar/Navbar';

const { Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const PromotionDetails = () => {

  const { id } = useParams();
  console.log("Promotion ID:", id); 

  const [product, setProduct] = useState(null)

  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [selectedSize, setSelectedSize] = useState('M'); 
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  

  useEffect(() => {
    console.log('Product ID:', id); 
    setLoading(true); 
    axios.get(`http://localhost:3000/product/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setError('Error fetching product details.'); 
        setLoading(false);
      });

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (role) {
      setUserRole(role);
      console.log('User Role:', role); 
    } else {
      
      axios.get('http://localhost:3000/users', {
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const fetchedRole = response.data.role;
        setUserRole(fetchedRole);
        localStorage.setItem('role', fetchedRole); 
        console.log('Fetched User Role:', fetchedRole);
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });
    }  

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, [id]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const addToCart = () => {
    if (product) {
        const existingItemIndex = cart.findIndex(item => 
            item.id === product.id && item.size === selectedSize
        );
        const newCart = [...cart];
  
        if (existingItemIndex >= 0) {
            newCart[existingItemIndex].quantity += quantity;
        } else {
            const item = {
                id: product.id,
                description: product.description,
                price: product.discount_price,
                quantity,
                size: selectedSize,
                img: product.img 
            };
            newCart.push(item);
        }
  
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart)); 
        setQuantity(1); 
    } else {
        console.warn('Product not found, cannot add to cart.');
    }
  };

  const handleLogout = () => {
    // ล้างข้อมูล token และ role ออกจาก localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // นำไปที่หน้า Login หลังจากล้างข้อมูล
    navigate('/login');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/Cart">ประวัติการซื้อ</Link>
      </Menu.Item>
      {userRole === 'admin' && (
        <Menu.Item key="3">
          <Link to="/admin/ManageProducts">Admin</Link>
        </Menu.Item>
      )}
      <Menu.Item key="2" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCartOpen = () => setCartVisible(true);
  const handleCartClose = () => setCartVisible(false);

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>{error}</div>; 

  return (
    <Layout>
      
      <Navbar handleCartOpen={handleCartOpen} userMenu={userMenu} cartCount={cartCount} />

      {/* Main Section */}
      <div className="details-container">
        <Row gutter={[16, 16]}>

          <Col span={10}>
            <Image src={product.img} className="medium-image products-layout" />
          </Col>

          <Col span={8}>

            <Title level={2}>{product.description}</Title>
            <p>{product.description}</p>
            <Text strong>ราคา: {product.discount_price} บาท</Text>

            <div className="size-section">
              <Text>Size:</Text>
              <Select value={selectedSize} onChange={value => setSelectedSize(value)} style={{ width: 120 }}>
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
              </Select>
            </div>

            <div className="quantity-section">
              <Button onClick={handleDecrease}>-</Button>
              <InputNumber min={1} value={quantity} onChange={setQuantity} />
              <Button onClick={handleIncrease}>+</Button>
            </div>

            <Button type="primary" className="add-to-cart-btn" onClick={addToCart}>Add to Cart</Button>
          </Col>
        </Row>
      </div>

      <Modal
        title="Shopping Cart"
        visible={cartVisible}
        onCancel={handleCartClose}
        footer={[
          // <Link to="/Cart" key="cart">
          //     <Button onClick={handleCartClose}>Cart</Button>
          // </Link>,
          <Button key="checkout" type="primary">Checkout</Button>
        ]}
        width={800} 
        style={{ maxHeight: '600px' }} 
    >
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <Image src={item.img} style={{ width: '50px', marginRight: '10px' }} />
              {item.description} ราคา {item.price} บาท x {item.quantity} = {(item.price * item.quantity).toFixed(2)} บาท
              <Button type="link" onClick={() => removeFromCart(index)}>Remove</Button>
            </li>
          ))}
        </ul>
        <p>รวม : {calculateTotal().toFixed(2)} บาท</p>
      </Modal>

      <Footer style={{ textAlign: 'center' }}>E-commerce ©2024 Created by Aoneiei</Footer>

    </Layout>
  );
};

export default PromotionDetails;
