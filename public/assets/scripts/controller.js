/**
 * APP CONTROLLER
 */
Atlas.controller('appController', [
  "$scope",
  "AuthService",
  function($scope, AuthService){
    $scope.credentials = {};
    $scope.open = false;

    $scope.login = function(credentials){
      var authentication = {"authentication"  : credentials };

      AuthService.save(authentication, function(res){
        if (res.authentication && res.authentication.token) {
          var token = res.authentication.token;
          localStorage.setItem('token', token);
          localStorage.setItem('logged-in', true);
        }else{
          localStorage.setItem('logged-in', false);
        }
      });
    };

    $scope.logout = function(){
      localStorage.removeItem('token');
      localStorage.removeItem('logged-in');
    };

    $scope.isLoggedIn = function(){
      return !!localStorage.getItem('logged-in') && !!localStorage.getItem('token') || false;
    }

    $scope.range = function(num){
      return new Array(num);
    };

  }
]);

/**
 * DATA SOURCE INDEX CONTROLLER
 */
Atlas.controller('DataSourceIndexController', [
  'DataSourceService',
  '$scope',
  '$location',

  function(DataSourceService, $scope, $location){
    $scope.serverList         = [];

    $scope.renderList = function(){
      DataSourceService.get(function(data){
        $scope.serverList = data.data_source_servers;
      });
    }

    $scope.loadServer = function(id){
      $location.path('/data-source-server/update/' + id);
    }

    $scope.deleteServer = function(id, $index, $event){
      $event.preventDefault();
      DataSourceService.remove({ "id" : id }, function(){
        $scope.renderList();
      });
    }

    $scope.renderList();
  }
]);

/**
 * DATA SOURCE CREATE / UPDATE CONTROLLER
 */
Atlas.controller('DataSourceCreateController', [
  'DataSourceService',
  '$scope',
  '$routeParams',
  '$location',

  function(DataSourceService, $scope, $routeParams, $location){
    $scope.data_source_server = {};

    $scope.cancelarApiServer = function(){
      $scope.data_source_server = {};
    }

    $scope.saveApiServer = function(){
      var data =  {
        "data_source_server" : $scope.data_source_server
      };

      if ($scope.data_source_server.id) {
        DataSourceService.update(data, function(){
          $location.path('/data-source-server/');
        });
      }else{
        DataSourceService.save(data, function(){
          $location.path('/data-source-server/');
        });
      }
    };

    if ($routeParams.id) {
      DataSourceService.get({ id : $routeParams.id }, function(data){
        $scope.data_source_server = data.data_source_server;
      });
    };
  }
]);


/**
 * DASHBOARD CRUD INDEX CONTROLLER
 */
Atlas.controller('DashboardIndexController', [
  '$scope',
  'Dashboards',
  '$location',

  function($scope, Dashboards, $location){
    $scope.dashboardList = [];

    $scope.renderList = function(){
      Dashboards.get(function(data){
        $scope.dashboardList = data.dashboards;
      });
    }

    $scope.load = function(id){
      $location.path('/dashboard/update/' + id);
    }

    $scope.delete = function(id, $index, $event){
      $event.preventDefault();

      var data = { "id" : id };
      Dashboards.remove(data, function(data){
        $scope.renderList();
      });
    }

    $scope.renderList();
  }
]);

/**
 * DASHBOARD Create/Update CONTROLLER
 */
Atlas.controller('DashboardCreateController', [
  '$scope',
  'Dashboards',
  '$routeParams',
  '$location',

  function($scope, Dashboards, $routeParams, $location){
    $scope.dashboard = {};

    $scope.salvar = function(){
      var data =  { "dashboard" : $scope.dashboard };

      if ($scope.dashboard.id) {
        Dashboards.update(data, function(){
          $location.path('/dashboard/');
        });
      }else{
        Dashboards.save(data, function(data){
          $location.path('/dashboard/');
        });
      }
    };

    $scope.cancelar = function(){
      $scope.dashboard = {};
    }

    if ($routeParams.id) {
      Dashboards.get({ id : $routeParams.id}, function(data){
        $scope.dashboard = data.dashboard;
      });
    };

  }
]);



