import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Spin } from '@arco-design/web-react';
import cs from 'classnames';
import {
  IconDashboard,
  IconList,
  IconSettings,
  IconFile,
  IconApps,
  IconCheckCircle,
  IconExclamationCircle,
  IconUser,
  IconMenuFold,
  IconMenuUnfold,
} from '@arco-design/web-react/icon';
import { useRouter } from 'next/router';
import Link from 'next/link';
import qs from 'query-string';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import useRoute, { IRoute } from '@/routes';
import useLocale from '@/utils/useLocale';
import getUrlParams from '@/utils/getUrlParams';
import styles from '@/style/layout.module.less';
import NoAccess from '@/pages/exception/403';
import { useAppDispatch, useAppSelector } from '@/store';
import checkLogin, { authHeaderName } from '@/utils/checkLogin';
import { fetchUserInfo } from '@/store/setting';
import axios from 'axios';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const Sider = Layout.Sider;
const Content = Layout.Content;

function getIconFromKey(key) {
  switch (key) {
    case 'dashboard':
      return <IconDashboard className={styles.icon} />;
    case 'list':
      return <IconList className={styles.icon} />;
    case 'form':
      return <IconSettings className={styles.icon} />;
    case 'profile':
      return <IconFile className={styles.icon} />;
    case 'visualization':
      return <IconApps className={styles.icon} />;
    case 'result':
      return <IconCheckCircle className={styles.icon} />;
    case 'exception':
      return <IconExclamationCircle className={styles.icon} />;
    case 'user':
      return <IconUser className={styles.icon} />;
    default:
      return <div className={styles['icon-empty']} />;
  }
}

function PageLayout({ children }: { children: ReactNode }) {
  const urlParams = getUrlParams();
  const router = useRouter();
  const pathname = router.pathname;
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const locale = useLocale();
  const { userInfo, settings, userLoading } = useAppSelector(
    (state) => state.setting
  );

  const dispatch = useAppDispatch();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [routes, defaultRoute] = useRoute(userInfo?.permissions);

  const defaultSelectedKeys = [currentComponent || defaultRoute];
  const paths = (currentComponent || defaultRoute).split('/');
  const defaultOpenKeys = paths.slice(0, paths.length - 1);

  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  const navbarHeight = 60;
  const menuWidth = collapsed ? 48 : settings?.menuWidth;

  const showNavbar = settings?.navbar && urlParams.navbar !== false;
  const showMenu = settings?.menu && urlParams.menu !== false;
  const showFooter = settings?.footer && urlParams.footer !== false;

  const routeMap = useRef<Map<string, ReactNode[]>>(new Map());

  const [breadcrumb, setBreadCrumb] = useState([]);

  function onClickMenuItem(key) {
    setSelectedKeys([key]);
  }

  function toggleCollapse() {
    setCollapsed((collapsed) => !collapsed);
  }

  const paddingLeft = showMenu ? { paddingLeft: menuWidth } : {};
  const paddingTop = showNavbar ? { paddingTop: navbarHeight } : {};
  const paddingStyle = { ...paddingLeft, ...paddingTop };

  function renderRoutes(locale) {
    routeMap.current.clear();
    return function travel(_routes: IRoute[], level, parentNode = []) {
      return _routes.map((route) => {
        const { breadcrumb = true, ignore } = route;
        const iconDom = getIconFromKey(route.key);
        const titleDom = (
          <>
            {iconDom} {locale[route.name] || route.name}
          </>
        );

        routeMap.current.set(
          `/${route.key}`,
          breadcrumb ? [...parentNode, route.name] : []
        );

        const visibleChildren = (route.children || []).filter((child) => {
          const { ignore, breadcrumb = true } = child;
          if (ignore || route.ignore) {
            routeMap.current.set(
              `/${child.key}`,
              breadcrumb ? [...parentNode, route.name, child.name] : []
            );
          }

          return !ignore;
        });

        if (ignore) {
          return '';
        }
        if (visibleChildren.length) {
          return (
            <SubMenu key={route.key} title={titleDom}>
              {travel(visibleChildren, level + 1, [...parentNode, route.name])}
            </SubMenu>
          );
        }
        return (
          <MenuItem key={route.key}>
            <Link href={`/${route.key}`}>
              <a>{titleDom}</a>
            </Link>
          </MenuItem>
        );
      });
    };
  }

  useEffect(() => {
    const routeConfig = routeMap.current.get(pathname);
    setBreadCrumb(routeConfig || []);
  }, [defaultRoute, pathname]);

  useEffect(() => {
    if (checkLogin()) {
      dispatch(fetchUserInfo(123));
    } else if (window.location.pathname.replace(/\//g, '') !== 'login') {
      window.location.pathname = '/login';
    }
  }, [dispatch]);

  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    darkThemeMq.addListener((e) => {
      if (e.matches) {
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        document.body.removeAttribute('arco-theme');
      }
    });

    axios.interceptors.request.use((value) => {
      const newHeaders = { ...value.headers };
      newHeaders[authHeaderName] = localStorage.getItem(authHeaderName) || '';
      value.headers = newHeaders;
      return value;
    });
    // axios.interceptors.response.use(undefined, (error) => {
    //   if (
    //     axios.isAxiosError(error) &&
    //     error.response?.data?.errorCode === 401
    //   ) {
    //     if (window.location.pathname.replace(/\//g, '') !== 'login') {
    //       window.location.pathname = '/login';
    //     }
    //   }
    //   return error;
    // });
  }, []);

  return (
    <Layout className={styles.layout}>
      <div
        className={cs(styles['layout-navbar'], {
          [styles['layout-navbar-hidden']]: !showNavbar,
        })}
      >
        <Navbar show={showNavbar} />
      </div>
      {userLoading ? (
        <Spin className={styles['spin']} />
      ) : (
        <Layout>
          {showMenu && (
            <Sider
              className={styles['layout-sider']}
              width={menuWidth}
              collapsed={collapsed}
              onCollapse={setCollapsed}
              trigger={null}
              collapsible
              breakpoint="xl"
              style={paddingTop}
            >
              <div className={styles['menu-wrapper']}>
                <Menu
                  collapse={collapsed}
                  onClickMenuItem={onClickMenuItem}
                  selectedKeys={selectedKeys}
                  openKeys={openKeys}
                  onClickSubMenu={(_, openKeys) => {
                    setOpenKeys(openKeys);
                  }}
                >
                  {renderRoutes(locale)(routes, 1)}
                </Menu>
              </div>
              <div className={styles['collapse-btn']} onClick={toggleCollapse}>
                {collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
              </div>
            </Sider>
          )}
          <Layout className={styles['layout-content']} style={paddingStyle}>
            <div className={styles['layout-content-wrapper']}>
              {!!breadcrumb.length && (
                <div className={styles['layout-breadcrumb']}>
                  <Breadcrumb>
                    {breadcrumb.map((node, index) => (
                      <Breadcrumb.Item key={index}>
                        {typeof node === 'string' ? locale[node] || node : node}
                      </Breadcrumb.Item>
                    ))}
                  </Breadcrumb>
                </div>
              )}
              <Content>
                {routeMap.current.has(pathname) ? children : <NoAccess />}
              </Content>
            </div>
            {showFooter && <Footer />}
          </Layout>
        </Layout>
      )}
    </Layout>
  );
}

export default PageLayout;
