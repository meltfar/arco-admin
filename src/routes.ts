import type { AuthParams, UserPermission } from '@/utils/authentication';
import auth from '@/utils/authentication';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type IRoute = AuthParams & {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
};

export const routes: IRoute[] = [
  {
    name: 'menu.list',
    key: 'list',
    children: [
      {
        name: 'menu.list.searchTable',
        key: 'list/search-table',
      },
      {
        name: 'menu.list.insertForm',
        key: 'list/insert',
      },
    ],
  },
  // {
  //   name: 'menu.form',
  //   key: 'form',
  //   children: [
  //     {
  //       name: 'menu.form.group',
  //       key: 'form/group',
  //       requiredPermissions: [
  //         { resource: 'menu.form.group', actions: ['read', 'write'] },
  //       ],
  //     },
  //     {
  //       name: 'menu.form.step',
  //       key: 'form/step',
  //       requiredPermissions: [
  //         { resource: 'menu.form.step', actions: ['read'] },
  //       ],
  //     },
  //   ],
  // },
];

export const getName = (path: string, routes) => {
  return routes.find((item) => {
    const itemPath = `/${item.key}`;
    if (path === itemPath) {
      return item.name;
    } else if (item.children) {
      return getName(path, item.children);
    }
  });
};

export const generatePermission = (role: string) => {
  const actions = role === 'admin' ? ['*'] : ['read'];
  const result = {};
  routes.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        result[child.name] = actions;
      });
    }
  });
  return result;
};

const useRoute = (userPermission: UserPermission): [IRoute[], string] => {
  const filterRoute = useCallback(
    (routes: IRoute[], arr = []): IRoute[] => {
      if (!routes.length) {
        return [];
      }
      for (const route of routes) {
        const { requiredPermissions, oneOfPerm } = route;
        let visible = true;
        if (requiredPermissions) {
          visible = auth({ requiredPermissions, oneOfPerm }, userPermission);
        }

        if (!visible) {
          continue;
        }
        if (route.children && route.children.length) {
          const newRoute = { ...route, children: [] };
          filterRoute(route.children, newRoute.children);
          if (newRoute.children.length) {
            arr.push(newRoute);
          }
        } else {
          arr.push({ ...route });
        }
      }

      return arr;
    },
    [userPermission]
  );

  const [permissionRoute, setPermissionRoute] = useState(routes);

  useEffect(() => {
    const newRoutes = filterRoute(routes);
    setPermissionRoute(newRoutes);
  }, [filterRoute]);

  const defaultRoute = useMemo(() => {
    const first = permissionRoute[0];
    if (first) {
      const firstRoute = first?.children?.[0]?.key || first.key;
      return firstRoute;
    }
    return '';
  }, [permissionRoute]);

  return [permissionRoute, defaultRoute];
};

export default useRoute;
