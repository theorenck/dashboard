var Atlas = angular.module('Atlas',['ngResource']);

/**
 * Configura o header para usar autenticação
 */
Atlas.config([
  '$httpProvider',

  function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common.Authorization = 'Token token=4361a34b6472e4634cd27f8d3f37108e';
  }

]);

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


/**
 * App Controller
 */
Atlas.controller('appController', [
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
      console.log(server);
      $scope.api_server = server;
    }

    $scope.renderList();
  }

]);