import React, { useEffect, useState, useMemo } from 'react';
import { connect } from "react-redux";
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Row } from 'antd';
import logo from '@/assets/images/logo.png';

import './index.less';

const renderMenuItem = (target) =>
  target
    .filter((item) => item.path && item.name)
    .map((subMenu) => {
      if (subMenu.childRoutes && !!subMenu.childRoutes.find((child) => child.path && child.name)) {
        return (
          <Menu.SubMenu
            key={subMenu.path}
            title={
              <div>
                {!!subMenu.icon && subMenu.icon}
                <span>{subMenu.name}</span>
              </div>
            }
          >
            {renderMenuItem(subMenu.childRoutes)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={subMenu.path}>
          <Link to={subMenu.path}>
            <span>
              {!!subMenu.icon && subMenu.icon}
              <span>{subMenu.name}</span>
            </span>
          </Link>
        </Menu.Item>
      );
    });

const SiderMenu = ({ routes,...props }) => {
  const {collapsed,rootTitle} = props
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const list = pathname.split('/').splice(1);
    setOpenKeys(list.map((item, index) => `/${list.slice(0, index + 1).join('/')}`));
  }, []);

  const getSelectedKeys = useMemo(() => {
    const list = pathname.split('/').splice(1);
    return list.map((item, index) => `/${list.slice(0, index + 1).join('/')}`);
  }, [pathname]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Layout.Sider trigger={null} collapsible collapsed={collapsed} className="left-slider">
      <Link to="/">
        <Row type="flex" align="middle" className="logo">
          <img src={logo} />
          {!collapsed && <span className="app-name">{rootTitle}</span>}
        </Row>
      </Link>
      <Menu
        mode="inline"
        theme="dark"
        style={{ paddingLeft: 0, marginBottom: 0 }}
        className="menu"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        selectedKeys={getSelectedKeys}
      >
        {renderMenuItem(routes)}
      </Menu>
    </Layout.Sider>
  );
};

export default connect(
  (state) => {
    return {
      rootTitle: state.common.rootTitle,
      collapsed: state.common.collapsed,
    };
  },
  null,
)(SiderMenu);
