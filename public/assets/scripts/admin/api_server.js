var Atlas = angular.module('Atlas',['ngResource', 'ngRoute']);

/**
 * Configura o header para usar autenticação
 */
Atlas.config([
  '$httpProvider',

  function ($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('httpRequestInterceptor')
  }
]);


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

/**
 * Configuração de todas
 */
Atlas.config(function($routeProvider){
  $routeProvider

  .when('/', {
    templateUrl: 'home.html'
  })

  .when('/api-server', {
    controller: 'ApiServerController',
    templateUrl: 'api_server.html'
  })

  .when('/dashboard', {
    controller: 'dashboardController',
    templateUrl: 'dashboard.html'
  })

  .when('/indicator', {
    controller: 'indicatorController',
    templateUrl: 'indicator.html'
  })

  .when('/permissions', {
    controller: 'permissionsController',
    templateUrl: 'permissions.html'
  })

  .when('/users', {
    controller: 'usersController',
    templateUrl: 'users.html'
  })

  .when('/widgets', {
    controller: 'widgetsController',
    templateUrl: 'widgets.html'
  })

  .otherwise({
    redirectTo : '/'
  });
});


/* RESOURCE APISERVERS */
Atlas.factory(
  'ApiServers',
  ['$resource',

    function($resource){
      return $resource('http://127.0.0.1:9000/api/v1/api_servers/:id', { id: '@api_server.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

/* RESOURCE APISERVERS */
Atlas.factory(
  'AuthService',
  ['$resource',

    function($resource){
      return $resource('http://127.0.0.1:9000/api/v1/authentications/:id', { id: '@authentication.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);


/* RESOURCE DASHBOARDS */
Atlas.factory(
  'Dashboards',
  ['$resource',

    function($resource){
      return $resource('http://127.0.0.1:9000/api/v1/dashboards/:id', { id: '@dashboard.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

/* RESOURCE INDICATORS */
Atlas.factory(
  'Indicators',
  ['$resource',

    function($resource){
      return $resource('http://127.0.0.1:9000/api/v1/indicators/:id', { id: '@indicator.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

/* RESOURCE WIDGETS */
Atlas.factory(
  'Widgets',
  ['$resource',

    function($resource){
      return $resource('http://127.0.0.1:9000/api/v1/widgets/:id', { id: '@widget.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

/* RESOURCE USERS */
Atlas.factory(
  'Users',
  ['$resource',

    function($resource){
      return $resource('http://127.0.0.1:9000/api/v1/users/:id', { id: '@user.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

/* RESOURCE PERMISSIONS */
Atlas.factory(
  'Permissions',
  ['$resource',

    function($resource){
      return $resource('http://127.0.0.1:9000/api/v1/permissions/:id', { id: '@permission.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

/* RESOURCE WIDGET TYPES */
Atlas.factory(
  'WidgetTypes',
  ['$resource',
    function($resource){
      return $resource('http://127.0.0.1:9000/api/v1/widget_types/:id', { id: '@widget_types.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);


/**
 * APP CONTROLLER
 */
Atlas.controller('appController', [
  "$scope",
  "AuthService",
  function($scope, AuthService){
    $scope.credentials = {};

    $scope.login = function(credentials){
      var authentication = {"authentication"  : credentials };

      AuthService.save(authentication, function(res){
        if (res.authentication && res.authentication.token) {
          var token = res.authentication.token;
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('logged-in', true);
        }else{
          sessionStorage.setItem('logged-in', false);
        }
      });
    };

    $scope.logout = function(){
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('logged-in');
    };

    $scope.isLoggedIn = function(){
      return !!sessionStorage.getItem('logged-in') && !!sessionStorage.getItem('token') || false;
    }

    $scope.range = function(num){
      return new Array(num);
    };

  }
]);

/**
 * API SERVER CONTROLLER
 */
Atlas.controller('ApiServerController', [
  'ApiServers',
  '$scope',

  function(ApiServers, $scope){
    $scope.api_server = {};
    $scope.serverList = [];

    $scope.cancelarApiServer = function(){
      $scope.api_server = {};
    }

    $scope.renderList = function(){
      ApiServers.get(function(data){
        $scope.serverList = data.api_servers;
      });
    }

    $scope.saveApiServer = function(){
      var data =  { "api_server" : $scope.api_server };

      if ($scope.api_server.id) {
        ApiServers.update(data, function(){
          $scope.renderList();
          $scope.api_server = {};
        });
      }else{
        ApiServers.save(data, function(){
          $scope.renderList();
          $scope.api_server = {};
        });
      }
    };

    $scope.deleteApiServer = function(id){
      var data = { "id" : id };
      ApiServers.remove(data, function(data){
        $scope.renderList();
      });
    }

    $scope.loadApiServer = function(server){
      $scope.api_server = server;
    }

    $scope.renderList();
  }

]);

/**
 * DASHBOARD CONTROLLER
 */
Atlas.controller('dashboardController', [
  '$scope',
  'Dashboards',

  function($scope, Dashboards){
    $scope.dashboard     = {};
    $scope.dashboardList = [];
    $scope.availableApiServers = [];

    $scope.renderList = function(){
      Dashboards.get(function(data){
        $scope.dashboardList = data.dashboards;
      });
    }

    $scope.loadDashboard = function(dash){
      $scope.dashboard = dash;
    }

    $scope.salvar = function(){
      var data =  { "dashboard" : $scope.dashboard };

      if ($scope.dashboard.id) {
        Dashboards.update(data, function(){
          $scope.renderList();
          $scope.dashboard = {};
        });
      }else{
        Dashboards.save(data, function(data){
          $scope.renderList();
          $scope.dashboard = {};
        });
      }
    };

    $scope.delete = function(id){
      var data = { "id" : id };
      Dashboards.remove(data, function(data){
        $scope.renderList();
        $scope.dashboard = {};
      });
    }

    $scope.cancelar = function(){
      $scope.dashboard = {};
    }


    $scope.renderList();
  }
]);

/**
 * INDICATOR CONTROLLER
 */
Atlas.controller('indicatorController', [
  '$scope',
  'Indicators',

  function($scope, Indicators){
    $scope.data_types    = ['datetime', 'string', 'int'];
    $scope.indicatorList = [];
    $scope.indicator     = {
      "query" : {
        "parameters" : [],
      }
    };

    $scope.salvar = function(){
      $scope.indicator.query.parameters.forEach(function(el, i){
        if ((el.name === '' || el.name === null) && (el.default_value === '' || el.default_value === null))
          delete $scope.indicator.query.parameters[i];
      });

      var data =  { "indicator" : $scope.indicator };

      if ($scope.indicator.id) {
        Indicators.update(data, function(){
          $scope.renderList();
          $scope.indicator = {};
        });
      }else{
        Indicators.save(data, function(data){
          $scope.renderList();
          $scope.indicator = {};
        });
      }
    };

    $scope.renderList = function(){
      Indicators.get(function(data){
        $scope.indicatorList = data.indicators;
      });
    }

    $scope.loadIndicator = function(item){
      $scope.indicator = item;
    }

    $scope.addParam = function(){
      $scope.indicator.query.parameters.push({});
    }

    $scope.delete = function (id) {
      var data = { "id" : id };
      Indicators.remove(data, function(data){
        $scope.renderList();
        $scope.cancelar();
      });
    }

    $scope.cancelar = function(){
      $scope.indicator = {
        "query" : {
          "parameters" : [],
        }
      };
    }

    $scope.renderList();
  }
]);

/**
 * WIDGET CONTROLLER
 */
Atlas.controller('widgetsController', [
  '$scope',
  'Widgets',
  'Indicators',
  'Dashboards',
  'WidgetTypes',

  function($scope, Widgets, Indicators, Dashboards, WidgetTypes){
    $scope.widget     = {};
    $scope.widgetList = [];

    Indicators.get(function(data){
      $scope.availableIndicators = data.indicators;
    });

    Dashboards.get(function(data){
      $scope.availableDashboards = data.dashboards;
    });

    WidgetTypes.get(function(data){
      $scope.availableWidgetTypes = data.widget_types;
    });

    $scope.salvar = function(){
      var data =  { "widget" : $scope.widget };
      data.widget.indicator_id   = $scope.widget.indicator.id;
      data.widget.widget_type_id = $scope.widget.widget_type.id;

      if ($scope.widget.id) {
        Widgets.update(data, function(){
          $scope.renderList();
          $scope.cancelar();
        });
      }else{
        Widgets.save(data, function(){
          $scope.renderList();
          $scope.cancelar();
        });
      }
    };

    $scope.delete = function(id){
      Widgets.remove({ "id" : id },function(){
        $scope.renderList();
        $scope.cancelar();
      });
    }

    $scope.renderList = function(){
      Widgets.get(function(data){
        $scope.widgetList = data.widgets;
      });
    }

    $scope.loadwidget = function(item){
      $scope.widget = item;
    }

    $scope.cancelar = function(){
      $scope.widget = {};
    };


    $scope.renderList();
  }
]);


/**
 * USERS CONTROLLER
 */
Atlas.controller('usersController', [
  '$scope',
  'Users',

  function($scope, Users){
    $scope.user     = {};
    $scope.userList = [];

    $scope.renderList = function(){
      Users.get(function(data){
        console.log(data.users);
        $scope.userList = data.users;
      });
    }

    $scope.loadUser = function(item){
      $scope.user = item;
    }

    $scope.renderList();
  }
]);


/**
 * PERMISSIONS CONTROLLER
 */
Atlas.controller('permissionsController', [
  '$scope',
  'Permissions',
  'Users',
  'ApiServers',
  'Dashboards',

  function($scope, Permissions, Users, ApiServers, Dashboards){
    $scope.permission     = {};
    $scope.permissionList = [];

    Users.get(function(data){
      $scope.availableUsers = data.users;
    });

    ApiServers.get(function(data){
      $scope.availableApiServers = data.api_servers;
    });

    Dashboards.get(function(data){
      $scope.availableDashboards = data.dashboards;
    });

    $scope.salvar = function(){
      var data =  { "permission" : $scope.permission };

      if ($scope.permission.id) {
        Permissions.update(data, function(){
          $scope.renderList();
          $scope.permission = {};
        });
      }else{
        Permissions.save(data, function(){
          $scope.renderList();
          $scope.permission = {};
        });
      }
    };

    $scope.renderList = function(){
      Permissions.get(function(data){
        $scope.permissionList = data.permissions;
      });
    }

    $scope.delete = function (id) {
      var data = { "id" : id };
      Permissions.remove(data, function(data){
        $scope.renderList();
      });
    };

    $scope.cancelar = function(){
      $scope.permission = {};
    };

    $scope.loadPermission = function(item){
      $scope.permission = {
        "id" : item.id,
        "user_id" : item.user ? item.user.id : 0,
        "dashboard_id" : item.dashboard ? item.dashboard.id : 0,
        "api_server_id" : (item.api_server ? item.api_server.id : 0),
      };
    }

    $scope.renderList();
  }
]);