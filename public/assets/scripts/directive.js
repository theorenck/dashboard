Atlas.directive('integer', function(){
  return {
    require: 'ngModel',
    link: function(scope, ele, attr, ctrl){
      ctrl.$parsers.unshift(function(viewValue){
        return parseInt(viewValue, 10);
      });
    }
  };
});

Atlas.directive('zCheckbox', function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      "checkbox" : '=ngModel'
    },
    template: '<div class="atlCheckbox" ng-class="{\'atlCheckbox_checked\' : checkbox }">' +
      '<input type="checkbox" ng-model="checkbox">' +
      '</div>',

    link: function(scope, element, attr, ngController) {

      element.on({
        "mouseenter": function(event){
          element.children(1).addClass('atlCheckbox_hover');
        },
        "focusin": function(event){
          element.children(1).addClass('atlCheckbox_hover');
        },
        "mouseleave": function(event){
          element.children(1).removeClass('atlCheckbox_hover').removeClass('.atlCheckbox_active');
        },
        "focusout": function(event){
          element.children(1).removeClass('atlCheckbox_hover');
        }
      });
    }
  };
});

Atlas.directive('zExecutions', function() {
  return {
    restrict: 'E',
    templateUrl: '/admin/origem/zExecutions.html',
    link: function($scope, element, attr, ngController) {

      /**
       * Move o box para cima e para baixo
       * @param  Integer key indice do array
       * @param  String dir 'up', 'down'
       */
      $scope.move = function(key, dir){
        $scope.aggregation.executions.map(function(elem, index) {
          elem.order = index;
          return elem;
        });

        var aux;
        for (var i = 0; i < $scope.aggregation.executions.length; i++) {
          var index = (dir === 'down') ? i+1 : i-1;

          if ( key === i ) {
            aux = $scope.aggregation.executions[i];
            $scope.aggregation.executions[i]   = $scope.aggregation.executions[index];
            $scope.aggregation.executions[index] = aux;
          };
        };
      }

      /* Se houver ID então pede para excluir, senão remove do array */
      $scope.deleteExecution = function(key){
        if (window.confirm("Você tem certeza que deseja deletar essa operação?")) {
          if($scope.aggregation.executions[key].id)
            $scope.aggregation.executions[key]._destroy = true;
          else
            $scope.aggregation.executions.splice(key, 1);
        };
      }

      $scope.loadParametersFromFunction = function(execution){
        var i  = 0;
        var fn = false;

        while(i < $scope.functionList.length || fn === false){
          if($scope.functionList[i].id === execution.function_id){
            fn = $scope.functionList[i];
          }
          i++;
        }
        console.log(fn.parameters);
        execution.parameters = fn.parameters;
      }

    }
  };
});

Atlas.directive('zWidgetStatus', function() {
  return {
    restrict: 'E',
    templateUrl: '/admin/widget/tplStatus.html',
    link: function($scope, element, attr, ngController) {

    }
  };
});

Atlas.directive('zWidgetLine', function() {
  return {
    restrict: 'E',
    templateUrl: '/admin/widget/tplLine.html',
    link: function($scope, element, attr, ngController) {

    }
  };
});

Atlas.directive('zWidgetPie', function() {
  return {
    restrict: 'E',
    templateUrl: '/admin/widget/tplPie.html',
    link: function($scope, element, attr, ngController) {

    }
  };
});


Atlas.directive('zErrorbox', [function(){
  return {
    scope: {
      'errors' : '=ngModel'
    },
    require: 'ngModel',
    restrict: 'EA',
    template: '<div class="alert alert-dismissable alert-danger" ng-show="errors.length"><button type="button" class="close" ng-click="clearErrors()"> <span aria-hidden="true">×</span> </button><strong>Oh snap! </strong><p ng-repeat="err in errors">{{ err }}</p></div>',
    link: function($scope, iElm, iAttrs, controller) {

      $scope.clearErrors = function(){
        $scope.errors = [];
      }

    }
  };
}]);


Atlas.directive('zFloatthead', ['$timeout', function($timeout){
  return {
    scope: {
      'results' : '=ngModel'
    },
    require: 'ngModel',
    restrict: 'EA',
    templateUrl: '/assets/templates/zFloatThead.html',
    link: function($scope, iElm, iAttrs, controller) {

      function loadFloatThead(){
        $table = iElm.find('.table[data-floatThead=true]');
        $table.floatThead('destroy');
        $timeout(function(){
          $table.floatThead({
              scrollContainer: function($table){
              return $table.closest('.wrapper');
            }
          });
        }, 500);
      }

      iElm.on('$destroy', function() {
        $table.floatThead('destroy');
      });

      $scope.$watch('results', function(value){
        var records = value.records || 0;
        if(records > 0)
          loadFloatThead();
      });


    }
  };
}]);

