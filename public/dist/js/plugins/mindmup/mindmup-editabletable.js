$.fn.editableTableWidget=function(a){"use strict";return $(this).each(function(){var b,c=function(){var a=$.extend({},$.fn.editableTableWidget.defaultOptions);return a.editor=a.editor.clone(),a},d=$.extend(c(),a),e=37,f=38,g=39,h=40,i=13,j=27,k=9,l=$(this),m=d.editor.css("position","absolute").hide().appendTo(l.parent()),n=function(a){b=l.find("td:focus"),b.length&&(m.val(b.text()).removeClass("error").show().offset(b.offset()).css(b.css(d.cloneProperties)).width(b.width()).height(b.height()).focus(),a&&m.select())},o=function(){var a,c=m.val(),d=$.Event("change");return b.text()===c||m.hasClass("error")?!0:(a=b.html(),b.text(c).trigger(d,c),void(d.result===!1&&b.html(a)))},p=function(a,b){return b===g?a.next("td"):b===e?a.prev("td"):b===f?a.parent().prev().children().eq(a.index()):b===h?a.parent().next().children().eq(a.index()):[]};m.blur(function(){o(),m.hide()}).keydown(function(a){if(a.which===i)o(),m.hide(),b.focus(),a.preventDefault(),a.stopPropagation();else if(a.which===j)m.val(b.text()),a.preventDefault(),a.stopPropagation(),m.hide(),b.focus();else if(a.which===k)b.focus();else if(this.selectionEnd-this.selectionStart===this.value.length){var c=p(b,a.which);c.length>0&&(c.focus(),a.preventDefault(),a.stopPropagation())}}).on("input paste",function(){var a=$.Event("validate");b.trigger(a,m.val()),a.result===!1?m.addClass("error"):m.removeClass("error")}),l.on("click keypress dblclick",n).css("cursor","pointer").keydown(function(a){var b=!0,c=p($(a.target),a.which);c.length>0?c.focus():a.which===i?n(!1):17===a.which||91===a.which||93===a.which?(n(!0),b=!1):b=!1,b&&(a.stopPropagation(),a.preventDefault())}),l.find("td").prop("tabindex",1),$(window).on("resize",function(){m.is(":visible")&&m.offset(b.offset()).width(b.width()).height(b.height())})})},$.fn.editableTableWidget.defaultOptions={cloneProperties:["padding","padding-top","padding-bottom","padding-left","padding-right","text-align","font","font-size","font-family","font-weight","border","border-top","border-bottom","border-left","border-right"],editor:$("<input>")};