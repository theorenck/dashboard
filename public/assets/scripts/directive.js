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

Atlas.directive('zErrorbox', [function(){
  return {
    scope: {
      'errors' : '=ngModel'
    },
    require: 'ngModel',
    restrict: 'EA',
    template: '<div class="alert alert-dismissable alert-danger" ng-show="errors.length"><strong>Oh snap! </strong><p ng-repeat="err in errors">{{ err }}</p></div>',
    link: function($scope, iElm, iAttrs, controller) {

    }
  };
}]);