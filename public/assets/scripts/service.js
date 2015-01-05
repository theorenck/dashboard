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


/* RESOURCE TABLES */
Atlas.factory(
  'Tables',
  ['$resource',
    function($resource){
      return $resource('http://localhost:3000/api/schema/');
    }
  ]
);


/* RESOURCE STATEMENTS */
Atlas.factory(
  'Statements',
  ['$resource',
    function($resource){
      return $resource('http://localhost:3000/api/statements', {}, {
         'update' : { method:'PUT' },
         'execute': { method:'POST' }
      });
    }
  ]
);


/* RESOURCE STATEMENTS */
Atlas.factory(
  'History',
  [function(){

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


  }]
);

