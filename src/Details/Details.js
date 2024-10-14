import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, InputNumber, Row, Col, Image, Typography, Select, Input, Modal } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Details.css';

const { Header, Footer } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const Details = () => {
  const { id } = useParams(); // รับ ID จาก URL
  const [product, setProduct] = useState(null); // สถานะสำหรับข้อมูลผลิตภัณฑ์
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [loading, setLoading] = useState(true); // สถานะ loading
  const [error, setError] = useState(null); // สถานะ error
  const [selectedSize, setSelectedSize] = useState('M'); // ประกาศ selectedSize

  useEffect(() => {
    console.log('Product ID:', id); // แสดงค่า ID ที่ได้จาก URL
    setLoading(true); // ตั้งค่า loading เป็น true
    axios.get(`http://localhost:3000/api/product/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false); // ตั้งค่า loading เป็น false เมื่อโหลดเสร็จ
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setError('Error fetching product details.'); // ตั้งค่า error เมื่อเกิดข้อผิดพลาด
        setLoading(false);
      });

    // ดึงข้อมูลจาก Local Storage เมื่อโหลดหน้า
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, [id]);

  useEffect(() => {
    // บันทึกข้อมูลตะกร้าไปยัง Local Storage ทุกครั้งที่ cart เปลี่ยนแปลง
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
            // ถ้ามีสินค้าแล้ว ให้เพิ่มจำนวน
            newCart[existingItemIndex].quantity += quantity;
        } else {
            // ถ้าไม่มีให้เพิ่มสินค้าใหม่
            const item = {
                id: product.id,
                description: product.description,
                price: product.price,
                quantity,
                size: selectedSize,
                img: product.img // เพิ่ม img property ที่นี่
            };
            newCart.push(item);
        }
  
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart)); // บันทึกข้อมูลลง Local Storage
        setQuantity(1); // Reset quantity to 1 after adding to cart
    } else {
        console.warn('Product not found, cannot add to cart.');
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCartOpen = () => setCartVisible(true);
  const handleCartClose = () => setCartVisible(false);

  if (loading) return <div>Loading...</div>; // แสดง loading ขณะรอข้อมูล
  if (error) return <div>{error}</div>; // แสดงข้อความข้อผิดพลาด

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
          <Search placeholder="Search products" style={{ width: 200 }} />
          <ShoppingCartOutlined style={{ fontSize: '24px', color: 'black' }} onClick={handleCartOpen} />
          <UserOutlined style={{ fontSize: '24px', color: 'black' }} />
        </div>
      </Header>

      {/* Main Section */}
      <div className="details-container">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            {/* รูปขนาดเล็ก */}
            <Image src={product.img} className="small-image" />
            <Image src={product.img} className="small-image" />
          </Col>

          <Col span={10}>
            {/* รูปขนาดกลาง */}
            <Image src={product.img} className="medium-image products-layout" />
          </Col>

          <Col span={8}>
            {/* ข้อมูลสินค้า */}
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

      {/* Modal สำหรับแสดงสินค้าในตะกร้า */}
      <Modal
        title="Shopping Cart"
        visible={cartVisible}
        onCancel={handleCartClose}
        footer={[
          <Link to="/Cart" key="cart">
              <Button onClick={handleCartClose}>Cart</Button>
          </Link>,
          <Link to="/Payment" key="Payment">
            <Button onClick={handleCartClose} type="primary">Checkout</Button>
          </Link>
          // <Button key="checkout" type="primary">Checkout</Button>
        ]}
        width={800} // กำหนดความกว้างของ Modal
        style={{ maxHeight: '600px' }} // กำหนดความสูงสูงสุดของ Modal
    >
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <Image src={item.img} style={{ width: '50px', marginRight: '10px' }} /> {/* แสดงรูปภาพ */}
              {item.description} ราคา {item.price} บาท x {item.quantity} = {(item.price * item.quantity).toFixed(2)} บาท
              <Button type="link" onClick={() => removeFromCart(index)}>Remove</Button>
            </li>
          ))}
        </ul>
        <p>รวม : {calculateTotal().toFixed(2)} บาท</p>
      </Modal>

      {/* Footer แบบหน้า Products */}
      <Footer className="footer">
        {/* Left Section */}
        <div className="footer-section">
          <h2>Home</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.</p>
        </div>

        {/* Center Section */}
        <div className="footer-section">
          <ul className="footer-menu">
            <li><Link to="/menu1">Menu 1</Link></li>
            <li><Link to="/menu2">Menu 2</Link></li>
            <li><Link to="/menu3">Menu 3</Link></li>
            <li><Link to="/menu4">Menu 4</Link></li>
            <li><Link to="/menu5">Menu 5</Link></li>
            <li><Link to="/menu6">Menu 6</Link></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-section contact-info">
          <h2>Contact Us</h2>
          <p>Email: contact@ourstore.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 1234 Street Name, City, Country</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default Details;
