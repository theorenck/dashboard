(function(){
  'use strict';

  angular.module('Atlas')

  .directive('integer', function(){
    return {
      require: 'ngModel',
      link: function(scope, ele, attr, ctrl){

        ctrl.$parsers.unshift(function(viewValue){
          return parseInt(viewValue, 10);
        });

      }
    };
  })

  .directive('zJsondownload',function(){
    return {
      restrict: 'EA',
      scope: {
        'resultset' : '=',
        'columns'   : '=',
        'typeFile'  : '@',
        'options'   : '=',
      },
      link : function(scope, el, attr){

        el.on('click', function(){
          if(scope.typeFile === 'csv'){
            JSONToCSVConvertor(scope.columns, scope.resultset, 'Console', true);
          }
          else if(scope.typeFile === 'json'){
            JSONDownload(scope.columns, scope.resultset, 'Console', true);
          }
        });

        function JSONDownload(JSONColumns, JSONData, reportTitle, showLabel){
          var result       = { columns : [], resultset : [] };
          result.columns   = JSONColumns;
          result.resultset = JSONData;


          try{
            var fileName  = 'AtlasReport_';
            fileName      += reportTitle.replace(/ /g,'_');
            var uri       = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result));
            var link      = document.createElement('a');
            link.href     = uri;
            link.style    = 'visibility:hidden';
            link.download = fileName + '.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }catch(err){
            console.log(err);
          }
        }

        function JSONToCSVConvertor(JSONColumns, JSONData, reportTitle, showLabel) {
          var CSV        = [];
          var eol        = scope.options.csv.eol === 'newline' ? '\r\n' : scope.options.csv.eol + '\r\n';

          if (showLabel)
            CSV.push(JSONColumns.join(scope.options.csv.divisor));

          JSONData.forEach(function(row, i){
            row = row.join(scope.options.csv.divisor).replace(/(\r\n|\n|\r|\t|\s+)/gm, ' ');
            CSV.push(row);
          });


          CSV = CSV.join(eol);

          if (CSV === '') {
            alert('Invalid data');
            return;
          }

          var fileName  = 'AtlasReport_';
          fileName      += reportTitle.replace(/ /g,'_');
          var uri       = 'data:text/csv;charset=utf-8,' + escape(CSV);
          var link      = document.createElement('a');
          link.href     = uri;
          link.style    = 'visibility:hidden';
          link.download = fileName + '.csv';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    };
  })

  .directive('colorlist', function() {
    return {
      restrict: 'E',
      scope: {
        "selectedColors" : '=',
        "colors" : '='
      },
      templateUrl: '/dist/templates/widget/tplColorlist.html',

      link: function(scope, element, attr, ngController) {
        scope.arrColors = {};

        scope.$watchCollection('selectedColors', function(newValue, oldValue){
          if(newValue && Array.isArray(newValue)){
            newValue.forEach(function(el, i){
              scope.arrColors[el] = i + 1;
            });
          }
        });

        scope.addRemoveColor = function(color){
          if(!Array.isArray(scope.selectedColors)){
            scope.selectedColors = [];
          }
          var index = scope.selectedColors.indexOf(color);
          if(index != -1){
            scope.selectedColors.splice(index,1);
            scope.arrColors[color] = null;
          }else{
            scope.selectedColors.push(color);
          }
        }


      }
    };
  })

  .directive('scrollPosition', function($window){
    return {
      scope: {
        'scroll' : '=scrollPosition'
      },
      link: function(scope, element, attrs) {
        var windowEl = angular.element($window);
        var handler = function() {
          scope.scroll = windowEl.scrollTop();
        };
        windowEl.on('scroll', scope.$apply.bind(scope, handler));
        handler();
      }
    };
  })

  .directive('zCheckbox', function() {
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
  })

  .directive('zExecutions', function() {
    return {
      restrict: 'E',
      templateUrl: '/dist/templates/origem/zExecutions.html',
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
          execution.parameters = fn.parameters;
        }

      }
    };
  })

  .directive('zWidgetStatus', function() {
    return {
      restrict: 'E',
      replace : true,
      templateUrl: '/dist/templates/widget/tplStatus.html',
      link: function($scope, element, attr, ngController) {

      }
    };
  })

  .directive('zLoader', function() {
    return {
      restrict: 'E',
      replace : true,
      templateUrl: '/dist/templates/directives/zLoader.html',
      scope : {
        'inverse' : '='
      },
      link: function($scope, element, attr, ngController) {
      }
    };
  })

  .directive('zWidgetLine', function() {
    return {
      restrict: 'E',
      templateUrl: '/dist/templates/widget/tplLine.html',
      link: function($scope, element, attr, ngController) {

      }
    };
  })

  .directive('zWidgetPie', function() {
    return {
      restrict: 'E',
      templateUrl: '/dist/templates/widget/tplPie.html',
      link: function($scope, element, attr, ngController) {

      }
    };
  })

  .directive('zFloatthead', ['$timeout', function($timeout){
    return {
      scope: {
        'results' : '=ngModel'
      },
      require: 'ngModel',
      restrict: 'EA',
      templateUrl: '/dist/templates/directives/zFloatThead.html',
      link: function($scope, iElm, iAttrs, controller) {

        function loadFloatThead(){
          $table = iElm.find('.floatThead');
          $table.floatThead('destroy');
          $timeout(function(){
            $table.floatThead({
                scrollContainer: function($table){
                return $table.closest('.wrapper');
              }
            });
          }, 500);
        }

        $scope.$watch('results', function(value){
          var records = value.records || 0;
          if(records > 0)
           loadFloatThead();
        });

      }
    };
  }])

  .directive('zDaterangepicker', [function($timeout){
    return {
      scope: {
        'indicadores' : '=ngModel',
        'loadWidgets'  : '&callback'
      },
      require: 'ngModel',
      restrict: 'EA',
      link: function(scope, el, attrs, controller) {
        var hasInputDate = verifyInputDate();
        var format       = hasInputDate ? 'YYYY-MM-DD' : 'DD/MM/YYYY';

        function verifyInputDate(){
          var i = document.createElement("input");
            i.setAttribute("type", "date");
          return i.type !== "text";
        }

        function callbackDatePicker(start, end, range){
          var text;
          if (range !== undefined && range !== "Personalizado") {
            text = range;
          }
          else {
            var formato = "D [de] MMMM";
            if (start.format('YYYY') === end.format('YYYY')) {
              if (start.format('MMMM') === end.format('MMMM')) {
                formato = 'D';
              };
            }
            else {
              formato = 'D [de] MMMM, YYYY';
            }
            text = start.format(formato) + '  até  ' + end.format('D [de] MMMM, YYYY');
          }

          $('[data-behaivor=show-actual-date]').html(text);

          if (scope.indicadores) {
            scope.indicadores.periodo.inicio = start.format("YYYY-MM-DD 00:00:00");
            scope.indicadores.periodo.fim    = end.format("YYYY-MM-DD 00:00:00");
          };

          if (typeof scope.loadWidgets === "function") {
            scope.loadWidgets();
          };
        }

        el.daterangepicker(
          {
            ranges: {
              'Hoje': [moment(), moment()],
              'Ontem': [moment().subtract(1,'days'), moment().subtract(1,'days')],
              'Últimos 7 dias': [moment().subtract(6,'days'), moment()],
              'Últimos 30 dias': [moment().subtract(29,'days'), moment()],
              'Últimos 90 dias': [moment().subtract(89,'days'), moment()],
              'Este mês': [moment().startOf('month'), moment().endOf('month')],
              'Último mês': [moment().subtract(1,'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            format : format,
            showDropdowns : true,
            minDate : moment({year : 2000, month: 0, day: 1}),
            maxDate : moment().add(1, 'month'),
            startDate: moment().subtract(29,'days'),
            endDate: moment(),
            locale: {
              applyLabel: 'Aplicar',
              cancelLabel: 'Limpar',
              fromLabel: 'De',
              toLabel: 'Para',
              customRangeLabel: 'Personalizado',
              daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex','Sab'],
              monthNames: ['Janeiro', 'Favereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            }
          },
          callbackDatePicker
        );

        $('.daterangepicker').css('width', $(el).closest('.toolbar').innerWidth() - 30 + 'px');

        if(hasInputDate){
          $('[name=daterangepicker_start]').attr('type','date');
          $('[name=daterangepicker_end]').attr('type','date');
        }
      }
    };
  }])

  .directive('fastRepeat', ['$timeout', function($timeout){
    return {
      restrict: 'E',
      scope: {
        'data': '='
      },
      link : function(scope, el, attrs) {

        scope.$watchCollection('data', function(newValue, oldValue){
          if (newValue) {
            var records = newValue.records || 0;
            React.render(
              RTable(newValue),
              el[0],
              loadFloatThead(records)
            );
          };
        });

        function loadFloatThead(records){
          if (records > 0) {
            $timeout(function(){
              var $table = $('.table-float-thead');

              $table.floatThead('destroy');
              $table.floatThead({
                scrollContainer: function($table){
                  return $table.closest('.wrapper');
                }
              });
            }, 200);
          }
        }

        el.on('$destroy', function() {
          var $table = el.find('.table-float-thead');
          $table.floatThead('destroy');
        });

      }
    }
  }])

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
                      }
                  });
              }
              autoFormat();
            }
          },
          tabSize : 2,
          tabMode : 'spaces',
          styleActiveLine: false,
          matchBrackets: true,
          mode : 'text/x-sql',
          viewportMargin: Infinity
        };
      };

      zCodeMirror.setHints = function(instance, tables){
        return instance.setOption('hintOptions',{
            tables: tables
        });
      };

      return zCodeMirror;
    }
  )

  .directive('zAlertbox', [function(){
    return {
      scope: {
        'alert' : '=ngModel'
      },
      require: 'ngModel',
      restrict: 'EA',
      templateUrl: '/dist/templates/directives/zAlertbox.html',
      link: function($scope, iElm, iAttrs, controller) {

        $scope.clearMessages = function(){
          $scope.alert = {
            'type' : '',
            'messages' : []
          };
        }

      }
    };
  }]);
})();