Atlas.controller('IndicatorIndexController', [
  '$scope',
  'IndicatorsService',
  '$location',

  function($scope, IndicatorsService, $location){
    $scope.indicatorList = [];

    $scope.renderList = function(){
      IndicatorsService.get(function(data){
        $scope.indicatorList = data.indicators;
      });
    }

    $scope.load = function(id){
      $location.path('indicator/update/' + id);
    };

    $scope.delete = function (id, $index, $event) {
      $event.preventDefault();
      var data = { "id" : id };
      IndicatorsService.remove(data, function(data){
        $scope.renderList();
      });
    }

    $scope.renderList();
  }
]);


Atlas.controller('IndicatorCreateController', [
  '$scope',
  '$routeParams',
  'IndicatorsService',
  'SourceService',
  'UnityService',
  '$location',

  function($scope, $routeParams, IndicatorsService, SourceService, UnityService, $location){
    $scope.sourceList = [];
    $scope.unityList  = [];

    SourceService.get(function(data){
      $scope.sourceList = data.sources;
    });

    UnityService.get(function(data){
      $scope.unityList = data.unities;
    });

    $scope.salvar = function(){
      var data =  { "indicator" : $scope.indicator };


      if ($scope.indicator.id) {
        IndicatorsService.update(data, function(){
          $location.path('/indicator/')
        });
      }else{
        IndicatorsService.save(data, function(data){
          $location.path('/indicator/')
        });
      }
    };

    if ($routeParams.id) {
      IndicatorsService.get({ id : $routeParams.id}, function(data){
        $scope.indicator = data.indicator;
      });
    };
  }
]);


/**
 * WIDGET CONTROLLER
 */
Atlas.controller('WidgetIndexController', [
  '$scope',
  'Widgets',
  '$location',

  function($scope, Widgets, $location){
    $scope.widget     = {};
    $scope.widgetList = [];

    $scope.delete = function(id, $index, $event){
      $event.preventDefault();
      Widgets.remove({ "id" : id },function(){
        $scope.renderList();
      });
    }

    $scope.load = function(id){
      $location.path('/widget/update/' + id);
    }

    $scope.renderList = function(){
      Widgets.get(function(data){
        $scope.widgetList = data.widgets;
      });
    }

    $scope.renderList();
  }
]);


/**
 * WIDGET CONTROLLER
 */
Atlas.controller('WidgetCreateController', [
  '$scope',
  'Widgets',
  'IndicatorsService',
  'Dashboards',
  'WidgetTypes',
  '$routeParams',
  '$location',

  function($scope, Widgets, IndicatorsService, Dashboards, WidgetTypes, $routeParams, $location){
    $scope.widget     = {};
    $scope.widgetList = [];

    IndicatorsService.get(function(data){
      $scope.availableIndicators = data.indicators;
    });

    Dashboards.get(function(data){
      $scope.availableDashboards = data.dashboards;
    });

    WidgetTypes.get(function(data){
      $scope.availableWidgetTypes = data.widget_types;
    });

    if ($routeParams.id) {
      Widgets.get({ id : $routeParams.id }, function(data){
        $scope.widget = data.widget;
      });
    };

    $scope.salvar = function(){
      var data =  { "widget" : $scope.widget };
      data.widget.indicator_id   = $scope.widget.indicator.id;
      data.widget.widget_type_id = $scope.widget.widget_type.id;

      if ($scope.widget.id) {
        Widgets.update(data, function(){
          $location.path('/widget/');
        });
      }else{
        Widgets.save(data, function(){
          $location.path('/widget/');
        });
      }
    };

  }
]);


/**
 * USERS CONTROLLER
 */
Atlas.controller('UserIndexController', [
  '$scope',
  'Users',
  '$location',

  function($scope, Users, $location){
    $scope.userList = [];

    $scope.renderList = function(){
      Users.get(function(data){
        $scope.userList = data.users;
      });
    }

    $scope.load = function(id){
      $location.path('user/update/' + id);
    };

    $scope.delete = function (id, $index, $event) {
      $event.preventDefault();
      var data = { "id" : id };
      Users.remove(data, function(data){
        $scope.renderList();
      });
    }


    $scope.renderList();
  }
]);


/**
 * USERS CONTROLLER
 */
