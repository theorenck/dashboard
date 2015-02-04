(function(){
  'use strict';

  angular.module('Atlas')

  .factory(
    'QueryService',
    ['$resource',

      function($resource){

        return $resource('http://:host/api/queries', { host : 'zetainfo.dyndns.info:3000' }, {
           'update': { method:'PUT' },
        });
      }
    ]
  )

  .factory(
    'AggregationService',
    ['$resource',

      function($resource){

        return $resource('http://:host/api/aggretations', { host : 'zetainfo.dyndns.info:3000' }, {
           'update': { method:'PUT' },
        });
      }
    ]
  )

  .factory(
    'DataSourceService',
    ['$resource',

      function($resource){
        return $resource('http://:host/api/data_source_servers/:id', { host : 'zetainfo.dyndns.info:9000', id: '@data_source_server.id' }, {
           'update': { method:'PUT' },
        });
      }
    ]
  )

  .factory(
    'SourceService',
    ['$resource',

      function($resource){
        return $resource('http://:host/api/sources/:id', { host : 'zetainfo.dyndns.info:9000', id: '@source.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  .factory(
    'UnityService',
    ['$resource',

      function($resource){
        return $resource('http://:host/api/unities/:id', { host : 'zetainfo.dyndns.info:9000', id: '@unitiy.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  .factory(
    'AuthService',
    ['$resource',

      function($resource){
        return $resource('http://:host/api/authentications/:id', { host : 'zetainfo.dyndns.info:9000', id: '@authentication.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  .factory(
    'DashboardService',
    ['$resource',

      function($resource){
        return $resource('http://:host/api/dashboards/:id', { host : 'zetainfo.dyndns.info:9000', id: '@dashboard.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  .factory(
    'IndicatorService',
    ['$resource',

      function($resource){
        return $resource('http://:host/api/indicators/:id', { host : 'zetainfo.dyndns.info:9000', id: '@indicator.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  .factory(
    'WidgetService',
    ['$resource',

      function($resource){
        return $resource('http://:host/api/widgets/:id', { host : 'zetainfo.dyndns.info:9000', id: '@widget.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  .factory(
    'UserService',
    ['$resource',

      function($resource){
        return $resource('http://:host/api/users/:id', { host : 'zetainfo.dyndns.info:9000', id: '@user.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  .factory(
    'PermissionService',
    ['$resource',

      function($resource){
        return $resource('http://:host/api/permissions/:id', { host : 'zetainfo.dyndns.info:9000', id: '@permission.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  .factory(
    'WidgetTypeService',
    ['$resource',
      function($resource){
        return $resource('http://:host/api/widget_types/:id', { host : 'zetainfo.dyndns.info:9000', id: '@widget_types.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  .factory(
    'SchemaService',
    ['$resource',
      function($resource){
        return $resource('http://zetainfo.dyndns.info:3000/api/schema/');
      }
    ]
  )

  .factory(
    'StatementService',
    [
      '$http',
      function($http){

        var Statement = {

          req : {
            method: 'POST',
            url: 'htpp://localhost:3000',
            data: {},
          },

          /**
           * Executa o statement, configurando o server e passando data como parâmetro
           * @param  {[type]} data   { statement : { parameters: [], sql : '' } }
           * @param  {[type]} server Servidor a ser conectado
           * @return {[type]}        promisse
           */
          execute : function(data, server){
            Statement.setServer(server);
            Statement.setData(data);

            return $http(Statement.req);
          },

          setServer : function(server){
            $.extend(Statement.req, { "url" : server + '/api/statements' });
          },

          setData : function(data){
            $.extend(Statement.req, { "data" : data });
          }
        }

        return Statement;
      }
    ]
  )

  .factory(
    'FunctionService',
    ['$resource',
      function($resource){
        return $resource('http://zetainfo.dyndns.info:9000/api/functions');
      }
    ]
  )

  .factory(
    'HistoryService',
    function(){

      var History = {};

      History.get = function(id, callback){
        var id    = id || false;
        var items = JSON.parse(localStorage.getItem('history')) || [];

        if(typeof id == 'function'){
          callback = id;
          id       = false;
        };

        if(!id){
          callback(items);
        }else{
          var item = false;
          var i    = 0;
          while(i < items.length && item === false){
            if(items[i].id === id)
              item = items[i];
            i++;
          }
          return item;
        }

      },

      History.post = function(statement, callback){
        var id      = parseInt(Math.random() * 0xFFFFFF, 10).toString(16);
        var history = JSON.parse(localStorage.getItem('history')) || [];
        var type    = (statement.sql).match(/^\s*(SELECT|DELETE|UPDATE|INSERT|DROP|CREATE)\b/i)[1].toUpperCase() || '';

        var item    = {
          "id"         : id,
          "statement"  : statement,
          "created_at" : new Date(),
          'type'       : type
        }

        history.push(item);
        localStorage.setItem('history', JSON.stringify(history));
        callback();
      };

      History.clear  = function(callback){
        localStorage.removeItem('history');
        callback();
      }

      History.delete = function(id, callback){
        var items = JSON.parse(localStorage.getItem('history')) || [];
        var item = false;
        var i    = 0;

        while(i < items.length && item === false){
          if(items[i] != undefined && items[i].id === id){
            items.splice(i,1);
            item = true;
          }
          i++;
        }

        localStorage.setItem('history', JSON.stringify(items));
        callback(items);

      };

      return History;
    }
  )

  .factory(
    'zCodeMirror',
    function(){

      var zCodeMirror = {};

      zCodeMirror.initialize = function($scope){
        return {
          lineNumbers: true,
          extraKeys: {
            "Ctrl-Space": "autocomplete",
            "F8" : function(){
              $scope.executeQuery();
            },
            "Ctrl-S" : function(){
              $scope.saveHistory();
            },
            "Ctrl-Enter" : function(e){
              $scope.executeQuery();
            },
            "Ctrl-L" : function(e){
              function autoFormat() {
                  var sql = e.doc.getValue();
                  $.ajax({
                      url: 'http://sqlformat.org/api/v1/format',
                      type: 'POST',
                      dataType: 'json',
                      crossDomain: true,
                      data: {sql: sql, reindent: 1},
                      success: function(data){
                        e.doc.setValue(data['result']);
                      },
                  });
              }
              autoFormat();
            }
          },
          tabSize : 2,
          tabMode : "spaces",
          styleActiveLine: false,
          matchBrackets: true,
          mode : 'text/x-sql',
          viewportMargin: Infinity
        };
      };

      zCodeMirror.setHints = function(instance, tables){
        var tables = tables ? tables : JSON.parse(localStorage.getItem("tables"));
        return instance.setOption("hintOptions",{
            tables: tables
        });
      };

      return zCodeMirror;
    }
  )

})();
