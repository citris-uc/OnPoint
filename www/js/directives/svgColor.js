angular.module('app.controllers').directive("svgColor",  ["$timeout", function($timeout) {
  return {
    restrict: "A",
    scope: {
      color: "="
    },
    link: function(scope, element, attrs) {

      attrs.$observe('ngSrc', function(imgURL, oldVal){

        if (imgURL) {
          var $img = jQuery(element);
          var data = $img.parent().find(".svgobject").load(imgURL);

          var $svg = jQuery(data).find('svg');

          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr('xmlns:a');

          $img.css("display", "none")
          $svg.css("display", "inline")

          // Replace image with new SVG
          // $img.replaceWith($svg);
        }
      });

      $timeout( function(){
        $(".svgobject").each(function(index, svgobj) {
          $(svgobj).find("g").css("fill", svgobj.style.color )
        });
      }, 500 );
    }
  }
}]);
