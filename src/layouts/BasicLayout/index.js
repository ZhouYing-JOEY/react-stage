import React from 'react';
import { Layout } from 'antd';
import SiderMenu from '../SiderMenu';
import Header from '../Header';
import Footer from "../Footer";

import './index.less';

const BasicLayout = ({ route, children }) => (
  <Layout className="layout">
    <SiderMenu routes={route.childRoutes} />
    <Layout className="layout-right">
      <Header />
      <Layout.Content className="layout-content">
        {children}
      </Layout.Content>
      <Footer />
    </Layout>
  </Layout>
);

export default BasicLayout;
