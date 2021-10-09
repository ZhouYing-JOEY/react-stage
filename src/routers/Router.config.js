import React, { lazy } from 'react';
import {
  HomeOutlined,
  SmileOutlined,
  WarningOutlined,
  FrownOutlined,
} from '@ant-design/icons';

import BasicLayout from '@/layouts/BasicLayout';

const config = [
      {
        path: '/',
        component: BasicLayout, // 基本布局
        childRoutes: [
          {
            path: '/welcome',
            name: '欢迎页',
            icon: <SmileOutlined />,
            component: lazy(() => import('@/pages/Welcome')),
          },
          {
            path: '/home',
            name: 'home主页',
            icon: <HomeOutlined />,
            component: lazy(() => import('@/pages/Home')),
          },
          {
            path: '/exception',
            name: '异常页',
            icon: <WarningOutlined />,
            childRoutes: [
              {
                path: '/exception/403',
                name: '403',
                icon: <FrownOutlined />,
                component: lazy(() => import('@/pages/Exception/403')),
              },
              {
                path: '/exception/404',
                name: '404',
                exact: true,
                icon: <FrownOutlined />,
                component: lazy(() => import('@/pages/Exception/404')),
              },
              {
                path: '/exception/500',
                name: '500',
                icon: <FrownOutlined />,
                component: lazy(() => import('@/pages/Exception/500')),
              },
            ],
          },
          { path: '/', exact: true, redirect: '/welcome' },
          { path: '*', exact: true, redirect: '/exception/404' },
        ],
      },
    ];

export default config;