Atlas.controller('UserCreateController', [
  '$scope',
  'Users',
  '$routeParams',
  '$location',

  function($scope, Users, $routeParams, $location){
    $scope.user     = {};

    $scope.cancelar = function(){
      $scope.user = {};
    };

    $scope.salvar = function(){
      var data =  { "user" : $scope.user };

      if ($scope.user.id) {
        Users.update(data, function(){
          $location.path('/user/');
        });
      }else{
        Users.save(data, function(){
          $location.path('/user/');
        });
      }
    };

    if ($routeParams.id) {
      Users.get({id : $routeParams.id}, function(data){
        $scope.user = data.user;
      });
    }
  }
]);


/**
 * PERMISSIONS CONTROLLER
 */
Atlas.controller('PermissionIndexController', [
  '$scope',
  'Permissions',
  '$location',

  function($scope, Permissions, $location){
    $scope.permissionList = [];

    $scope.renderList = function(){
      Permissions.get(function(data){
        $scope.permissionList = data.permissions;
      });
    }

    $scope.load = function(id){
      $location.path('permission/update/' + id);
    };

    $scope.delete = function (id, $index, $event) {
      $event.preventDefault();
      var data = { "id" : id };
      Permissions.remove(data, function(data){
        $scope.renderList();
      });
    }

    $scope.renderList();
  }
]);


/**
 * PERMISSIONS CONTROLLER
 */
Atlas.controller('PermissionCreateController', [
  '$scope',
  'Permissions',
  'Users',
  'DataSourceService',
  'Dashboards',
  '$routeParams',
  '$location',

  function($scope, Permissions, Users, DataSourceService, Dashboards, $routeParams, $location){
    $scope.permission     = {};
    $scope.availableUsers = [];
    $scope.availableDataSourceService = [];
    $scope.availableDashboards = [];

    Users.get(function(data){
      $scope.availableUsers = data.users;
    });

    DataSourceService.get(function(data){
      $scope.availableDataSourceService = data.data_source_servers;
    });

    Dashboards.get(function(data){
      $scope.availableDashboards = data.dashboards;
    });

    $scope.salvar = function(){
      var data =  { "permission" : $scope.permission };

      if ($scope.permission.id) {
        Permissions.update(data, function(){
          $location.path('/permission/');
        });
      }else{
        Permissions.save(data, function(){
          $location.path('/permission/');
        });
      }
    };

    if($routeParams.id){
      Permissions.get({ id : $routeParams.id }, function (data) {
        $scope.permission = data.permission;
      });
    }

  }
]);


/**
 * CONSOLE CONTROLLER
 */
Atlas.controller('consoleController', [
  '$scope',
  'Statements',
  'Tables',
  'History',
  'zCodeMirror',

  function($scope, Statements, Tables, History, zCodeMirror){
    var code;

    $scope.showAdvancedOptions = true;
    $scope.showResults         = false;
    $scope.data_types          = ["varchar", "decimal", "integer", "date", "time", "timestamp"];
    $scope.isExecuting         = false;
    $scope.hasLimit            = true;
    $scope.results             = [];
    $scope.currentPage         = 1;
    $scope.errors              = [];
    $scope.historyItems        = [];

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
      $scope.addParam();
    };

    $scope.addParam = function(){
      $scope.statement.parameters.push({
        name : "",
        value : "",
        type : "varchar",
        evaluated: false,
      });
    };

    $scope.deleteParam = function(key){
      $scope.statement.parameters.splice(key,1);
    }

    $scope.executeQuery = function(currentPage){
      $scope.validateParams();

      $scope.isExecuting   = true;

      zCodeMirror.save();
      $scope.statement.sql = zCodeMirror.getValue();


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
        History.post($scope.statement);
        $scope.renderHistory();

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
          $scope.errors = err.data.errors.base || err.data.errors.sql;
      });
    };


    $scope.fetchTables = function(){
      $scope.isFetching = true;

      Tables.get(function(data){
        localStorage.setItem("tables", JSON.stringify(data.schema.tables));

        code.setOption("hintOptions",{
          tables: data.schema.tables
        });

      });
    }

    $scope.loadHistoryItem = function(row){
      $scope.statement = row.statement;
      zCodeMirror.setValue(row.statement.sql);
    }

    $scope.renderHistory = function(){
      History.get(function(data){
        $scope.historyItems = data;
      });
    }

    $scope.delete = function(id){
      History.delete(id, function(data){
        $scope.historyItems = data;
      });
    }

    $scope.getStyleType = function(type){
      switch(type){
        case "SELECT":
          return 'label-info';
      }
    },

    $scope.resetStatement();
    zCodeMirror.initialize(document.getElementById("statement"));
    zCodeMirror.setHints();
    zCodeMirror.setValue($scope.statement.sql);
    $scope.renderHistory();
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
 * QUERIES CONTROLLER
 */
