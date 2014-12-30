Atlas.directive('zCheckbox', function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      "checkbox" : '=ngModel'
    },
    template: '<div class="atlCheckbox">' +
    '<input type="checkbox" checked="checked" ng-model="checkbox">' +
    '</div>',

    link: function(scope, element, attr, ngController) {
      element.on('mouseenter', function(event){
        element.children(1).addClass('atlCheckbox_hover');
      });

      element.on('focus', function(event){
        element.children(1).addClass('atlCheckbox_active');
      });

      element.on('click', function(event){
        element.children(1).toggleClass('atlCheckbox_checked');
      });

      element.on('blur', function(event){
        element.children(1).removeClass('atlCheckbox_active');
      });

      element.on('mouseleave', function(event){
        element.children(1).removeClass('atlCheckbox_hover').removeClass('.atlCheckbox_active');
      });
    }
  };
});