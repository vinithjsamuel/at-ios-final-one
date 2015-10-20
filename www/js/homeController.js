app.controller('homeController',function($rootScope, $scope, $http,$location,$routeParams,apiFactory,$cookies,$cookieStore,$timeout)
{
	$rootScope.loading = true;
	
	$rootScope.loadatdeals = function(){
		apiFactory.fetchDeals(function(data){
			if(data=='error'){
				$timeout(function(){
					$rootScope.loadatdeals();
				},2000);
			}else{
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
				console.log('cateogry loads');
				$timeout(function(){
					$rootScope.loadatcategories();
				},2000);
			}else{
				 $rootScope.loading = false;
				 $rootScope.categories=data.product_category;
			}
		  });
	}

	if($rootScope.deals==null)
	{
		$rootScope.loadatdeals();
	}
	
	if($rootScope.categories==null)
	{
		$timeout(function(){
			$rootScope.loadatcategories();
		},4000);
	}
})