Atlas.controller('OrigemIndexController', [
  '$scope',
  'Dashboards',
  'SourceService',
  '$location',

  function($scope, Dashboards, SourceService, $location){
    $scope.queriesList = [];

    SourceService.get(function(data){
      $scope.queriesList = data.sources;
    });

    $scope.loadSource = function(type, id){
      var type = type.toLowerCase();
      $location.path("origem/" + type + "/" + id);
    }

    $scope.deleteQuery = function(id, $index, $event){
      $event.preventDefault();
      if (window.confirm('Deseja deletar esse registro?')) {
        /* @todo: Deletar registro */
      };
    }

  }
]);

/**
 * QUERIES CONTROLLER
 */
Atlas.controller('QueryCreateController', [
  '$scope',
  'Dashboards',
  'SourceService',
  '$routeParams',
  '$location',

  function($scope, Dashboards, SourceService, $routeParams, $location){

    $scope.showAdvancedOptions = true;
    $scope.showResults         = false;
    $scope.data_types          = ["varchar", "decimal", "integer", "date", "time", "timestamp"];
    $scope.isExecuting         = false;
    $scope.hasLimit            = true;
    $scope.results             = [];
    $scope.currentPage         = 1;
    $scope.errors              = [];
    $scope.historyItems        = [];

    $scope.save = function(){
      $scope.validateParams();
      $scope.statement.type = "Query";

      var data = { source : $scope.statement };

      if ($scope.statement.id) {
        SourceService.update(data, function(data){
          $location.path('/origem/');
        });
      }else{
        SourceService.save(data, function(data){
          $location.path('/origem/');
        });
      }

    };

    $scope.validateParams = function(){
      console.log($scope.statement.parameters);
      for(var i = 0; i < $scope.statement.parameters.length; i++){
        var param = $scope.statement.parameters[i];
        if( param.name.trim() === '' )
          $scope.statement.parameters.splice(i,1);
      }
    };

    $scope.resetStatement = function(){
      $scope.statement = {
        parameters : [],
        sql : 'SELECT p.codproduto, p.codbarras, p.descricao1 FROM zw14ppro p WHERE p.situacao = \'N\'',
        limit : 100,
        offset : 0,
      };
      $scope.addParam();
    };

    $scope.addParam = function(){
      $scope.statement.parameters.push({
        name : "",
        value : "",
        type : "varchar",
        evaluated: false,
      });
    };

    $scope.deleteParam = function(key){
      $scope.statement.parameters[key]._destroy = true;
    }

    if ( !isNaN($routeParams.id) ) {
      SourceService.get({ id : $routeParams.id }, function(data){
        $scope.statement = data.query;
      });
    }else{
      $scope.resetStatement();
    }
  }
]);


/**
 * AGREGAÇÃO CONTROLLER
 */
