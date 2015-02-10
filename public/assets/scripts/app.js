(function(){
  'use strict';

  angular
    .module('Atlas'
      , [
        'ngResource'
        , 'ngRoute'
        , 'ui.codemirror'
        , 'ui.bootstrap'
      ]
    )

    /**
     * Configura o header para usar autenticação
     */
    .config([
      '$locationProvider'
      , function($locationProvider){
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: true
        });
      }
    ])

    /**
     * Configura o interceptador de requests
     */
    .config([
      '$httpProvider'
      , function ($httpProvider){
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('httpRequestInterceptor')
      }
    ])

    /**
     * Configuração de todas as rotas
     */
    .config(function($routeProvider){

      $routeProvider

      .when('/data-source-server', {
        controller: 'DataSourceIndexController',
        templateUrl: '/admin/data-source-server/index.html'
      })

      .when('/data-source-server/:action/:id?', {
        controller: 'DataSourceCreateController',
        templateUrl: '/admin/data-source-server/create.html'
      })

      .when('/dashboard', {
        controller: 'DashboardIndexController',
        templateUrl: '/admin/dashboard/index.html'
      })

      .when('/dashboard/:action/:id?', {
        controller: 'DashboardCreateController',
        templateUrl: '/admin/dashboard/create.html'
      })

      .when('/dashboards', {
        controller: 'DashboardsController',
        templateUrl: '/admin/dashboardsList.html'
      })

      .when('/dashboards/12', {
        controller: 'DashboardFakeDetailController',
        templateUrl: '/admin/dashboardFakeDetail.html'
      })

      .when('/dashboards/:id', {
        controller: 'DashboardDetailController',
        templateUrl: '/admin/dashboardDetail.html'
      })

      .when('/indicator', {
        controller: 'IndicatorIndexController',
        templateUrl: '/admin/indicator/index.html'
      })

      .when('/indicator/:action/:id?', {
        controller: 'IndicatorCreateController',
        templateUrl: '/admin/indicator/create.html'
      })

      .when('/origem', {
        controller : 'OrigemIndexController',
        templateUrl: '/admin/origem/index.html'
      })

      .when('/origem/query/:id?', {
        controller: 'QueryCreateController',
        templateUrl: '/admin/origem/create-query.html'
      })

      .when('/origem/aggregation/:id?', {
        controller: 'AggregationCreateController',
        templateUrl: '/admin/origem/create-aggregation.html'
      })

      .when('/permission', {
        controller: 'PermissionIndexController',
        templateUrl: '/admin/permission/index.html'
      })

      .when('/permission/:action/:id?', {
        controller: 'PermissionCreateController',
        templateUrl: '/admin/permission/create.html'
      })

      .when('/widget', {
        controller: 'WidgetIndexController',
        templateUrl: '/admin/widget/index.html'
      })

      .when('/widget/:action/:id?', {
        controller: 'WidgetCreateController',
        templateUrl: '/admin/widget/create.html'
      })

      .when('/user', {
        controller: 'UserIndexController',
        templateUrl: '/admin/user/index.html'
      })

      .when('/user/:action/:id?', {
        controller: 'UserCreateController',
        templateUrl: '/admin/user/create.html'
      })

      .when('/console', {
        controller: 'ConsoleController',
        templateUrl: '/admin/console.html'
      })

      .otherwise({
        redirectTo : '/dashboards'
      });
    })

    /**
     * Verifica se existe token na sessão ou no localStorage e intercepta as requests
     */
    .factory('httpRequestInterceptor', function () {
      var authorization = null;
      return {
        request: function (config) {
          var token = localStorage.getItem('token') || sessionStorage.getItem('token');
          if(token)
            config.headers.Authorization = 'Token token=' +token;
          return config;
        }
      };
    })

    .factory("zErrors", function(){
      return {
        handling: function(err){
          var messages = [];

          // handling error status
          if(err === null)
            messages = ["Conexão recusada"];
          else if (err.status && err.status === 500)
            messages = [err.statusText];
          else if(err.status && err.status === 0)
            messages = ["Servidor indisponível"];
          else{
            for(var index in err.errors) {
              messages.push(index + ': ' + err.errors[index]);
            }
          }

          return messages;
        }
      };
    })
    .filter('fromNow', function() {
      return function(date) {
        return moment(date).fromNow();
      }
    });
})();

