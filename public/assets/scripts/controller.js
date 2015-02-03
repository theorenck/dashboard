(function(){
  'use strict';

  angular.module('Atlas')
    .controller('AppController', AppController)

    .controller('DataSourceIndexController', DataSourceIndexController)
    .controller('DataSourceCreateController', DataSourceCreateController)

    .controller('DashboardIndexController', DashboardIndexController)
    .controller('DashboardCreateController', DashboardCreateController)

    .controller('IndicatorIndexController', IndicatorIndexController)
    .controller('IndicatorCreateController', IndicatorCreateController)

    .controller('WidgetIndexController', WidgetIndexController)
    .controller('WidgetCreateController', WidgetCreateController)

    .controller('UserIndexController', UserIndexController)
    .controller('UserCreateController', UserCreateController)

    .controller('PermissionIndexController', PermissionIndexController)
    .controller('PermissionCreateController', PermissionCreateController)

    .controller('ModalInstanceCtrl', ModalInstanceCtrl)
    .controller('ConsoleController', ConsoleController)

    .controller('OrigemIndexController', OrigemIndexController)
    .controller('QueryCreateController', QueryCreateController)
    .controller('AggregationCreateController', AggregationCreateController)

    .controller('DashboardsController', DashboardsController)
    .controller('DashboardDetailController', DashboardDetailController)
    .controller('DashboardFakeDetailController', DashboardFakeDetailController);


  AppController.$inject = ["$scope", '$location', "AuthService"];
  function AppController($scope, $location, AuthService){
    $scope.credentials = {};
    $scope.open = false;

    $scope.login = function(credentials){
      var authentication = {"authentication"  : credentials };

      AuthService.save(authentication, function(res){
        if (res.authentication && res.authentication.token) {
          var token = res.authentication.token;
          localStorage.setItem('token', token);
          localStorage.setItem('logged-in', true);
          $location.path('/dashboards');
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

  DataSourceIndexController.$inject = ['$scope', '$location', 'DataSourceService' ];
  function DataSourceIndexController($scope, $location, DataSourceService){
    $scope.serverList         = [];

    renderList();

    $scope.loadServer = function(id){
      $location.path('/data-source-server/update/' + id);
    }

    $scope.deleteServer = function(id, $index, $event){
      $event.preventDefault();
      DataSourceService.remove({ "id" : id }, function(){
        $scope.renderList();
      });
    }

    $scope.renderList = function(){
      return renderList();
    }

    function renderList(){
      DataSourceService.get(function(data){
        $scope.serverList = data.data_source_servers;
      });
    }

  }

  DataSourceCreateController.$inject = ['DataSourceService', '$scope', '$routeParams', '$location'];
  function DataSourceCreateController(DataSourceService, $scope, $routeParams, $location){
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

  DashboardIndexController.$inject = ['$scope', '$location', 'DashboardService'];
  function DashboardIndexController($scope, $location, DashboardService){
    $scope.dashboardList = [];

    renderList();

    function renderList(){
      DashboardService.get(function(data){
        $scope.dashboardList = data.dashboards;
      });
    }

    $scope.load = function(id){
      $location.path('/dashboard/update/' + id);
    }

    $scope.delete = function(id, $index, $event){
      $event.preventDefault();

      var data = { "id" : id };
      DashboardService.remove(data, function(data){
        $scope.renderList();
      });
    }

    $scope.renderList = function(){
      return renderList();
    }
  }

  DashboardCreateController.$inject = ['$scope', '$routeParams', '$location', 'DashboardService'];
  function DashboardCreateController($scope, $routeParams, $location, DashboardService){
    $scope.dashboard = {};

    $scope.salvar = function(){
      var data =  { "dashboard" : $scope.dashboard };

      if ($scope.dashboard.id) {
        DashboardService.update(data, function(){
          $location.path('/dashboard/');
        });
      }else{
        DashboardService.save(data, function(data){
          $location.path('/dashboard/');
        });
      }
    };

    $scope.cancelar = function(){
      $scope.dashboard = {};
    }

    if ($routeParams.id) {
      DashboardService.get({ id : $routeParams.id}, function(data){
        $scope.dashboard = data.dashboard;
      });
    };
  }

  IndicatorIndexController.$inject = ['$scope', '$location', 'IndicatorService'];
  function IndicatorIndexController($scope, $location, IndicatorService){
    $scope.indicatorList = [];

    $scope.renderList = function(){
      IndicatorService.get(function(data){
        $scope.indicatorList = data.indicators;
      });
    }

    $scope.load = function(id){
      $location.path('/indicator/update/' + id);
    };

    $scope.delete = function (id, $index, $event) {
      $event.preventDefault();
      var data = { "id" : id };
      IndicatorService.remove(data, function(data){
        $scope.renderList();
      });
    }

    $scope.renderList();
  }

  IndicatorCreateController.$inject = ['$scope', '$routeParams', '$location', 'IndicatorService', 'SourceService', 'UnityService'];
  function IndicatorCreateController($scope, $routeParams, $location, IndicatorService, SourceService, UnityService){
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
        IndicatorService.update(data, function(){
          $location.path('/indicator/')
        });
      }else{
        IndicatorService.save(data, function(data){
          $location.path('/indicator/')
        });
      }
    };

    if ($routeParams.id) {
      IndicatorService.get({ id : $routeParams.id}, function(data){
        $scope.indicator = data.indicator;
      });
    };
  }

  WidgetIndexController.$inject = ['$scope', '$location', 'WidgetService']
  function WidgetIndexController($scope, $location, WidgetService){
    $scope.widget     = {};
    $scope.widgetList = [];

    $scope.delete = function(id, $index, $event){
      $event.preventDefault();
      WidgetService.remove({ "id" : id },function(){
        $scope.renderList();
      });
    }

    $scope.load = function(id){
      $location.path('/widget/update/' + id);
    }

    $scope.renderList = function(){
      WidgetService.get(function(data){
        $scope.widgetList = data.widgets;
      });
    }

    $scope.renderList();
  }

  WidgetCreateController.$inject = ['$scope', '$routeParams', '$location', 'WidgetService', 'IndicatorService', 'DashboardService', 'WidgetTypeService'];
  function WidgetCreateController($scope, $routeParams, $location, WidgetService, IndicatorService, DashboardService, WidgetTypeService){
    $scope.widget     = {};
    $scope.widgetList = [];

    IndicatorService.get(function(data){
      $scope.availableIndicators = data.indicators;
    });

    DashboardService.get(function(data){
      $scope.availableDashboards = data.dashboards;
    });

    WidgetTypeService.get(function(data){
      $scope.availableWidgetTypes = data.widget_types;
    });

    if ($routeParams.id) {
      WidgetService.get({ id : $routeParams.id }, function(data){
        $scope.widget = data.widget;
      });
    };

    $scope.salvar = function(){
      var data =  { "widget" : $scope.widget };
      data.widget.indicator_id   = $scope.widget.indicator.id;
      data.widget.widget_type_id = $scope.widget.widget_type.id;

      if ($scope.widget.id) {
        WidgetService.update(data, function(){
          $location.path('/widget/');
        });
      }else{
        WidgetService.save(data, function(){
          $location.path('/widget/');
        });
      }
    };
  }

  UserIndexController.$inject = ['$scope', '$location', 'UserService'];
  function UserIndexController($scope, $location, UserService){
    $scope.userList = [];

    $scope.renderList = function(){
      UserService.get(function(data){
        $scope.userList = data.users;
      });
    }

    $scope.load = function(id){
      $location.path('user/update/' + id);
    };

    $scope.delete = function (id, $index, $event) {
      $event.preventDefault();
      var data = { "id" : id };
      UserService.remove(data, function(data){
        $scope.renderList();
      });
    }


    $scope.renderList();
  }

  UserCreateController.$inject = ['$scope', '$routeParams', '$location', 'UserService'];
  function UserCreateController($scope, $routeParams, $location, UserService){
    $scope.user     = {};

    $scope.cancelar = function(){
      $scope.user = {};
    };

    $scope.salvar = function(){
      var data =  { "user" : $scope.user };

      if ($scope.user.id) {
        UserService.update(data, function(){
          $location.path('/user/');
        });
      }else{
        UserService.save(data, function(){
          $location.path('/user/');
        });
      }
    };

    if ($routeParams.id) {
      UserService.get({id : $routeParams.id}, function(data){
        $scope.user = data.user;
      });
    }
  }

  PermissionIndexController.$inject = ['$scope', '$location', 'PermissionService'];
  function PermissionIndexController($scope, $location, PermissionService){
    $scope.permissionList = [];

    $scope.renderList = function(){
      PermissionService.get(function(data){
        $scope.permissionList = data.permissions;
      });
    }

    $scope.load = function(id){
      $location.path('permission/update/' + id);
    };

    $scope.delete = function (id, $index, $event) {
      $event.preventDefault();
      var data = { "id" : id };
      PermissionService.remove(data, function(data){
        $scope.renderList();
      });
    }

    $scope.renderList();
  }

  PermissionCreateController.$inject = ['$scope', '$routeParams', '$location', 'PermissionService', 'UserService', 'DataSourceService', 'DashboardService'];
  function PermissionCreateController($scope, $routeParams, $location, PermissionService, UserService, DataSourceService, DashboardService){
    $scope.permission     = {};
    $scope.availableUsers = [];
    $scope.availableDataSourceService = [];
    $scope.availableDashboards = [];

    UserService.get(function(data){
      $scope.availableUsers = data.users;
    });

    DataSourceService.get(function(data){
      $scope.availableDataSourceService = data.data_source_servers;
    });

    DashboardService.get(function(data){
      $scope.availableDashboards = data.dashboards;
    });

    $scope.salvar = function(){
      var data =  { "permission" : $scope.permission };

      if ($scope.permission.id) {
        PermissionService.update(data, function(){
          $location.path('/permission/');
        });
      }else{
        PermissionService.save(data, function(){
          $location.path('/permission/');
        });
      }
    };

    if($routeParams.id){
      PermissionService.get({ id : $routeParams.id }, function (data) {
        $scope.permission = data.permission;
      });
    }
  }

  function ModalInstanceCtrl($scope, $modalInstance, items) {
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  ConsoleController.$inject = ['$scope', 'StatementService', 'SchemaService', 'HistoryService', 'DataSourceService', 'zCodeMirror', '$modal'];
  function ConsoleController($scope, StatementService, SchemaService, HistoryService, DataSourceService, zCodeMirror, $modal){
    var allData = [];
    $scope.showAdvancedOptions   = true;
    $scope.showResults           = false;
    $scope.data_types            = ["varchar", "decimal", "integer", "date", "time", "timestamp"];
    $scope.isExecuting           = false;
    $scope.hasLimit              = true;
    $scope.results               = [];
    $scope.currentPage           = 1;
    $scope.alert                 = {};
    $scope.historyItems          = [];
    $scope.editorOptions         = zCodeMirror.initialize($scope);
    $scope.listDataSourceService = [];
    $scope.resultset = {
      "records": 0,
      "fetched": 0,
      "columns": [],
      "rows": []
    };

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };

    DataSourceService.get(function(data){
      $scope.listDataSourceService   = data.data_source_servers;
      $scope.activeDataSourceService = data.data_source_servers[0].id;
    });

    function getActiveDataSourceServer(){
      var el =  _.find($scope.listDataSourceService, function(el){
        return $scope.activeDataSourceService === el.id;
      });

      return el.url;
    };

    function getStatementType(sql){
      return sql.match(/^\s*(SELECT|DELETE|UPDATE|INSERT|DROP|CREATE)\b/i)[1].toUpperCase() || '';
    }

    function resetAlert(){
      $scope.alert = {
        'type' : 'info',
        'messages' : [],
      };
    }

    function criaPaginacao(totalCols){
      var MAX_ITENS_PAGE = 5000;
      var rowsPerPage    = Math.floor(MAX_ITENS_PAGE / totalCols);

      return rowsPerPage;
    }

    $scope.codemirrorLoaded = function(_editor){
      var _doc = _editor.getDoc();
      _editor.focus();
      _doc.markClean();
      zCodeMirror.setHints(_editor);

      if (!localStorage.getItem("tables")){
        SchemaService.get(function(data){
          localStorage.setItem("tables", JSON.stringify(data.schema.tables));
          zCodeMirror.setHints(_editor, data.schema.tables);
        });
      };
    };

    $scope.validateParams = function(){
      var i;
      for(i = 0; i < $scope.statement.parameters.length; i++){
        var param = $scope.statement.parameters[i];
        if( param.name.trim() === '' || param.value.trim() === ''){
          $scope.statement.parameters.splice(i,1);
          i--;
        }
      }
    }

    $scope.resetStatement = function(){
      $scope.statement = {
        parameters : [],
        sql : 'SELECT p.codproduto, p.codbarras, p.descricao1 FROM zw14ppro p WHERE p.situacao = \'N\' LIMIT 1000'
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
      Configuration.statement_server = getActiveDataSourceServer();
      resetAlert();

      if ($scope.isExecuting)
        return;

      $scope.validateParams();
      $scope.isExecuting   = true;

      // se houver paginação
      if (currentPage) {
        var rowsPerPage = criaPaginacao($scope.result.columns.length);
        var data = [];
        var i = 0;
        var finalIndex = rowsPerPage * ($scope.currentPage + 1);

        while(i < finalIndex && i < allData.length){
          data[i] = allData[i];
          i++;
        }

        $scope.result.rows = data;
        $scope.isExecuting  = false;
        $scope.currentPage++;

        return;
      };

      var data   = {"statement" : $scope.statement};
      var server = Configuration.statement_server;
      StatementService.execute(data, server)
        .success(function(data){
          $scope.saveHistory();
          $scope.isExecuting = false;
          $scope.showResults = true;

          if (data.result) {
            var rowsPerPage = criaPaginacao(data.result.columns.length);
            allData = data.result.rows;

            $scope.result = {
              "records": allData.length,
              "columns": data.result.columns,
              "rows": allData.slice(0, rowsPerPage)
            }
          }


          switch(getStatementType($scope.statement.sql)){
            case 'SELECT':
              $scope.alert = {
                type : "success",
                messages : [data.result.fetched + ' registro(s) encontrado(s)']
              }
            break;

            case 'UPDATE':
            case 'DELETE':
            case 'INSERT':
              $scope.alert = {
                type : "success",
                messages : [data.result.records + ' registro(s) afetados(s)']
              }
              $scope.showResults = false;
            break;

            case 'CREATE':
            case 'DROP':
              $scope.alert = {
                type : "success",
                messages : ['Sucesso na operação']
              }
              $scope.showResults = false;
            break;
          }
        })
        .error(function(err){
          $scope.isExecuting = false;
          var errors;
          if (err.status === 500)
            errors = [err.statusText];
          else if(err.status === 0)
            errors = ["Servidor indisponível"];
          else
            errors = err.data.errors.base || err.data.errors.sql;

          $scope.alert = {
            type : "danger",
            messages : errors
          }
        });

    };

    $scope.saveHistory = function(){
      HistoryService.post($scope.statement, function(){
        $scope.renderHistory();
      });
    },

    $scope.loadHistoryItem = function(row){
      $scope.statement = row.statement;
    }

    $scope.renderHistory = function(){
      HistoryService.get(function(data){
        $scope.historyItems = data;
        if(!$scope.$$phase) {
          $scope.$digest($scope);
        }
      });
    }

    $scope.delete = function(id){
      HistoryService.delete(id, function(data){
        $scope.historyItems = data;
      });
    }

    $scope.clearHistory = function(){
      HistoryService.clear(function(){
        $scope.renderHistory()
      });
    }

    $scope.getStyleType = function(type){
      type = type.toUpperCase();
      switch(type){
        case "SELECT":
          return 'label-info';
        case "UPDATE":
          return 'label-warning';
        case "INSERT":
          return 'label-success';
        case "DELETE":
          return 'label-danger';
        case "DROP":
        case "CREATE":
          return 'label-default';
      }
    },

    $scope.resetStatement();
    $scope.renderHistory();
  }

  DashboardsController.$inject = ['$scope', '$location', 'DashboardService'];
  function DashboardsController($scope, $location, DashboardService){
    $scope.dashboards = [];

    DashboardService.get(function(data){
      $scope.dashboards = data.dashboards;
    });


    $scope.loadDash = function(id){
      $location.path('/dashboards/' + id);
    };
  }

  OrigemIndexController.$inject = ['$scope', '$location', 'SourceService'];
  function OrigemIndexController($scope, $location, SourceService){
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

  QueryCreateController.$inject = ['$scope', '$routeParams', '$location', 'SourceService'];
  function QueryCreateController($scope, $routeParams, $location, SourceService){

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
      for(var i = 0; i < $scope.statement.parameters.length; i++){
        var param = $scope.statement.parameters[i];
        if( param.name.trim() === '' ){
          $scope.statement.parameters.splice(i,1);
          i--;
        }
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

  AggregationCreateController.$inject = ['$scope', '$routeParams', '$location', 'SourceService', 'FunctionService'];
  function AggregationCreateController($scope, $routeParams, $location, SourceService, FunctionService){
    $scope.data_types     = ["varchar", "decimal", "integer", "date", "time", "timestamp"];

    SourceService.get(function(data){
      $scope.sourceList = data.sources.filter(function(index, elem) {
        if(index.type === 'Query') return index;
      });
    });

    FunctionService.get(function(data){
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

  DashboardDetailController.$inject = ['$scope', '$routeParams', '$interval', 'DashboardService', 'SourceService', 'QueryService', 'AggregationService'];
  function DashboardDetailController($scope, $routeParams, $interval,  DashboardService, SourceService, QueryService, AggregationService){
    $scope.dashboard        = {};
    $scope.sourceList       = [];
    $scope.dataSourceServer = {};
    $scope.activeDataSourceServer;

    DashboardService.get({ id : $routeParams.id }, function(data){
      $scope.dashboard        = data.dashboard;
      $scope.dataSourceServer = data.dashboard.data_source_servers[0];

      if ($scope.dataSourceServer) {
        $scope.activeDataSourceServer = $scope.dataSourceServer.id;
        $scope.loadWidgets();
      };

    });

    // $interval(function(){
    //   $scope.loadWidgets();
    // }, Configuration.time_to_refresh);

    $scope.getStatus = function(result, widget){
      widget.full_result = result;
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

    /**
     * Prapara o dataset para o gráfico de linha.
     * Percorre desde a data inicial até a final criando valores em branco para preencher os dias sem registros
     * Prepara os plots de fins de semana e as labels do gráfico
     *
     * @param array rows    Result do webservice
     * @return Object       Valores formatados
     */
    $scope.prepareDataset = function(rows){
      var dataSet   = [];
      var dataAtual = moment($scope.indicadores.periodo.inicio).format("YYYY-MM-DD");
      var dataFinal = moment($scope.indicadores.periodo.fim).format("YYYY-MM-DD");

      var valores   = {
        values    : [],
        labels    : [],
        plotBands : []
      };

      /**
       * Procura nas linhas se existe valor para todos os dias,
       * se não existir insere a data e valor zero no array das linhas
       */
      while(dataAtual <= dataFinal){
        var row = _.find(rows, function(el) {
          return (el[0] === dataAtual);
        });

        if(row === undefined)
          row = [dataAtual,0,0,0,0];

        dataSet.push(row);

        var weekDay   = moment(dataAtual).format('dd');
        var timestamp = parseInt(moment(row[0]).format('x'));

        valores.values.push([ timestamp, row[1] ]);

        if (weekDay === 'sáb') {
          valores.plotBands.push({
            from: moment(row[0]).format('x'),
            to: moment(row[0]).add(1,'day').format('x'),
            color: 'rgba(192, 192, 192, .2)'
          });
        }

        dataAtual = moment(dataAtual).add(1, 'day').format("YYYY-MM-DD");
      }

      valores.values = (valores.values).sort(function(a, b) {
        return a[0] - b[0];
      });

      return valores;
    },

    $scope.getGraph = function(widget, data){
      var valores = $scope.prepareDataset(data.result.rows);
      var title   = widget.customized ? widget.name : widget.indicator.name;
      var hasZoom = false;
      var chart;

      try{
        $('[data-behaivor="widget"][data-id=' + widget.id + '] .content').highcharts().destroy();
        $(document).off('click', '[data-resetbutton]');
      }catch(err){
        console.log(err.message);
      }

      function grafico(valores) {
        return chart = new Highcharts.StockChart({
            colors : [ Configuration.colors[widget.color] ],
            title : {
              text : "<h3>" + title + "</h3>",
              useHtml : true,
              style : {
                fontFamily : "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize : '19px'
              }
            },
            scrollbar: {
              enabled: false
            },
            chart : {
              renderTo : $('[data-behaivor="widget"][data-id=' + widget.id + '] .content')[0],
              zoomType : 'x',
              panning: true,
              panKey: 'shift',
              events : {
                selection: function (event) {
                  $('[data-resetbutton]').css('display', event.xAxis ? 'block' : 'none' );
                },

                load : function(){
                  var buttons = this.rangeSelector.buttons;

                  buttons.forEach(function(e, i){

                    $(e.element).click(function(event){
                      if (e.state && e.state !== 3) {
                        $('[data-resetbutton]').css('display', 'block');
                      }
                    });

                    if (e.state && e.state === 3) {
                      var t = e.element.childNodes[1];
                      var s = 'font-weight:normal;color:#FFF;fill:#FFF;';
                      t.setAttribute('style', s)
                      e.attr({opacity:0.65});
                    }
                  });
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
                  fill : "#3498DB",
                  width: 90,
                  r : 0,
                  style : {
                    background: '#3498DB',
                    color : "#FFF",
                  },
                  states: {
                    hover : {
                      fill : "#217DBB",
                      background: "#217DBB",
                      style: {
                        color: 'white'
                      }
                    },
                    select: {
                      fill: '#217DBB',
                      style: {
                        color: 'white',
                        fontWeight: 'normal'
                      }
                    }
                  }
                },

                labelStyle: {
                  display: 'none'
                },

                inputEnabled : false,
                // selected : 1,
                buttons: [
                {
                  type: 'month',
                  count: 1,
                  text: '1 mês'
                },
                {
                  type: 'month',
                  count: 3,
                  text: '3 meses'
                },
                {
                  type: 'month',
                  count: 6,
                  text: '6 meses'
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

      chart = grafico(valores);
      $(document).on('click', '[data-resetbutton]', function(){
        chart.zoomOut();
      });
    };

    $scope.getPie = function(widget, data){
      var colors         = ['#1abc9c', "#2ecc71", "#e74c3c", "#e67e22", "#f1c40f", "#3498db", "#9b59b6", "#34495e","#95a5a6", "#ecf0f1" ].reverse();
      var dataset        = [];
      var percentual     = 0;
      var total          = 0;
      var title          = widget.customized ? widget.name : widget.indicator.name;
      var serie          = 'Quantidade';
      var enabledTooltip = true;
      widget.hasData     = true;

      if(data.result.rows.length > 0){
        var volumeTotal = 0;
        var produtos    = (data.result.rows).sort(function(a,b){
          if (a[1] > b[1])
            return -1;
          if (a[1] < b[1])
            return 1;
          return 0;
        });

        var produtosLength = produtos.length >= 9 ? 9 : produtos.length;

        _.each(produtos, function(widget, index){
          volumeTotal+= widget[1];
        });

        for (var i = 0; i < produtosLength; i++) {
          percentual = (produtos[i][1] * 100) / volumeTotal;
          dataset.push([ $.trim(produtos[i][0].toUpperCase()), percentual ]);
          total += percentual;
        };
        dataset.push([ "OUTROS", 100 - total ]);
      }else{
        widget.hasData = false;
        dataset.push([ "", 100 ]);
        // dataset.push([ "", 75 ]);
        enabledTooltip = false;
      }



      $('[data-behaivor=widget][data-id=' + widget.id + '] .content').highcharts({
        colors : colors,
        chart: {
          type: 'pie',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
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
            },
            states: {
              hover: {
                enabled: enabledTooltip
              }
            }
          }
        },
        title: {
          text: title,
          useHtml : true,
        },
        tooltip: {
          enabled : enabledTooltip,
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
      var widgetsLoaded = 0;
      $scope.isLoadingWidgets = true;
      $scope.dashboard.widgets.forEach(function(widget, index){
        widget.loading = true;

        SourceService.get({ id : widget.indicator.source_id }, function(data){
          var Service = data.query.type === 'Query' ? QueryService : AggregationService;
          parameters  = data.query.type === 'Query' ? data.query.parameters : data.aggregation.parameters;

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
                $scope.getStatus(data.result.rows[0][0], widget);
              break;
              case 'line':
                $scope.getGraph(widget, data);
              break;
              case 'pie':
                $scope.getPie(widget, data);
              break;
            };
            widget.loading = false;
            widgetsLoaded++;
            $scope.isLoadingWidgets = $scope.dashboard.widgets.length == widgetsLoaded ? false : true;
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
          var fim       = moment($scope.indicadores.periodo.fim);
          var inicio    = moment($scope.indicadores.periodo.inicio);
          var diferenca = fim.diff(inicio,grandeza);
          return diferenca + 1;
        },
      },
    };
  }

  DashboardFakeDetailController.$inject = ['$scope', '$routeParams', '$window', 'DashboardService', 'SourceService', 'QueryService', 'AggregationService'];
  function DashboardFakeDetailController($scope, $routeParams, $window, DashboardService, SourceService, QueryService, AggregationService){
    data = {"id":1, "name":"Painel de Mecânica", "description":"Painel de Mecânica", "data_source_servers":[{"id":1, "url":"http://localhost:3000/api", "name":"localhost", "description":"localhost", "alive":true } ], "widgets":[{"id":9, "customized":false, "name":"Faturamento", "description":"Faturamento", "color":"green", "position":0, "size":3, "dashboard_id":1, "indicator":{"id":9, "name":"Faturamento", "description":"faturamento", "code":"faturamento", "unity_id":1, "source_id":3, "unity":{"id":1, "name":"Moeda", "symbol":"R$"} }, "widget_type":{"id":2, "name":"status"} }, {"id":6, "customized":false, "name":"Ticket Médio Peças", "description":"Ticket Médio Peças", "color":"orange", "position":3, "size":3, "dashboard_id":1, "indicator":{"id":6, "name":"Ticket Médio Peças", "description":"ticket_medio_pecas", "code":"ticket_medio_pecas", "unity_id":1, "source_id":3, "unity":{"id":1, "name":"Moeda", "symbol":"R$"} }, "widget_type":{"id":2, "name":"status"} }, {"id":7, "customized":false, "name":"Ticket Médio MO", "description":"Ticket Médio MO", "color":"blue", "position":3, "size":3, "dashboard_id":1, "indicator":{"id":7, "name":"Ticket Médio PO", "description":"ticket_medio_mao_de_obra", "code":"ticket_medio_mao_de_obra", "unity_id":1, "source_id":3, "unity":{"id":1, "name":"Moeda", "symbol":"R$"} }, "widget_type":{"id":2, "name":"status"} }, {"id":8, "customized":false, "name":"Inadimplência", "description":"Inadimplência", "color":"red", "position":3, "size":3, "dashboard_id":1, "indicator":{"id":8, "name":"Inadimplência", "description":"inadimplencia", "code":"inadimplencia", "unity_id":1, "source_id":3, "unity":{"id":1, "name":"Moeda", "symbol":"%"} }, "widget_type":{"id":2, "name":"status"} }, {"id":1, "customized":false, "name":"Rentabilidade Peças", "description":"Rentabilidade Peças", "color":"purple", "position":0, "size":3, "dashboard_id":1, "indicator":{"id":1, "name":"Rentabilidade Peças", "description":"rent_pecas", "code":"rent_pecas", "unity_id":1, "source_id":3, "unity":{"id":1, "name":"Moeda", "symbol":"%"} }, "widget_type":{"id":2, "name":"status"} }, {"id":2, "customized":false, "name":"Rentabilidade MO", "description":"Rentabilidade MO", "color":"purple", "position":1, "size":3, "dashboard_id":1, "indicator":{"id":2, "name":"Rentabilidade MO", "description":"rent_mo", "code":"rent_mo", "unity_id":1, "source_id":3, "unity":{"id":1, "name":"Moeda", "symbol":"%"} }, "widget_type":{"id":2, "name":"status"} }, {"id":3, "customized":false, "name":"Rentabilidade Terceiros", "description":"Rentabilidade Terceiros", "color":"purple", "position":2, "size":3, "dashboard_id":1, "indicator":{"id":3, "name":"Rentabilidade Terceiros", "description":"rent_terceiros", "code":"rent_terceiros", "unity_id":1, "source_id":3, "unity":{"id":1, "name":"Moeda", "symbol":"%"} }, "widget_type":{"id":2, "name":"status"} }, {"id":4, "customized":false, "name":"Rentabilidade MC", "description":"Rentabilidade MC", "color":"purple", "position":3, "size":3, "dashboard_id":1, "indicator":{"id":4, "name":"Rentabilidade MC", "description":"rent_mc", "code":"rent_mc", "unity_id":1, "source_id":3, "unity":{"id":1, "name":"Moeda", "symbol":"%"} }, "widget_type":{"id":2, "name":"status"} }, {"id":5, "customized":false, "name":"Novas OS por dia", "description":"Novas OS por dia", "color":"blue", "position":3, "size":12, "dashboard_id":1, "indicator":{"id":5, "name":"Novas OS por dia", "description":"novas_os_dia", "code":"novas_os_dia", "unity_id":1, "source_id":3, "unity":{"id":1, "name":"Moeda", "symbol":"%"} }, "widget_type":{"id":2, "name":"line"} }, ] };
    $scope.dashboard              = {};
    $scope.sourceList             = [];
    $scope.dataSourceServer       = {};
    $scope.activeDataSourceServer = {};
    $scope.dashboard              = data;
    $scope.dataSourceServer       = data.data_source_servers[0];
    $scope.activeDataSourceServer = $scope.dataSourceServer.id;

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
        values    : [],
        labels    : [],
        plotBands : []
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
      var valores = $scope.prepareDataset(data.result.rows);
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

      window.setTimeout(function(){
        grafico(valores);
      }, 500);
    };

    $scope.getPie = function(widget, data){
      var colors     = ['#1abc9c', "#2ecc71", "#e74c3c", "#e67e22", "#f1c40f", "#3498db", "#9b59b6", "#34495e","#95a5a6", "#ecf0f1" ].reverse();
      var dataset    = [];
      var percentual = 0;
      var total      = 0;
      var title      = widget.customized ? widget.name : widget.indicator.name;
      var serie      = 'Quantidade';

      if(data.result.rows.length > 0){
        var volumeTotal = 0;
        var produtos = (data.result.rows).sort(function(a,b){
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

      widgets = {
        "rent_pecas"     : {"statement":{"records":1,"fetched":1,"columns":[{"name":"faturamento_tipo_item_peca","type":3}],"rows":[["0.3714"]]}},
        "rent_mo"        : {"statement":{"records":1,"fetched":1,"columns":[{"name":"faturamento_tipo_item_servico","type":3}],"rows":[["1.1396"]]}},
        "rent_mc"        : {"statement":{"records":1,"fetched":1,"columns":[{"name":"faturamento_tipo_item_servico","type":3}],"rows":[["0.2845"]]}},
        "rent_terceiros" : {"statement":{"records":1,"fetched":1,"columns":[{"name":"faturamento_tipo_item_servico","type":3}],"rows":[["0.2634"]]}},

        "inadimplencia"  : {"statement":{"records":1,"fetched":1,"columns":[{"name":"faturamento_tipo_item_servico","type":3}],"rows":[["1.987"]]}},
        "faturamento"    : {"statement":{"records":1,"fetched":1,"columns":[{"name":"faturamento","type":3}],"rows":[["103546.5514"]]}},
        "novas_os_dia"   : {"statement": {"records":19, "fetched":19, "columns":[{"name":"data_emissao","type":91}, {"name":"quantidade","type":4} ], "rows":[["2014-12-01", 17], ["2014-12-02", 20], ["2014-12-03", 9], ["2014-12-04", 9], ["2014-12-05", 5], ["2014-12-08", 17], ["2014-12-09", 11], ["2014-12-10", 6], ["2014-12-11", 8], ["2014-12-12", 3], ["2014-12-15", 15], ["2014-12-16", 12], ["2014-12-17", 14], ["2014-12-18", 9], ["2014-12-19", 5], ["2014-12-22", 9], ["2014-12-23", 12], ["2014-12-24", 4], ["2014-12-29", 1] ] } },
        "ticket_medio_pecas" : {"statement":{"records":1,"fetched":1,"columns":[{"name":"faturamento_tipo_item_peca","type":3}],"rows":[["1348.4246"]]}},
        "ticket_medio_mao_de_obra" : {"statement":{"records":1,"fetched":1,"columns":[{"name":"faturamento_tipo_item_servico","type":3}],"rows":[["1076.4129"]]}},
      };

      $scope.isLoadingWidgets = true;
      $scope.dashboard.widgets.forEach(function(widget, index) {
        $scope.dashboard.widgets[index].loading = true;


        var type       = widget.widget_type.name;
        data           = widgets[widget.indicator.code];

        switch(type){
          case 'status':
            $scope.getStatus(data.result.rows[0][0], widget);
          break;
          case 'line':
            $scope.getGraph(widget, data);
          break;
          case 'pie':
            $scope.getPie(widget, data);
          break;
        };


        $scope.dashboard.widgets[index].loading = false;
      });
      $scope.isLoadingWidgets = false;
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
        inicio    : (moment({ month : 11, day: 1, year: 2014}).format("YYYY-MM-DD 00:00:00")),
        fim       : (moment({ month : 11, day: 31, year: 2014}).format("YYYY-MM-DD 00:00:00")),
        duracao   : function(grandeza) {
          var grandeza  = grandeza || 'days';
          var fim       = moment($scope.indicadores.periodo.fim);
          var inicio    = moment($scope.indicadores.periodo.inicio);
          var diferenca = fim.diff(inicio,grandeza);
          return diferenca + 1;
        },
      },
    };

    $scope.loadWidgets();

    $scope.initDaterangepicker();
  }

})();