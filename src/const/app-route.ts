const AppRoute = {
  Main: '/',
  Profile: '/profile',
  Cards: '/cards',
  Card: '/cards/:id',
  Transaction: '/transactions',
  Contracts: '/contracts',
  AzsMap: '/azs-map',
  Login: '/login',
  PageNotFound: '*',
} as const;

export default AppRoute;
