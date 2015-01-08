/* RESOURCE APISERVERS */
Atlas.factory(
  'DataSourceService',
  ['$resource',

    function($resource){
      return $resource('http://127.0.0.1:9000/api/data_source_servers/:id', { id: '@data_source_server.id' }, {
         'update': { method:'PUT' }
      });
    }
  ]
);

Atlas.factory(
  'SourceService',
  ['$resource',

    function($resource){
      return $resource('http://127.0.0.1:9000/api/sources/:id', { id: '@source.id' }, {
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
      return $resource('http://127.0.0.1:9000/api/authentications/:id', { id: '@authentication.id' }, {
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
      return $resource('http://127.0.0.1:9000/api/dashboards/:id', { id: '@dashboard.id' }, {
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
      return $resource('http://127.0.0.1:9000/api/indicators/:id', { id: '@indicator.id' }, {
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
      return $resource('http://127.0.0.1:9000/api/widgets/:id', { id: '@widget.id' }, {
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
      return $resource('http://127.0.0.1:9000/api/users/:id', { id: '@user.id' }, {
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
      return $resource('http://127.0.0.1:9000/api/permissions/:id', { id: '@permission.id' }, {
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
      return $resource('http://127.0.0.1:9000/api/widget_types/:id', { id: '@widget_types.id' }, {
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


Atlas.factory(
  'FunctionsService',
  ['$resource',
    function($resource){
      return $resource('http://localhost:9000/api/functions');
    }
  ]
);



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


Atlas.factory(
  'zCodeMirror',
  [function(){

    var zCodeMirror = {
      "instance" : CodeMirror
    };

    zCodeMirror.initialize = function(el){
      try{
        zCodeMirror.instance = zCodeMirror.instance.fromTextArea(el, {
          lineNumbers: true,
          extraKeys: {
            "Ctrl-Space": "autocomplete",
            // "F8" : function(){
            //   console.log('F8');
            // },
            // "Ctrl-Enter" : function(e){
            //   console.log('Ctrl + Enter');
            // }
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
        });
      }catch(err){
        zCodeMirror.instance.setOption('lineNumbers', true);
        zCodeMirror.instance.refresh();
      }
    }

    zCodeMirror.setHints = function(){
      return zCodeMirror.instance.setOption("hintOptions",{
          tables: JSON.parse(localStorage.getItem("tables"))
      });
    }

    zCodeMirror.setValue = function(value){
      return zCodeMirror.instance.setValue(value);
    };

    zCodeMirror.save = function(){
      return zCodeMirror.instance.save();
    };

    zCodeMirror.getValue = function(){
      return zCodeMirror.instance.getValue();
    };


    return zCodeMirror;

  }]
);

