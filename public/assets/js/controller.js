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
    .controller('DashboardDetailController', DashboardDetailController);


  AppController.$inject = ['$http','$scope', '$rootScope', '$location', 'AuthService', 'zErrors'];
  function AppController($http, $scope, $rootScope, $location, AuthService, zErrors){
    $scope.credentials = { username : '', password : ''};
    $scope.open = false;
    $scope.showResponsiveMenu = true;


    // Esconde o menu quando troca de página
    $rootScope.$on('$routeChangeSuccess', function (e, data) {
      $scope.showResponsiveMenu = true;
    });

    $scope.toggleResponsiveMenu = function(){
      $scope.showResponsiveMenu = !$scope.showResponsiveMenu;
    };

    function errorHandler(err){
      $scope.alert = {
        type : 'danger',
        messages : zErrors.handling(err)
      };
    }

    function validateParams(credentials){
      return credentials.username.trim() !== '' && credentials.password.trim() !== '';
    }

    $scope.login = function(credentials){
      var authentication = {'authentication'  : credentials };

      if (validateParams(credentials)) {
        AuthService.save(authentication, function(res){
          if (res.authentication && res.authentication.token) {
            var token = res.authentication.token;
            var admin = res.authentication.admin;

            localStorage.setItem('token', token);
            localStorage.setItem('logged-in', true);
            localStorage.setItem('logged-in-admin', admin);

            $location.path('/dashboards');
          }
          else {
            localStorage.setItem('logged-in', false);
          }
        }, errorHandler);
      }else{
        $scope.alert = {
          type : 'warning',
          messages : ['Desculpe, mas usuário e senha devem ser preenchidos']
        };
      }
    };

    $scope.logout = function(){
      localStorage.removeItem('token');
      localStorage.removeItem('logged-in');
    };

    $scope.isAdmin = function(){
      return !!localStorage.getItem('logged-in-admin') && localStorage.getItem('logged-in-admin') === true && !!localStorage.getItem('token') || false;
    };

    $scope.isLoggedIn = function(){
      return !!localStorage.getItem('logged-in') && !!localStorage.getItem('token') || false;
    };

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
    };

    $scope.deleteServer = function(id, $index, $event){
      $event.preventDefault();
      DataSourceService.remove({ 'id' : id }, function(){
        $scope.renderList();
      });
    };

    $scope.renderList = function(){
      return renderList();
    };

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
    };

    $scope.saveApiServer = function(){
      var data =  {
        'data_source_server' : $scope.data_source_server
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
    }
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
    };

    $scope.delete = function(id, $index, $event){
      $event.preventDefault();

      var data = { 'id' : id };
      DashboardService.remove(data, function(data){
        $scope.renderList();
      });
    };

    $scope.renderList = function(){
      return renderList();
    };
  }

  DashboardCreateController.$inject = ['$scope', '$routeParams', '$location', 'DashboardService'];
  function DashboardCreateController($scope, $routeParams, $location, DashboardService){
    $scope.dashboard = {};

    $scope.salvar = function(){
      var data =  { 'dashboard' : $scope.dashboard };

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
    };

    if ($routeParams.id) {
      DashboardService.get({ id : $routeParams.id}, function(data){
        $scope.dashboard = data.dashboard;
      });
    }
  }

  IndicatorIndexController.$inject = ['$scope', '$location', 'IndicatorService'];
  function IndicatorIndexController($scope, $location, IndicatorService){
    $scope.indicatorList = [];

    $scope.renderList = function(){
      IndicatorService.get(function(data){
        $scope.indicatorList = data.indicators;
      });
    };

    $scope.load = function(id){
      $location.path('/indicator/update/' + id);
    };

    $scope.delete = function (id, $index, $event) {
      $event.preventDefault();
      var data = { 'id' : id };
      IndicatorService.remove(data, function(data){
        $scope.renderList();
      });
    };

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
      var data =  { 'indicator' : $scope.indicator };


      if ($scope.indicator.id) {
        IndicatorService.update(data, function(){
          $location.path('/indicator/');
        });
      }else{
        IndicatorService.save(data, function(data){
          $location.path('/indicator/');
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

  function ModalInstanceCtrl($scope, $modalInstance) {
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  ConsoleController.$inject = ['$scope', '$location', '$anchorScroll', 'SourceService', 'StatementService', 'SchemaService', 'HistoryService', 'DataSourceService', 'zCodeMirror', '$modal', 'zErrors'];
  function ConsoleController($scope, $location, $anchorScroll, SourceService, StatementService, SchemaService, HistoryService, DataSourceService, zCodeMirror, $modal, zErrors){

    $scope.allData = [];
    $scope.isOptionsOpened       = true;
    $scope.showParams            = true;
    $scope.showResults           = false;
    $scope.showExport            = false;
    $scope.data_types            = ['varchar', 'decimal', 'integer', 'date', 'time', 'timestamp'];
    $scope.isExecuting           = false;
    $scope.hasLimit              = true;
    $scope.results               = [];
    $scope.currentPage           = 1;
    $scope.alert                 = {};
    $scope.historyItems          = [];
    $scope.editorOptions         = zCodeMirror.initialize($scope);
    $scope.listDataSourceService = [];
    $scope.DataSource = { activeDataSourceService : ''};
    $scope.activeDataSourceService = null;
    $scope.collections = {
      'divisor' : [
        {'value' : ',', 'label' : 'Vírgula'},
        {'value' : ';', 'label' : 'Ponto e Vírgula'},
        {'value' : '|', 'label' : 'Pipe'}
      ],
      'eol': [
        {'value' : 'newline', 'label' : 'Em branco'},
        {'value' : ';', 'label' : 'Ponto e Vírgula'},
        {'value' : ',', 'label' : 'Vírgula'}
      ]
    };
    $scope.exportModel = {
      'type' : 'json',
      'csv' : {
        'divisor' : ',',
        'eol' : 'newline'
      },
      'consulta' : {
        'codigo' : null,
        'descricao' : null
      }
    };
    $scope.resultset = {
      'records': 0,
      'fetched': 0,
      'columns': [],
      'rows': []
    };
    var codeMirror;

    DataSourceService.get(function(data){
      $scope.listDataSourceService              = data.data_source_servers;
      var source = JSON.parse(localStorage.getItem('activeDataSourceService')) || {};
      $scope.DataSource.activeDataSourceService = source.id || data.data_source_servers[0].id;
    });

    function getActiveDataSourceServer(){
      var el =  _.find($scope.listDataSourceService, function(el){
        return !!el && $scope.DataSource.activeDataSourceService === el.id;
      });

      if(!!el){
        localStorage.setItem('activeDataSourceService', JSON.stringify(el));
        return el.url;
      }else{
        return false;
      }
    }

    function prepareMessage(data, verbo){
      if (data === 1)
        return '01 registro ' + verbo;
      else if (data === 0)
        return 'Nenhum registro ' + verbo;
      else if (data > 0)
        return data + ' registros ' + verbo + 's' ;
    }

    $scope.scrollTop = function(){
      $anchorScroll();
    };

    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
      });
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

    function verifyAllParamsFilled(sql, params){
      var paramsSql = sql.match(/:\w+/ig) || [];
      if(paramsSql.length !== params.length){
        $scope.isExecuting = false;
        $scope.alert = {
          'type' : 'danger',
          'messages' : ['Desculpe, mas os parâmetros parecem estar incorretos.']
        };
        return false;
      }

      return true;

    }

    function createHint(data){
      var tables = {};
      data.schema.tables.forEach(function(val, index, arr){
        tables[val.name] = [];
        val.columns.forEach(function(column, index, arr){
          var hint = column.name + ' <span class="hint-datatype">' + column.type + '(' + column.length + ')</span>';
          tables[val.name].push(hint);
        });
      });

      localStorage.setItem('tables_' + $scope.DataSource.activeDataSourceService, JSON.stringify(tables));
      return tables;
    }

    $scope.codemirrorLoaded = function(_editor){
      codeMirror = _editor;
      var _doc = codeMirror.getDoc();
      codeMirror.focus()
      _doc.markClean();

      $scope.loadSchema();
    };

    $scope.loadSchema = function(){
      Configuration.middleware_server = getActiveDataSourceServer();
      // verifica se tem as tabelas
      var tables = localStorage.getItem('tables_' + $scope.DataSource.activeDataSourceService);
      if(Configuration.middleware_server){
        if (!tables){
          $scope.isLoadingSchema = true;
          SchemaService.get({}, Configuration.middleware_server)
          .success(function(data){
            tables = createHint(data);
            zCodeMirror.setHints(codeMirror, tables);
            $scope.isLoadingSchema = false;
          });
        }else{
          zCodeMirror.setHints(codeMirror, JSON.parse(tables));
          codeMirror.refresh();
        }
      }
      setTimeout(function(){
        codeMirror.refresh();
      }, 100);
    }

    $scope.validateParams = function(){
      var i;
      for(i = 0; i < $scope.statement.parameters.length; i++){
        var param = $scope.statement.parameters[i];
        if( param.name.trim() === '' || param.value.trim() === ''){
          $scope.statement.parameters.splice(i,1);
          i--;
        }
      }
    };

    $scope.resetStatement = function(){
      $scope.statement = {
        parameters : [],
        sql : localStorage.getItem('draft') || 'SELECT p.codproduto, p.codbarras, p.descricao1 FROM zw14ppro p WHERE p.situacao = \'N\' LIMIT 1000'
      };
    };

    $scope.addParam = function(){
      $scope.statement.parameters.push({
        name : '',
        value : '',
        type : 'varchar',
        evaluated: false,
      });
      window.setTimeout(function(){
        $('.table-editable tr:last td:first input').focus();
      },1);
    };

    $scope.deleteParam = function(key){
      $scope.statement.parameters.splice(key,1);
    };

    function showAlert(data){
      switch(getStatementType($scope.statement.sql)){
        case 'SELECT':
          $scope.alert = {
            type : 'success',
            messages : [prepareMessage(data.resultset.rows.length, 'encontrado')]
          };
        break;

        case 'UPDATE':
        case 'DELETE':
        case 'INSERT':
          $scope.alert = {
            type : 'success',
            messages : [prepareMessage(data.resultset.records, 'afetado')]
          }
          $scope.showResults = false;
        break;

        case 'CREATE':
        case 'DROP':
          $scope.alert = {
            type : 'success',
            messages : ['Sucesso na operação']
          }
          $scope.showResults = false;
        break;
      }
    }

    $scope.deactiveResultsTab = function(){
      $scope.showResults=false;
    }

    $scope.executeQuery = function(currentPage, callback){
      Configuration.statement_server = getActiveDataSourceServer();

      $scope.validateParams();
      if ($scope.isExecuting || !verifyAllParamsFilled($scope.statement.sql, $scope.statement.parameters))
        return;

      $scope.isExecuting = true;

      // se houver paginação
      if (currentPage) {
        var rowsPerPage = criaPaginacao($scope.result.columns.length);
        var data = [];
        var i = 0;
        var finalIndex = rowsPerPage * ($scope.currentPage + 1);

        while(i < finalIndex && i < $scope.allData.length){
          data[i] = $scope.allData[i];
          i++;
        }

        $scope.result.rows = data;
        $scope.isExecuting  = false;
        $scope.currentPage++;

      }else{
        var data = {'statement' : $scope.statement};
        var server = Configuration.statement_server;

        StatementService.execute(data, server)
          .success(function(data){

            $scope.saveHistory();
            $scope.isExecuting = false;

            if(typeof callback !== 'function')
              $scope.showResults = true;

            if (data.resultset) {
              var rowsPerPage = criaPaginacao(data.resultset.columns.length);
              $scope.allData = data.resultset.rows;

              $scope.result = {
                'records': $scope.allData.length,
                'columns': data.resultset.columns,
                'rows': $scope.allData.slice(0, rowsPerPage)
              };
              showAlert(data);
            }

            if(typeof callback === 'function')
              callback($scope.allData);
          })
          .error(function(err, code){
            $scope.isExecuting = false;
            $scope.alert = {
              'type' : 'danger',
              'messages' : zErrors.handling(err)
            };
          });
      }

    };

    $scope.salvarOrigem = function(){
      if($scope.exportModel.type === 'consulta'){
        $scope.statement.type      = 'Query';
        $scope.statement.code      = $scope.exportModel.consulta.codigo;
        $scope.statement.name      = $scope.exportModel.consulta.descricao;
        $scope.statement.statement = $scope.statement.sql;

        var data = { source : $scope.statement };
        SourceService.save(data, function(data, err){
          $scope.resetStatement();
          $scope.exportModel.consulta = '';
          $scope.exportModel.codigo   = '';
          $scope.alert = {
            'type' : 'success',
            'messages' : ["Origem salva com sucesso!"],
          };
        });
      }
    }

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

    $scope.$watch('statement.sql', function(newValue, oldValue){
      localStorage.setItem('draft', newValue);
    });

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

    $scope.renderList = function(){
      SourceService.get(function(data){
        $scope.queriesList = data.sources;
      });
    }

    $scope.loadSource = function(type, id){
      var type = type.toLowerCase();
      $location.path("origem/" + type + "/" + id);
    }

    $scope.deleteQuery = function(id, $index, $event){
      $event.preventDefault();
      var data = { "id" : id };
      if (window.confirm('Deseja deletar esse registro?')) {
        SourceService.remove(data, function(data){
          $scope.renderList();
        });
      }
    }

    $scope.renderList();
  }

  QueryCreateController.$inject = ['$scope', '$routeParams', '$location', 'SourceService', 'zCodeMirror'];
  function QueryCreateController($scope, $routeParams, $location, SourceService, zCodeMirror){

    $scope.showAdvancedOptions = true;
    $scope.showResults         = false;
    $scope.data_types          = ["varchar", "decimal", "integer", "date", "time", "timestamp"];
    $scope.isExecuting         = false;
    $scope.hasLimit            = true;
    $scope.results             = [];
    $scope.currentPage         = 1;
    $scope.errors              = [];
    $scope.historyItems        = [];
    $scope.editorOptions         = zCodeMirror.initialize($scope);

    $scope.codemirrorLoaded = function(_editor){
      var _doc = _editor.getDoc();
      _editor.focus();
      _doc.markClean();
      zCodeMirror.setHints(_editor, []);
    };

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
        value : null,
        // type : "varchar",
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

  AggregationCreateController.$inject = ['$scope', '$routeParams', '$location', 'SourceService', 'FunctionService', 'AggregationService'];
  function AggregationCreateController($scope, $routeParams, $location, SourceService, FunctionService, AggregationService){
    $scope.data_types = ["varchar", "decimal", "integer", "date", "time", "timestamp"];
    $scope.hasResult  = true;

    SourceService.get(function(data){
      $scope.sourceList = data.sources.filter(function(index, elem) {
        if(index.type === 'Query') return index;
      });
    });

    FunctionService.get(function(data){
      $scope.functionList = data.functions;
    });

    $scope.addOperation = function(){
      var data = {
        'function_id': null,
        'name': null,
        'parameters': []
      };

      $scope.aggregation.executions.push(data);
    }

    $scope.addParamsToExecution = function(execution){
      // encontra os parâmetros default
      var fnAux = _.find($scope.functionList, function(el, i){
        if(el.id === execution.function_id)
          return el;
      });

      // map dos parâmetros excluindo os valores passados anteriormente
      var params = [];
      fnAux.parameters.forEach(function(el, i){
        params.push({
          "type": el.type,
          "name": el.name
        });
      });

      execution.parameters = params;
      execution.name = fnAux.name;
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

    // function prepareParams(parameters){
    //   return parameters.map(function(p){
    //     return {
    //       "type": p.datatpye,
    //       "name": p.name,
    //       "value": p.value || "2014-11-30 00:00:00",
    //       "evaluated": false
    //     }
    //   });
    // }

    $scope.save = function(){
      var data = { source : $scope.aggregation };
      data.source.aggregated_sources = $scope.aggregation.sources.map(function(el){
          return { source_id : el.id };
      });
      delete data.source.sources;


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

    $scope.cancelar = function(){
      $location.path('/origem/');
    }

    $scope.aggregation = {};
    if ( !isNaN($routeParams.id) ) {
      SourceService.get({ id : $routeParams.id }, function(data){
        $scope.aggregation = prepareAggregationFromServer(data.aggregation);
      });
    }else{
      $scope.aggregation = {
        "type" : "Aggregation",
        "code" : null,
        "name" : null,
        "sources" : [],
        "executions" : [],
      }
    }

    function prepareAggregationFromServer(aggregation){
      // console.log(aggregation);
      aggregation.executions = aggregation.executions.map(function(elem, index) {
        if(!!elem.function){
          elem.function_id = elem.function.id;
          elem.order       = index;
          delete elem.function;
        }
        return elem;
      });

      aggregation.sources = aggregation.sources.map(function(elem, index) {
        elem = { "id" : elem.id };
        return elem;
      });
      delete aggregation.parameters;
      return aggregation;
    }
  }

  DashboardDetailController.$inject = ['$scope', '$routeParams', '$interval', 'DashboardService', 'SourceService', 'QueryService', 'AggregationService', 'zErrors'];
  function DashboardDetailController($scope, $routeParams, $interval,  DashboardService, SourceService, QueryService, AggregationService, zErrors){
    $scope.dashboard        = {};
    $scope.sourceList       = [];
    $scope.dataSourceServer = {};
    $scope.activeDataSourceServer;
    $scope.alert = {};
    loadDashboard();

    function loadDashboard(){
      DashboardService.get({ id : $routeParams.id }, function(data){
        $scope.dashboard        = data.dashboard;
        $scope.dataSourceServer = data.dashboard.data_source_servers[0];

        if ($scope.dataSourceServer) {
          $scope.activeDataSourceServer = $scope.dataSourceServer.id;
          $scope.loadWidgets();
        };

      }, function(err){
        $scope.alert = {
          "type" : "danger",
          "messages" : zErrors.handling(err)
        }
        $scope.isLoadingWidgets = false;
      });
    }

    $scope.getStatus = function(result, widget){
      widget.full_result = result;
      var x  = NumberHelpers.number_to_human(result, {
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
      var valores = $scope.prepareDataset(data.resultset.rows);
      var title   = widget.customized ? widget.name : widget.indicator.name;
      var hasZoom = false;
      var chart;

      try{
        $('[data-behaivor="widget"][data-id=' + widget.id + '] .content').highcharts().destroy();
        $(document).off('click', '[data-resetbutton]');
      }catch(err){
        // não conseguiu destroir
      }

      function grafico(valores) {

        window.dataset = valores.values;

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
                labels : { maxStaggerLines : 1 },
                dateTimeLabelFormats: {
                  week: '%d/%b',
                  day: '%d/%b',
                  month: '%b/%Y'
                }
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

      if(data.resultset.rows.length > 0){
        var volumeTotal = 0;
        var produtos    = (data.resultset.rows).sort(function(a,b){
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
      // var x   = url.match(re);
      return url;
    };

    // Verifica todos os parâmetros de inicio e fim que sejam nulos e seta os valores do dash
    function fillParameters(parameters){
      _.each(parameters,function(el, index) {
        if ( ( el.value === null || el.value.trim() === "" ) && (el.name === 'inicio' || el.name === 'fim')){
          parameters[index].value = (el.name === 'inicio') ? $scope.indicadores.periodo.inicio : $scope.indicadores.periodo.fim;
        }
        else if(el.name === 'inicio' || el.name === 'fim' && (el.value !== null && el.value.trim() !== "" ))
        {
          var wrap = (el.evaluated === true) ? "'" : '';
          if(parameters[index].value.match(/:inicio/)){
            parameters[index].value = parameters[index].value.replace(/:inicio/ig, wrap + $scope.indicadores.periodo.inicio + wrap);
          }
          if(parameters[index].value.match(/:fim/)){
            parameters[index].value = parameters[index].value.replace(/:fim/ig, wrap + $scope.indicadores.periodo.fim + wrap);
          }
        }
      });

      return parameters;
    }

    // Mapeia os parâmetros e formata para o formato esperado
    function formatParameters(parameters){
      _.each(parameters, function(el, index){
        parameters[index] = {
          type: el.datatype,
          evaluated: el.evaluated || false,
          name: el.name,
          value: el.value
        }
      });

      return parameters;
    }

    // percorre todas executions e preenche os parâmetros
    function prepareParamsAggregation(aggregation){
      aggregation.executions.forEach(function(el, i){
        var parameters = fillParameters(el.parameters);
      });

      return aggregation;

    }

    function prepareAggregation(aggregation){
      var data = {
        "result": aggregation.result,
        "statements" : [],
        "operations" : []
      };

      aggregation.sources.forEach(function(s, i){
        data.statements.push({
          "sql" : s.statement,
          "parameters" : fillParameters(formatParameters(s.parameters))
        });
      });

      aggregation.executions.forEach(function(operation){
        var params = operation.parameters.map(function(el){
          return !isNaN(el.value) ? parseInt(el.value) : el.value;
        });
        data.operations.push({
          "type": operation.function.name,
          "parameters" : params
        });
      });

      return data;
    }

    $scope.loadWidgets = function(){
      var Service, parameters;
      $scope.isLoadingWidgets = true;

      if (Object.keys($scope.dashboard).length === 0) {
        loadDashboard();
      }
      else{
        var widgetsLoaded = 0;
        $scope.dashboard.widgets.forEach(function(widget, index){
          widget.loading = true;

          SourceService.get({ id : widget.indicator.source_id }, function(data){
            $scope.alert   = {};

            if(data.query){
              Service    = QueryService;
              parameters = data.query.parameters;
              parameters = fillParameters(parameters);
              parameters = formatParameters(parameters);
            }else{
              Service          = AggregationService;
              data.aggregation = prepareAggregation(data.aggregation);
            }

            Service.post(data, $scope.getHost(), function(data){
              var type = widget.widget_type.name;

              switch(type){
                case 'status':
                  $scope.getStatus(data.resultset.rows[0][0] || 0, widget);
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
      }
    };

    $scope.indicadores = {
      periodo : {
        inicio    : (moment({ day : 01, month: 10, year : 2014 }).format("YYYY-MM-DD 00:00:00")),
        fim       : (moment({ day : 30, month: 10, year : 2014 }).format("YYYY-MM-DD 00:00:00")),
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

})();