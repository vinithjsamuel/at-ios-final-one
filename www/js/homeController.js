app.controller('homeController',function($rootScope, $scope, $http,$location,$routeParams,apiFactory,$cookies,$cookieStore,$timeout)
{
	$rootScope.loading = true;
	
	$rootScope.loadatdeals = function(){
		apiFactory.fetchDeals(function(data){
			$rootScope.loading = true;
			if(data=='error'){
				$timeout(function(){
					$rootScope.loading = true;
					$rootScope.loadatdeals();
				},2000);
			}else{
				 $rootScope.loading = false;
				 $rootScope.deals=data.deals;
				 var data={};
				 data['deals']=$rootScope.deals;
				 if($rootScope.loadDealsTrigger==1)
				 {
					 $rootScope.$broadcast('$getDeals',data);
				 }
				 if($rootScope.dealDetailTrigger==1)
				 {
					 var result = $.grep($rootScope.deals, function(e){ return e.post_name == $routeParams.deal_name; });
					 if(result.length!=0)
					 {
						 var deal=result[0];
						 $rootScope.$broadcast('$getDealdetails',deal);
					 }
				 }
			}
		})
	}

	$rootScope.loadatcategories = function(){
		apiFactory.getCats(function(data){
			if(data=='error'){
				$timeout(function(){
					$rootScope.loadatcategories();
				},2000);
			}else{
				 $rootScope.loading = false;
				 $rootScope.categories=data.product_category;
			}
		  });
	}

	$rootScope.atShowAnimate = true;
	$scope.loadDealsDelayValue = 5;
	$scope.loadDealsDelay = function(){
		if(!$rootScope.loading){
			$timeout(function(){
				if($scope.loadDealsDelayValue<80){
					$scope.loadDealsDelayValue = 5+$scope.loadDealsDelayValue;
				}
				if($rootScope.deals==null)
				{
					if(document.getElementById('progressbar'))
						document.getElementById('progressbar').style.width=$scope.loadDealsDelayValue+'%';
					$scope.loadDealsDelay();
				}else{
					if(document.getElementById('progressbar'))
						document.getElementById('progressbar').style.width="100%";
					$timeout(function(){
						$rootScope.atShowAnimate = false;
					},500);
				}
			},800);
		}else{
			$timeout(function(){
				$scope.loadDealsDelay();
			},600);
		}
	}

	$scope.checkForDealLoad = function(){
		if($rootScope.deals==null){
			$timeout(function(){
				$scope.checkForDealLoad();
			},1500);
		}else{
			if(document.getElementById('progressbar'))
				document.getElementById('progressbar').style.width="100%";
			$timeout(function(){
				$rootScope.atShowAnimate = false;
			},500);
		}
	}

	if($rootScope.deals==null)
	{
		$rootScope.loadatdeals();
		$scope.loadDealsDelay();
		$scope.checkForDealLoad();
	}else{
		$rootScope.atShowAnimate = false;
	}
	
	if($rootScope.categories==null)
	{
		$timeout(function(){
			$rootScope.loadatcategories();
		},4000);
	}
})