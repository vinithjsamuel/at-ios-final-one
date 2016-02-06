function addTag(name, attributes, sync) {var el = document.createElement(name), attrName; for (attrName in attributes) {el.setAttribute(attrName, attributes[attrName]); } sync ? document.write(outerHTML(el)) : headEl.appendChild(el); };
/*addbase*/var indexFile = (location.pathname.match(/\/(index[^\.]*\.html)/) || ['', ''])[1],rUrl = /(#!\/|api|guide|misc|tutorial|error|index[^\.]*\.html).*$/, baseUrl = location.href.replace(rUrl, indexFile), production = location.hostname === 'www.dansysgroup.com', headEl = document.getElementsByTagName('head')[0], sync = true;addTag('base', {href: baseUrl});
/*initiate angular*/var danap = angular.module('ngDanApp', ['ngRoute', 'ngAnimate']);
danap.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/warranty', {
        templateUrl: 'template/checkwar.html',
        controller: 'WarrantyCtrl',
        controllerAs: 'warranty'
      })
      .when('/warranty/:slno', {
        templateUrl: 'template/warview.html',
        controller: 'WarrantyCtrl',
        controllerAs: 'warranty'
      })
      .when('/Book/:bookId', {
        templateUrl: 'book.html',
        controller: 'BookCtrl',
        controllerAs: 'book'
      })
      .when('/Book/:bookId/ch/:chapterId', {
      	templateUrl: 'book.html',
        controller: 'BookCtrl',
        controllerAs: 'book'
      }).otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
}]);

danap.directive('toucharea', ['$touch', function($touch){
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;  
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

danap.controller('MainCtrl', ['$route', '$routeParams', '$location','$scope','$rootScope',
  function($route, $routeParams, $location, $scope, $rootScope) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
    this.$scope = $scope;
    this.$scope.home = {loc:this.$location.path()};
}]);

danap.controller('BookCtrl', ['$routeParams','$location','$scope','$rootScope', function($routeParams, $location, $scope, $rootScope) {
  this.name = "BookCtrl";
  this.params = $routeParams;
}]);

danap.controller('HomeCtrl', ['$routeParams','$location','$scope','$rootScope', function($routeParams, $location, $scope, $rootScope) {
  this.name = "HomeCtrl";
  this.params = $routeParams;
}]);

danap.controller('WarrantyCtrl', ['$routeParams','$location','$scope', function($routeParams,$location,$scope) {
  this.name = "WarrantyCtrl";
  this.params = $routeParams;
  $scope.war = {};
  $scope.check = function(){
    if($scope.war.ename && $scope.war.slno){
      $location.path('warranty/123456');return false;
    }else{
      return false;
    }
  }
}]);
/*jquery custom fns*/
var danjq = jQuery.noConflict();
danjq(document).ready(function() {
  setTimeout(function() {
    danjq('#homecontainer').css('top',danjq('#homefixeddiv').height()+'px').fadeTo( "slow" , 1, function() {
    // Animation complete.
    });
  }, 1000);
});