Atlas.controller('AggregationCreateController', [
  '$scope',
  'Dashboards',
  'SourceService',
  '$routeParams',
  'FunctionsService',
  '$location',

  function($scope, Dashboards, SourceService, $routeParams, FunctionsService, $location){
    $scope.data_types     = ["varchar", "decimal", "integer", "date", "time", "timestamp"];


    SourceService.get(function(data){
      $scope.sourceList = data.sources.filter(function(index, elem) {
        if(index.type === 'Query') return index;
      });
    });

    FunctionsService.get(function(data){
      $scope.functionList = data.functions;
    });

    $scope.addParam = function(){
      $scope.aggregation.parameters.push({
        datatype : 'varchar'
      });
    }

    $scope.addExecution = function(){
      data = {
        'function_id': $scope.functionList[0].id,
        'name': $scope.functionList[0].name,
        'parameters': {
          "name" : $scope.functionList[0].parameters.name,
          "type" : $scope.functionList[0].parameters.type
        }
      };

      $scope.aggregation.executions.push(data);
    }

    $scope.addSource = function(){
      $scope.aggregation.sources.push({});
    }

    $scope.deleteParam = function(key){
      $scope.aggregation.parameters[key]._destroy = true;
    }

    $scope.deleteSource = function(key){
      $scope.aggregation.sources.splice(key,1);
    }



    $scope.save = function(){
      $scope.aggregation.type = "Aggregation";

      var data = { source : $scope.aggregation };

      if ($scope.aggregation.id) {
        SourceService.update(data, function(data){
          $location.path('/origem/');
        });
      }else{
        SourceService.save(data, function(data){
          $location.path('/origem/');
        });
      }
    };

    if ( !isNaN($routeParams.id) ) {
      SourceService.get({ id : $routeParams.id }, function(data){
        $scope.aggregation = data.aggregation;
      });
    }else{
      $scope.aggregation = {
        parameters : [],
        sources : [],
        executions : []
      }
    }
  }
]);

/**
 * DASHBOARDS DETAIL CONTROLLER
 */
