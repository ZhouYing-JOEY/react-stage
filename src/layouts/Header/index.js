import React from 'react';
import { connect } from "react-redux";
import { Layout, Row, Col } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import './index.less';

const Header = (props) => {
  const {collapsed,toggleCollapsed} = props;
  return (
    <Layout.Header className="header">
      <Row type="flex" style={{ paddingRight: 20 }}>
        <Col style={{ flex: 1 }}>
          <span className="trigger" onClick={() => toggleCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default connect(
  (state) => {
    return {
      collapsed: state.common.collapsed,
    };
  },
  (dispatch) => {
    return {
      toggleCollapsed: dispatch.common.toggleCollapsed,
    };
  },
)(Header);
