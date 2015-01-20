Atlas.factory(
  'QueryService',
  ['$resource',

    function($resource){

      return $resource('http://:host/api/queries', { host : '127.0.0.1:3000' }, {
         'update': { method:'PUT' },
      });
    }
  ]
);

Atlas.factory(
  'AggregationService',
  ['$resource',

    function($resource){

      return $resource('http://:host/api/aggretations', { host : '127.0.0.1:3000' }, {
         'update': { method:'PUT' },
      });
    }
  ]
);

Atlas.factory(
  'DataSourceService',
  ['$resource',

    function($resource){

      return $resource('http://:host/api/data_source_servers/:id', { host : '127.0.0.1:9000', id: '@data_source_server.id' }, {
         'update': { method:'PUT' },
      });
    }
  ]
);

Atlas.factory(
  'SourceService',
  ['$resource',

    function($resource){
      return $resource('http://:host/api/sources/:id', { host : '127.0.0.1:9000', id: '@source.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'UnityService',
  ['$resource',

    function($resource){
      return $resource('http://:host/api/unities/:id', { host : '127.0.0.1:9000', id: '@unitiy.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'AuthService',
  ['$resource',

    function($resource){
      return $resource('http://:host/api/authentications/:id', { host : '127.0.0.1:9000', id: '@authentication.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'DashboardService',
  ['$resource',

    function($resource){
      return $resource('http://:host/api/dashboards/:id', { host : '127.0.0.1:9000', id: '@dashboard.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'IndicatorService',
  ['$resource',

    function($resource){
      return $resource('http://:host/api/indicators/:id', { host : '127.0.0.1:9000', id: '@indicator.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'WidgetService',
  ['$resource',

    function($resource){
      return $resource('http://:host/api/widgets/:id', { host : '127.0.0.1:9000', id: '@widget.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'UserService',
  ['$resource',

    function($resource){
      return $resource('http://:host/api/users/:id', { host : '127.0.0.1:9000', id: '@user.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'PermissionService',
  ['$resource',

    function($resource){
      return $resource('http://:host/api/permissions/:id', { host : '127.0.0.1:9000', id: '@permission.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'WidgetTypeService',
  ['$resource',
    function($resource){
      return $resource('http://:host/api/widget_types/:id', { host : '127.0.0.1:9000', id: '@widget_types.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'SchemaService',
  ['$resource',
    function($resource){
      return $resource('http://127.0.0.1:3000/api/schema/');
    }
  ]
);

Atlas.factory(
  'StatementService',
  ['$resource',
    function($resource){
      return $resource('http://:host/api/statements', { host : '127.0.0.1:3000' }, {
         'update' : { method:'PUT' },
         'execute': { method:'POST' }
      });
    }
  ]
);

Atlas.factory(
  'FunctionService',
  ['$resource',
    function($resource){
      return $resource('http://127.0.0.1:9000/api/functions');
    }
  ]
);

Atlas.factory(
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

    History.post = function(statement){
      var id      = parseInt(Math.random() * 0xFFFFFF, 10).toString(16);
      var history = JSON.parse(localStorage.getItem('history')) || [];
      var type    = (statement.sql).match(/^[\n|\t|\s|\r]*(SELECT|DELETE|UPDATE|INSERT)\b/i)[1].toUpperCase();

      var item    = {
        "id"         : id,
        "statement"  : statement,
        "created_at" : new Date(),
        'type'       : type
      }

      history.push(item);
      localStorage.setItem('history', JSON.stringify(history));
    };

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
);

Atlas.factory(
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
);

