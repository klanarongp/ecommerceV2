// src/components/Navbar.js
import React from 'react';
import { Layout, Menu, Dropdown, Badge  } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Navbar.css';

const { Header } = Layout;

const Navbar = ({ handleCartOpen, userMenu, cartCount  }) => {
  return (
    <Header className="header">
      <div className="menu-left">
        <Menu mode="horizontal"  className="menu-left">
          <Menu.Item key="1"><Link to="/Home" style={{ fontSize: '20px', color: 'black' }} >E-commerce</Link></Menu.Item>
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
        <Badge count={cartCount} overflowCount={99} offset={[0, 10]}>
          <ShoppingCartOutlined style={{ fontSize: '30px', color: 'black' }} onClick={handleCartOpen} />
        </Badge>
        <Dropdown overlay={userMenu} trigger={['click']}>
          <UserOutlined style={{ fontSize: '30px', color: 'black', cursor: 'pointer' }} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
