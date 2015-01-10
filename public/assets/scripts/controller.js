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
      $location.path('/data-source-server/create/' + id);
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

  function(DataSourceService, $scope, $routeParams){
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
          $scope.data_source_server = {};
        });
      }else{
        DataSourceService.save(data, function(){
          $scope.data_source_server = {};
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
      $location.path('/dashboard/create/' + id);
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

  function($scope, Dashboards, $routeParams){
    $scope.dashboard = {};

    $scope.salvar = function(){
      var data =  { "dashboard" : $scope.dashboard };

      if ($scope.dashboard.id) {
        Dashboards.update(data, function(){
          $scope.dashboard = {};
        });
      }else{
        Dashboards.save(data, function(data){
          $scope.dashboard = {};
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
      $location.path('indicator/create/' + id);
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

  function($scope, $routeParams, IndicatorsService, SourceService, UnityService){
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
          // $scope.indicator = {};
        });
      }else{
        IndicatorsService.save(data, function(data){
          // $scope.indicator = {};
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
      $location.path('/widget/create/' + id);
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

  function($scope, Widgets, IndicatorsService, Dashboards, WidgetTypes, $routeParams){
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
          $scope.cancelar();
        });
      }else{
        Widgets.save(data, function(){
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

    $scope.cancelar = function(){
      $scope.widget = {};
    };

  }
]);


/**
 * USERS CONTROLLER
 */
Atlas.controller('UserIndexController', [
  '$scope',
  'Users',

  function($scope, Users){
    $scope.userList = [];

    $scope.renderList = function(){
      Users.get(function(data){
        $scope.userList = data.users;
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

  function($scope, Users, $routeParams){
    $scope.user     = {};

    $scope.cancelar = function(){
      $scope.user = {};
    };

    $scope.salvar = function(){
      var data =  { "user" : $scope.user };

      if ($scope.user.id) {
        Users.update(data, function(){
          $scope.cancelar();
        });
      }else{
        Users.save(data, function(){
          $scope.cancelar();
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

  function($scope, Permissions){
    $scope.permissionList = [];

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

  function($scope, Permissions, Users, DataSourceService, Dashboards, $routeParams){
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

        });
      }else{
        Permissions.save(data, function(){

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

  function($scope, Dashboards, SourceService, $routeParams){

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
        });
      }else{
        SourceService.save(data, function(data){
        });
      }

    };

    $scope.validateParams = function(){
      for(var i = 0; i < $scope.statement.parameters.length; i++){
        var param = $scope.statement.parameters[i];
        if( param.name.trim() === '' || param.value.trim() === '')
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

  function($scope, Dashboards, SourceService, $routeParams, FunctionsService){
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
        });
      }else{
        SourceService.save(data, function(data){
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
  '$http',
  'Dashboards',
  'SourceService',

  function($scope, $routeParams, $http, Dashboards, SourceService){
    $scope.dashboard  = {};
    $scope.sourceList = [];

    Dashboards.get({ id : $routeParams.id }, function(data){
      console.log('DASHBOARD');
      console.log(data.dashboard);
      console.log('/ DASHBOARD');
      $scope.dashboard = data.dashboard;
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
      console.log(widget);
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

    $scope.loadWidgets = function(){

      $scope.dashboard.widgets.forEach(function(widget, index){
        widget.loading = true;
        // console.log(widget);


        SourceService.get({ id : widget.indicator.source_id }, function(data){
          var query = data.query;
          $scope.sourceList.push(data.query);

          $http
            .post("http://localhost:3000/api/queries", data )
            .success(function(data, status, headers, config) {
              var type = widget.widget_type.name;
              if (type==="status") {
                $scope.getStatus(data.statement.rows[0][0], widget);
              }else if(type==='line'){
                $scope.getGraph(widget, data);
              }


              widget.loading = false;
          });
        });
      });

    };




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
    };

  }
]);
