import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, InputNumber, Row, Col, Dropdown,Image, Typography, Select, Modal } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Details.css';

const { Header, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Details = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null); 
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
    axios.get(`http://localhost:3000/api/product/${id}`)
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
      
      axios.get('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
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
                price: product.price,
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
      {/* Navbar */}
      <Header className="header">
        <div className="menu-left">
          <Menu mode="horizontal" defaultSelectedKeys={['3']} className="menu-left">
            <Menu.Item key="1"><Link to="/Home">E-commerce</Link></Menu.Item>
          </Menu>
        </div>

        <div className="menu-center">
          <Menu mode="horizontal" className="menu-center">
            <Menu.Item><Link to="/Home">หน้าแรก</Link></Menu.Item>
            <Menu.Item><Link to="/Promotion">โปรโมชั่น</Link></Menu.Item>
            <Menu.Item><Link to="/Products">สินค้า</Link></Menu.Item>
            <Menu.Item><Link to="/Payment">แจ้งชำระเงิน</Link></Menu.Item>
          </Menu>
        </div>

        <div className="menu-right">
          <ShoppingCartOutlined style={{ fontSize: '24px', color: 'black' }} onClick={handleCartOpen} />
          <Dropdown overlay={userMenu} trigger={['click']}>
            <UserOutlined style={{ fontSize: '24px', color: 'black', cursor: 'pointer' }} />
          </Dropdown>
        </div>
      </Header>

      {/* Main Section */}
      <div className="details-container">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Image src={product.img} className="small-image" />
            <Image src={product.img} className="small-image" />
          </Col>

          <Col span={10}>
            <Image src={product.img} className="medium-image products-layout" />
          </Col>

          <Col span={8}>
            <Title level={2}>{product.description}</Title>
            <p>{product.description}</p>
            <Text strong>ราคา: {product.price} บาท</Text>

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
          <Link to="/Payment" key="Payment">
            <Button onClick={handleCartClose} type="primary">Checkout</Button>
          </Link>
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

export default Details;
