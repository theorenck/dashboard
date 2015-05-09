(function(){
  'use strict';

  angular.module('Atlas')

  .service('zHttp',
    ['$http',

      function($http){

        var http = {

          url : '',

          req : {
            method: 'GET',
            url: 'http://localhost:3000',
            data: {},
          },

          setParams : function(method, data, server){
            if(typeof method !== "undefined")
              this.setMethod(method);

            if(typeof data !== "undefined")
              this.setData(data);

            if(typeof server !== "undefined")
              this.setServer(server);
          },

          setMethod : function(method){
            this.req.method = method;
          },

          get : function(data, server, callback){
            var self = this;
            self.setParams('GET', data, server);
            if(typeof callback === 'function'){
              return $http(self.req).success(callback);
            }else{
              return $http(self.req);
            }
          },

          post : function(data, server, callback){
            var self = this;
            self.setParams('POST', data, server);
            return $http(self.req)
              .success(callback);
          },

          setServer : function(server){
            var self = this;
            server   = server.substr(-1) !== '/' ? server : server.substr(0, server.length - 1);

            // Valida se está sendo passado um ID para atualização ou busca pela URL
            if(typeof self.req.data.id !== "undefined")
              self.url += '/' + self.req.data.id;

            $.extend(self.req, { "url" : server + self.url });
          },

          setData : function(data){
            var self = this;
            if(data.query){
              var prepared = {
                "statement" : {
                  "parameters" : data.query.parameters,
                  "sql"        : data.query.statement
                }
              };
            }else{
              prepared = data;
            }

            $.extend(self.req, { "data" : prepared });
          }
        }

        return http;
      }
    ]
  )

  /**
   * MIDDLEWARE
   */
  .factory(
    'QueryService',
    ['zHttp',

      function(zHttp){
        var x = Object.create(zHttp);
        x.url = '/api/statements';
        return x;

      }
    ]
  )

  /**
   * MIDDLEWARE
   */
  .factory(
    'AggregationService',
    ['zHttp',

      function(zHttp){
        var x = Object.create(zHttp);

        x.url = '/api/aggregations';
        return x;

      }
    ]
  )

  /**
   * MIDDLEWARE - dinamico
   */
  .factory(
    'SchemaService',
    ['zHttp',
      function(zHttp){
        var x = Object.create(zHttp);

        x.url = '/api/schema?extended=true';
        return x;
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'DataSourceService',
    ['$resource',

      function($resource){
        return $resource( Configuration.business_server + '/api/data_source_servers/:id', { id: '@data_source_server.id' }, {
           'update': { method:'PUT' },
        });
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'SourceService',
    ['$resource',

      function($resource){
        return $resource( Configuration.business_server + '/api/sources/:id', { id: '@source.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'UnityService',
    ['$resource',

      function($resource){
        return $resource( Configuration.business_server + '/api/unities/:id', { id: '@unitiy.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'AuthService',
    ['$resource',

      function($resource){
        return $resource( Configuration.business_server + '/api/authentications/:id', { id: '@authentication.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'DashboardService',
    ['$resource',

      function($resource){
        return $resource( Configuration.business_server + '/api/dashboards/:id', { id: '@dashboard.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'IndicatorService',
    ['$resource',

      function($resource){
        return $resource( Configuration.business_server + '/api/indicators/:id', { id: '@indicator.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'WidgetService',
    ['$resource',

      function($resource){
        return $resource( Configuration.business_server + '/api/widgets/:id', { id: '@widget.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'UserService',
    ['$resource',

      function($resource){
        return $resource( Configuration.business_server + '/api/users/:id', { id: '@user.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'PermissionService',
    ['$resource',

      function($resource){
        return $resource( Configuration.business_server + '/api/permissions/:id', { id: '@permission.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'WidgetTypeService',
    ['$resource',
      function($resource){
        return $resource( Configuration.business_server + '/api/widget_types/:id', { id: '@widget_types.id' }, {
           'update': { method:'PUT' }
        });
      }
    ]
  )

  /**
   * MIDDLEWARE
   */
  .factory(
    'StatementService',
    ['$http',

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
          execute : function(data, server, callback){
            var self = this;
            self.setServer(server);
            self.setData(data);

            return $http(self.req);
          },

          setServer : function(server){
            var self = this;
            $.extend(self.req, { "url" : server + '/api/statements' });
          },

          setData : function(data){
            var self = this;
            console.log(data);
            $.extend(self.req, { "data" : data });
          }
        }

        return Statement;
      }
    ]
  )

  /**
   * BUSSINES
   */
  .factory(
    'FunctionService',
    ['$resource',
      function($resource){
        return $resource(Configuration.business_server + '/api/functions');
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

})();