Atlas.controller('dashboardDetailController', [
  '$scope',
  '$routeParams',
  'Dashboards',
  'SourceService',
  'QueryService',
  'AggregationService',

  function($scope, $routeParams, Dashboards, SourceService, QueryService, AggregationService){
    $scope.dashboard        = {};
    $scope.sourceList       = [];
    $scope.dataSourceServer = {};
    $scope.activeDataSourceServer;

    Dashboards.get({ id : $routeParams.id }, function(data){
      $scope.dashboard              = data.dashboard;
      $scope.dataSourceServer       = data.dashboard.data_source_servers[0];
      $scope.activeDataSourceServer = $scope.dataSourceServer.id;
      $scope.loadWidgets();
    });


    $scope.getStatus = function(result, widget){
      x  = NumberHelpers.number_to_human(result, {
        labels : { thousand : 'mil', million : 'Mi', billion : 'Bi', trillion : 'Tri' },
        precision: 3,
        significant : true,
        separator : ",",
        delimiter : '.'
      });

      x = x.split(' ');
      widget.result   = x[0];
      widget.grandeza = x[1];
    };

    $scope.prepareDataset = function(rows){
      var dataSet   = [];
      var dataAtual = moment($scope.indicadores.periodo.inicio).format("YYYY-MM-DD");
      var dataFinal = moment($scope.indicadores.periodo.fim).format("YYYY-MM-DD");

      var valores   = {
        values             : [],
        labels             : [],
        plotBands          : []
      };



      /**
       * Procura nas linhas se existe valor para todos os dias,
       * se não existir insere a data e valor zero no array das linhas
       */
      while(dataAtual <= dataFinal){

        var find = _.find(rows, function(el) {
          return (el[0] === dataAtual);
        });

        find === undefined ? dataSet.push([dataAtual,0,0,0,0]) : dataSet.push(find);

        dataAtual = moment(dataAtual).add(1, 'day').format("YYYY-MM-DD");
      }


      $.each(dataSet, function(el, val){
        diaSemana = moment(val[0]).format('dd');
        valores.values.push([moment(val[0]).format('x'), val[1]]);

        if (diaSemana === 'sáb') {
          valores.plotBands.push({
            from: moment(val[0]).format('x'),
            to: moment(val[0]).add(1,'day').format('x'),
            color: 'rgba(192, 192, 192, .2)'
          });
        }

      });

      valores.values = (valores.values).sort(function(a, b) {
        return a[0] - b[0];
      });

      return valores;
    },

    $scope.getGraph = function(widget, data){
      var valores = $scope.prepareDataset(data.statement.rows);
      var title   = widget.customized ? widget.name : widget.indicator.name;

      $.each(valores.values, function(index, val) {
        valores.values[index][0] = parseInt(val[0]);
      });

      function grafico(valores) {
        chart = $('[data-behaivor="widget"][data-id=' + widget.id + '] .content').highcharts('StockChart', {
            colors : [ Configuration.colors[widget.color] ],
            title : {
              text : "<h3>" + title + "</h3>",
              useHtml : true,
              style : {
                fontFamily : "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize : '19px'
              }
            },

            chart : {
              zoomType : 'x',
              panning: true,
              panKey: 'shift',
              resetZoomButton: {
                theme: {
                  fill: '#2c3e50',
                  stroke: '#2c3e50',
                  style: {
                    color: 'white',
                  },
                  r: 0,
                  states: {
                    hover: {
                      fill: '#1a242f',
                      stroke: '#2c3e50',
                      style: {
                        color: 'white',
                        cursor: "pointer"
                      }
                    }
                  }
                }
              }
            },

            navigation: {
              buttonOptions: {
                width: 120
              }
            },

            navigator :{
              enabled : false
            },

            credits : {
              enabled: false
            },

            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },

            rangeSelector : {
                buttonTheme: {
                  width: 90,
                  r : 0,
                },

                inputEnabled : false,
                selected : 1,
                buttons: [
                {
                  type: 'month',
                  count: 1,
                  text: '1m'
                },
                {
                  type: 'month',
                  count: 3,
                  text: '3m'
                },
                {
                  type: 'month',
                  count: 6,
                  text: '6m'
                },
                {
                  type: 'all',
                  text: 'Tudo'
                }]
            },

            plotOptions: {
              areaspline: {
                fillOpacity: 0.5
              },
              series: {
                states: {
                  hover: {
                    lineWidthPlus: 10
                  }
                },
              }
            },

            xAxis : {
                type: 'datetime',
                minRange: 14 * 24 * 3600000,
                minTickInterval: 24 * 3600 * 1000,
                plotBands: valores.plotBands,
                labels : { maxStaggerLines : 1 }
            },

            series : [{
                type : 'areaspline',
                name : 'Contratos',
                data : valores.values,
                lineWidth: 2,
                marker : {
                  enabled : true,
                  radius : 3
                },
                tooltip: {
                  valueDecimals: 2
                }
            }],
        });
      }

      grafico(valores);
    };

    $scope.getPie = function(widget, data){
      var colors     = ['#1abc9c', "#2ecc71", "#e74c3c", "#e67e22", "#f1c40f", "#3498db", "#9b59b6", "#34495e","#95a5a6", "#ecf0f1" ].reverse();
      var dataset    = [];
      var percentual = 0;
      var total      = 0;
      var title      = widget.customized ? widget.name : widget.indicator.name;
      var serie      = 'Quantidade';

      if(data.statement.rows.length > 0){
        var volumeTotal = 0;
        var produtos = (data.statement.rows).sort(function(a,b){
          if (a[1] > b[1])
            return -1;
          if (a[1] < b[1])
            return 1;
          return 0;
        });

        _.each(produtos, function(widget, index){
          volumeTotal+= widget[1];
        });

        for (var i = 0; i < 9; i++) {
          percentual = (produtos[i][1] * 100) / volumeTotal;
          dataset.push([ $.trim(produtos[i][0].toUpperCase()), percentual ]);
          total += percentual;
        };
        dataset.push([ "OUTROS", 100 - total ]);
      }


      $('[data-behaivor=widget][data-id=' + widget.id + '] .content').highcharts({
        colors : colors,
        chart: {
          type: 'pie',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        credits: {
          enabled: false
        },
        legend : false,
        plotOptions: {
          pie: {
            borderColor: '#FFF',
            innerSize: '60%',
            dataLabels: {
              enabled: false
            }
          }
        },
        title: {
          text: title,
          useHtml : true,
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        series: [{
          type: 'pie',
          name: serie,
          data: dataset
        }]
      },
      function(chart) {
        var xpos = '50%';
        var ypos = '53%';
        var circleradius = 102;

        chart.renderer.circle(xpos, ypos, circleradius).attr({
            fill: '#fff'
        }).add();
      });

    };

    $scope.setActiveDataSourceServer = function(){
      $scope.dataSourceServer = _.find($scope.dashboard.data_source_servers,function(el){
        return $scope.activeDataSourceServer === el.id;
      });
    };

    $scope.getHost = function(){
      var re  = new RegExp('https?://(.*:[0-9]{4})', 'i');
      var url = $scope.dataSourceServer.url;
      var x   = url.match(re);
      return x[1];
    };



    $scope.loadWidgets = function(){
      $scope.dashboard.widgets.forEach(function(widget, index){
        widget.loading = true;

        SourceService.get({ id : widget.indicator.source_id }, function(data){
          var Service = data.query.type === 'Query' ? QueryService : AggregationService;
          parameters = data.query.type === 'Query' ? data.query.parameters : data.aggregation.parameters;

          // Verifica todos os parâmetros de inicio e fim que sejam nulos e seta os valores do dash
          _.each(parameters,function(el, index) {
            if ( el.value === null && (el.name === 'inicio' || el.name === 'fim')){
              parameters[index].value = (el.name === 'inicio') ? $scope.indicadores.periodo.inicio : $scope.indicadores.periodo.fim;
            };
          });

          Service.save({ host : $scope.getHost() }, data, function(data){
            var type = widget.widget_type.name;

            switch(type){
              case 'status':
                $scope.getStatus(data.statement.rows[0][0], widget);
              break;
              case 'line':
                $scope.getGraph(widget, data);
              break;
              case 'pie':
                $scope.getPie(widget, data);
              break;
            };
            widget.loading = false;
          });
        });
      });

    };

    $scope.initDaterangepicker = function(){
      var i = document.createElement("input");
          i.setAttribute("type", "date");
      hasInputDate = i.type !== "text";

      format = hasInputDate ? 'YYYY-MM-DD' : 'DD/MM/YYYY';

      $('#reportrange').daterangepicker(
        {
          ranges: {
            'Hoje': [moment(), moment()],
            'Ontem': [moment().subtract(1,'days'), moment().subtract(1,'days')],
            'Últimos 7 Dias': [moment().subtract(6,'days'), moment()],
            'Últimos 30 Dias': [moment().subtract(29,'days'), moment()],
            'Últimos 90 Dias': [moment().subtract(89,'days'), moment()],
            'Este Mês': [moment().startOf('month'), moment().endOf('month')],
            'Último Mês': [moment().subtract(1,'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          },
          format : format,
          showDropdowns : true,
          minDate : moment({year : 2000, month: 0, day: 1}),
          maxDate : moment().add(1, 'month'),
          startDate: moment().subtract(29,'days'),
          endDate: moment(),
          locale: {
            applyLabel: 'Aplicar',
            cancelLabel: 'Limpar',
            fromLabel: 'De',
            toLabel: 'Para',
            customRangeLabel: 'Personalizado',
            daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex','Sab'],
            monthNames: ['Janeiro', 'Favereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          }
        },
        function(start, end, range) {
            var text;
            if (range !== undefined && range !== "Personalizado") {
              text = range;
            }else{
              var formato = "D [de] MMMM";
              if (start.format('YYYY') === end.format('YYYY')) {
                if (start.format('MMMM') === end.format('MMMM')) {
                  formato = 'D';
                };
              }else{
                formato = 'D [de] MMMM, YYYY';
              }
              text = start.format(formato) + '  até  ' + end.format('D [de] MMMM, YYYY');
            }

            $('[data-behaivor=show-actual-date]').html(text);

            $scope.indicadores.periodo.inicio = start.format("YYYY-MM-DD 00:00:00");
            $scope.indicadores.periodo.fim    = end.format("YYYY-MM-DD 00:00:00");


            $scope.loadWidgets();
        }
      );

      $('.daterangepicker').css('width', $('#reportrange').innerWidth() + 'px');

      if(hasInputDate){
        $('[name=daterangepicker_start]').attr('type','date');
        $('[name=daterangepicker_end]').attr('type','date');
      }
    };

    $scope.indicadores = {
      periodo : {
        inicio    : (moment().subtract(29,'days').format("YYYY-MM-DD 00:00:00")),
        fim       : (moment().format("YYYY-MM-DD 00:00:00")),
        duracao   : function(grandeza) {
          var grandeza  = grandeza || 'days';
          var fim       = moment($scope.indicadores.periodo.fim);
          var inicio    = moment($scope.indicadores.periodo.inicio);
          var diferenca = fim.diff(inicio,grandeza);
          return diferenca + 1;
        },
      },
    };

    $scope.initDaterangepicker();

  }
]);
