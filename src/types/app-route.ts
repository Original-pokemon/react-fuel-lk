import AppRoute from '#root/const/app-route';

export type AppRouteType = (typeof AppRoute)[keyof typeof AppRoute];
