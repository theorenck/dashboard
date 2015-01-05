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
        $scope.userList = data.users;
      });
    }

    $scope.cancelar = function(){
      $scope.user = {};
    };

    $scope.salvar = function(){
      var data =  { "user" : $scope.user };

      if ($scope.user.id) {
        Users.update(data, function(){
          $scope.renderList();
          $scope.cancelar();
        });
      }else{
        Users.save(data, function(){
          $scope.renderList();
          $scope.cancelar();
        });
      }
    };

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


/**
 * CONSOLE CONTROLLER
 */
Atlas.controller('consoleController', [
  '$scope',
  'Statements',
  'Tables',

  function($scope, Statements, Tables){
    var code;

    $scope.showAdvancedOptions = true;
    $scope.showResults         = false;
    $scope.data_types          = ["varchar", "decimal", "integer", "date", "time", "timestamp"];
    $scope.isExecuting         = false;
    $scope.hasLimit            = true;
    $scope.results             = [];
    $scope.currentPage         = 1;
    $scope.errors              = [];

    $scope.validateParams = function(){
      for(var i = 0; i < $scope.statement.parameters.length; i++){
        var param = $scope.statement.parameters[i];
        if( param.name.trim() === '' || param.value.trim() === '')
          $scope.statement.parameters.splice(i,1);
      }
    }

    $scope.resetStatement = function(){
      $scope.statement = {
        parameters : [],
        sql : 'SELECT p.codproduto, p.codbarras, p.descricao1 FROM zw14ppro p WHERE p.situacao = \'N\'',
        limit : 100,
        offset : 0,
      };
    };

    $scope.addParam = function(){
      $scope.statement.parameters.push({
        name : "",
        value : "",
        type : "varchar",
        evaluated: false,
      });
    };

    $scope.executeQuery = function(currentPage){
      $scope.validateParams();

      $scope.isExecuting   = true;

      codeMirror.save();
      $scope.statement.sql = codeMirror.getValue();


      if (currentPage) {
        $scope.currentPage += currentPage;
        $scope.statement.offset = $scope.statement.limit * $scope.currentPage;
      };


      var data  = { "statement" : $scope.statement };

      if (!$scope.hasLimit) {
        delete data.statement.limit;
        delete data.statement.offset;
      };

      Statements.execute(data, function(data){
        $scope.errors = [];
        $scope.isExecuting = false;
        $scope.showResults = true;

        if($scope.currentPage > 1)
          $scope.results.rows = $scope.results.rows.concat(data.statement.rows);
        else
          $scope.results = data.statement;

      }, function(err){
        $scope.isExecuting = false;
        if (err.status === 500)
          $scope.errors = [err.statusText];
        else if(err.status === 0)
          $scope.errors = ["Servidor indisponível"];
        else
          $scope.errors = err.data.errors.base;
      });
    };

    $scope.initializeCodeMirror = function(){
      code = CodeMirror.fromTextArea(document.getElementById("statement"), {
        lineNumbers: true,
        extraKeys: {
          "Ctrl-Space": "autocomplete",
          "F8" : function(){
            console.log('F8');
          },
          "Ctrl-Enter" : function(e){
            console.log('Ctrl + Enter');
          }
        },
        mode: {
          name: "sql",
          globalVars: true
        },
        tabSize : 2,
        tabMode : "spaces",
        styleActiveLine: false,
        matchBrackets: true,
        mode : 'text/x-sql',
        viewportMargin: Infinity
        // readOnly : true
      });

      code.setOption("hintOptions",{
          tables: JSON.parse(localStorage.getItem("tables"))
      });

      return code;
    }

    $scope.resetStatement();
    codeMirror = $scope.initializeCodeMirror();
    codeMirror.setValue($scope.statement.sql);

    $scope.fetchTables = function(){
      $scope.isFetching = true;

      Tables.get(function(data){
        localStorage.setItem("tables", JSON.stringify(data.schema.tables));

        code.setOption("hintOptions",{
          tables: data.schema.tables
        });

      });
    }

  }
]);

/**
 * DASHBOARDS CONTROLLER
 */
Atlas.controller('dashboardsController', [
  '$scope',
  'Dashboards',
  function($scope, Dashboards){
    $scope.dashboards = [];

    Dashboards.get(function(data){
      $scope.dashboards = data.dashboards;
    });
  }
]);

/**
 * DASHBOARDS DETAIL CONTROLLER
 */
Atlas.controller('dashboardDetailController', [
  '$scope',
  'Dashboards',
  '$routeParams',
  function($scope, Dashboards, $routeParams){

    $scope.dashboard = {
      id : $routeParams.id
    };

    Dashboards.get({ dashboard : { id : $routeParams.id } }, function(data){
      console.log(data);
    });

    $scope.indicadores = {
      periodo : {
        inicio    : (moment().subtract(29,'days').format("YYYY-MM-DD 00:00:00")),
        fim       : (moment().format("YYYY-MM-DD 00:00:00")),
        duracao   : function(grandeza) {
          var grandeza  = grandeza || 'days';
          var fim       = moment(Indicadores.periodo.fim);
          var inicio    = moment(Indicadores.periodo.inicio);
          var diferenca = fim.diff(inicio,grandeza);
          return diferenca + 1;
        },
      },
    }



    Dashboards.get(function(data){
      $scope.dashboards = data.dashboards;
    });
  }
]);
