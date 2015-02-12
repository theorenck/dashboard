(function(){
  'use strict';

  try{
    if(typeof Configuration.business_server === 'undefined' || Configuration.business_server === null)
      alert('Por favor verifique seu arquivo de configuração, parece estar faltando alguns dados');
  }catch(Exception){
    console.log(Exception);
  }

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
        templateUrl: '/templates/data-source-server/index.html'
      })

      .when('/data-source-server/:action/:id?', {
        controller: 'DataSourceCreateController',
        templateUrl: '/templates/data-source-server/create.html'
      })

      .when('/dashboard', {
        controller: 'DashboardIndexController',
        templateUrl: '/templates/dashboard/index.html'
      })

      .when('/dashboard/:action/:id?', {
        controller: 'DashboardCreateController',
        templateUrl: '/templates/dashboard/create.html'
      })

      .when('/dashboards', {
        controller: 'DashboardsController',
        templateUrl: '/templates/dashboard-detail/dashboardsList.html'
      })

      .when('/dashboards/12', {
        controller: 'DashboardFakeDetailController',
        templateUrl: '/templates/dashboard-detail/dashboardFakeDetail.html'
      })

      .when('/dashboards/:id', {
        controller: 'DashboardDetailController',
        templateUrl: '/templates/dashboard-detail/dashboardDetail.html'
      })

      .when('/indicator', {
        controller: 'IndicatorIndexController',
        templateUrl: '/templates/indicator/index.html'
      })

      .when('/indicator/:action/:id?', {
        controller: 'IndicatorCreateController',
        templateUrl: '/templates/indicator/create.html'
      })

      .when('/origem', {
        controller : 'OrigemIndexController',
        templateUrl: '/templates/origem/index.html'
      })

      .when('/origem/query/:id?', {
        controller: 'QueryCreateController',
        templateUrl: '/templates/origem/create-query.html'
      })

      .when('/origem/aggregation/:id?', {
        controller: 'AggregationCreateController',
        templateUrl: '/templates/origem/create-aggregation.html'
      })

      .when('/permission', {
        controller: 'PermissionIndexController',
        templateUrl: '/templates/permission/index.html'
      })

      .when('/permission/:action/:id?', {
        controller: 'PermissionCreateController',
        templateUrl: '/templates/permission/create.html'
      })

      .when('/widget', {
        controller: 'WidgetIndexController',
        templateUrl: '/templates/widget/index.html'
      })

      .when('/widget/:action/:id?', {
        controller: 'WidgetCreateController',
        templateUrl: '/templates/widget/create.html'
      })

      .when('/user', {
        controller: 'UserIndexController',
        templateUrl: '/templates/user/index.html'
      })

      .when('/user/:action/:id?', {
        controller: 'UserCreateController',
        templateUrl: '/templates/user/create.html'
      })

      .when('/console', {
        controller: 'ConsoleController',
        templateUrl: '/templates/console/console.html'
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
          else if (err.status !== 'undefined' && err.status === 500)
            messages = [err.statusText];
          else if(err.status !== 'undefined' && err.status === 0)
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

