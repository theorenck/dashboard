/* global Configuration, console, alert, angular, moment */
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
        $httpProvider.interceptors.push('httpRequestInterceptor');
      }
    ])

    /**
     * Configuração de todas as rotas
     */
    .config(function($routeProvider){

      $routeProvider

      .when('/data-source-server', {
        controller: 'DataSourceIndexController',
        templateUrl: '/dist/templates/data-source-server/index.html'
      })

      .when('/data-source-server/:action/:id?', {
        controller: 'DataSourceCreateController',
        templateUrl: '/dist/templates/data-source-server/create.html'
      })

      .when('/dashboard', {
        controller: 'DashboardIndexController',
        templateUrl: '/dist/templates/dashboard/index.html'
      })

      .when('/dashboard/:action/:id?', {
        controller: 'DashboardCreateController',
        templateUrl: '/dist/templates/dashboard/create.html'
      })

      .when('/dashboards', {
        controller: 'DashboardsController',
        templateUrl: '/dist/templates/dashboard-detail/dashboardsList.html'
      })

      .when('/dashboards/12', {
        controller: 'DashboardFakeDetailController',
        templateUrl: '/dist/templates/dashboard-detail/dashboardFakeDetail.html'
      })

      .when('/dashboards/:id', {
        controller: 'DashboardDetailController',
        templateUrl: '/dist/templates/dashboard-detail/dashboardDetail.html'
      })

      .when('/dashboards/v2/:id', {
        controller: 'DashboardDetailController',
        templateUrl: '/dist/templates/dashboard-detail/dashboardDetail2.html'
      })

      .when('/indicator', {
        controller: 'IndicatorIndexController',
        templateUrl: '/dist/templates/indicator/index.html'
      })

      .when('/indicator/:action/:id?', {
        controller: 'IndicatorCreateController',
        templateUrl: '/dist/templates/indicator/create.html'
      })

      .when('/origem', {
        controller : 'OrigemIndexController',
        templateUrl: '/dist/templates/origem/index.html'
      })

      .when('/origem/query/:id?', {
        controller: 'QueryCreateController',
        templateUrl: '/dist/templates/origem/create-query.html'
      })

      .when('/origem/aggregation/:id?', {
        controller: 'AggregationCreateController',
        templateUrl: '/dist/templates/origem/create-aggregation.html'
      })

      .when('/permission', {
        controller: 'PermissionIndexController',
        templateUrl: '/dist/templates/permission/index.html'
      })

      .when('/permission/:action/:id?', {
        controller: 'PermissionCreateController',
        templateUrl: '/dist/templates/permission/create.html'
      })

      .when('/widget', {
        controller: 'WidgetIndexController',
        templateUrl: '/dist/templates/widget/index.html'
      })

      .when('/widget/:action/:id?', {
        controller: 'WidgetCreateController',
        templateUrl: '/dist/templates/widget/create.html'
      })

      .when('/user', {
        controller: 'UserIndexController',
        templateUrl: '/dist/templates/user/index.html'
      })

      .when('/user/:action/:id?', {
        controller: 'UserCreateController',
        templateUrl: '/dist/templates/user/create.html'
      })

      .when('/console', {
        controller: 'ConsoleController',
        templateUrl: '/dist/templates/console/console.html'
      })

      .otherwise({
        redirectTo : '/dashboards'
      });
    })

    /**
     * Verifica se existe token na sessão ou no localStorage e intercepta as requests
     */
    .factory('httpRequestInterceptor', function () {
      return {
        request: function (config) {
          var token = localStorage.getItem('token') || sessionStorage.getItem('token');
          if(token)
            config.headers.Authorization = 'Token token=' +token;
          return config;
        }
      };
    })

    .factory('zErrors', function(){
      return {
        handling: function(err){
          var messages = [];

          // handling error status
          if(err === null)
            messages = ['Conexão recusada'];
          else if (err.status !== 'undefined' && err.status === 500)
            messages = [err.statusText];
          else if(err.status !== 'undefined' && err.status === 0)
            messages = ['Servidor indisponível'];
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
      };
    });
})();