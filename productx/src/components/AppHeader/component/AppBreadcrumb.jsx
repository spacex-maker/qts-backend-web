import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import routes from '../../../routes';

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname;
  const { t } = useTranslation();

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    if (!currentRoute) return false;
    
    // 尝试从国际化配置中获取翻译，如果不存在则使用原始名称
    const translationKey = `menu.${currentRoute.name}`;
    const translatedName = t(translationKey, { defaultValue: currentRoute.name });
    
    return translatedName;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`;
      const routeName = getRouteName(currentPathname, routes);
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        });
      return currentPathname;
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        );
      })}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
