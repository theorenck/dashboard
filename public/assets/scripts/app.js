var Atlas = angular.module('Atlas', ['ngResource', 'ngRoute']);

/**
 * Configura o header para usar autenticação
 */
Atlas.config([
  '$locationProvider',
  function($locationProvider){
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: true
    });
  }
]);

/**
 * Configura o interceptador de requests
 */
Atlas.config([
  '$httpProvider',

  function ($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('httpRequestInterceptor')
  }
]);

/**
 * Verifica se existe token na sessão ou no localStorage e intercepta as requests
 */
Atlas.factory('httpRequestInterceptor', function () {
  var authorization = null;
  return {
    request: function (config) {
      var token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if(token)
        config.headers.Authorization = 'Token token=' +token;
      return config;
    }
  };
});


Atlas.filter('fromNow', function() {
  return function(date) {
    return moment(date).fromNow();
  }
});


/**
 * Configuração de todas
 */
Atlas.config(function($routeProvider){
  $routeProvider

  .when('/', {
    templateUrl: '/admin/home.html'
  })

  .when('/data-source-server', {
    controller: 'DataSourceIndexController',
    templateUrl: '/admin/data-source-server/index.html'
  })

  .when('/data-source-server/:action?/:id', {
    controller: 'DataSourceCreateController',
    templateUrl: '/admin/data-source-server/create.html'
  })

  .when('/dashboard', {
    controller: 'DashboardIndexController',
    templateUrl: '/admin/dashboard/index.html'
  })

  .when('/dashboard/:action?/:id', {
    controller: 'DashboardCreateController',
    templateUrl: '/admin/dashboard/create.html'
  })

  .when('/dashboards', {
    controller: 'dashboardsController',
    templateUrl: '/admin/dashboardsList.html'
  })


  .when('/dashboards/:id', {
    controller: 'dashboardDetailController',
    templateUrl: '/admin/dashboardDetail.html'
  })

  .when('/indicator', {
    controller: 'indicatorController',
    templateUrl: '/admin/indicatorList.html'
  })

  .when('/query', {
    controller: 'QueryListController',
    templateUrl: '/admin/query/index.html'
  })

  .when('/query/:action?/:id', {
    controller: 'QueryCreateController',
    templateUrl: '/admin/query/create.html'
  })

  .when('/permissions', {
    controller: 'permissionsController',
    templateUrl: '/admin/permissions.html'
  })

  .when('/users', {
    controller: 'usersController',
    templateUrl: '/admin/users.html'
  })

  .when('/widget', {
    controller: 'WidgetIndexController',
    templateUrl: '/admin/widget/index.html'
  })

  .when('/widget/:action?/:id', {
    controller: 'WidgetCreateController',
    templateUrl: '/admin/widget/create.html'
  })

  .when('/console', {
    controller: 'consoleController',
    templateUrl: '/admin/console.html'
  })

  .otherwise({
    redirectTo : '/'
  });
});