app.controller('userAccountController',function($rootScope, $scope, $http, $location, $routeParams, apiFactory, $cookies, $cookieStore,$timeout){
	$rootScope.loading = true;

    $scope.accountinfoload = function(){
        $scope.emiratesOption = null;
        $scope.atUpdateUsr = {};
        $scope.atUpdateUsr.resMessage = [];
        $scope.atbillingAdrUpdate = {};
        $scope.atbillingAdrUpdate.resMessage = [];
        $scope.atEmailPreUpdate = {};
        $scope.atEmailPreUpdate.resMessage = [];
        $scope.UpdateUsrFrm = 0;
        $scope.UpdateAddFrm = 0;
        $scope.UpdatePwdFrm = 0;
        $scope.UpdateEmailPreFrm = 0;
        $scope.atChangePassword = {};
        /*$rootScope.emirates = $cookieStore.get('emirates');
        $scope.emiratesOption = $rootScope.emirates;*/
        if (typeof $cookieStore.get('userdata') != undefined) {
            $scope.atUpdateUsr = $rootScope.userdata;
            $scope.atUpdateUsr.first_name = $rootScope.userdata.at_first_name;
            $scope.atUpdateUsr.last_name = $rootScope.userdata.at_last_name;
            if ($rootScope.userdata != null) {
                $scope.atbillingAdrUpdate.aes_address_one = $rootScope.userdata._aes_address_one;
                $scope.atbillingAdrUpdate.aes_address_two = $rootScope.userdata._aes_address_two;
                $scope.atbillingAdrUpdate.aes_address_emirate = $rootScope.userdata._aes_address_emirate;
                $("#aes_address_emirate").val($rootScope.userdata._aes_address_emirate);
                $scope.atbillingAdrUpdate.aes_address_pin = $rootScope.userdata._aes_address_pin;
                $scope.atEmailPreUpdate.at_user_subscribed_city = $rootScope.userdata.at_user_subscribed_city;
                $("#at_user_subscribed_city").val($rootScope.userdata.at_user_subscribed_city);
                if ($rootScope.userdata.at_subscribe_news_letter == undefined){
                    $scope.atEmailPreUpdate.at_subscribe_news_letter = 4;
                }
                else $scope.atEmailPreUpdate.at_subscribe_news_letter = $rootScope.userdata.at_subscribe_news_letter;
            }
            $scope.atUpdateUsr.resMessage = [];
        }
    }

    	
	if($rootScope.userdata && $rootScope.userdata!=undefined){
		if($cookieStore.get('userdata')==undefined){
			$http.get(site_url + '/ajax/aesthetic_wp_load_json.php?platform=mobile&getusermetainfobyid=yes&userid='+$rootScope.userdata.ID)
			.success(function(data, status, headers, config) {
				if(data && data!=""){
					var datakeys = Object.keys(data);
					var i = 0;
					for(i=0;i<datakeys.length;i++){
						$rootScope.userdata[datakeys[i]]=data[datakeys[i]][0];
					}
					$cookieStore.put('userdata', $rootScope.userdata);
					$rootScope.loading = false;
					$scope.accountinfoload();
				}
			}).error(function(data, status, headers, config) {
				$rootScope.loading = false;
				alert('Error Accessing Network!')
				$location.url('deals/all');
			});
		}else{
			$rootScope.loading = false;
			$rootScope.userdata = $cookieStore.get('userdata');
			$scope.accountinfoload();
		}
	}else{
		$rootScope.loading = false;
		$location.url('login');
	}

	$scope.changePasswordForm = function() {
        if($rootScope.userdata.ID!=null && $rootScope.userdata.ID!=undefined){
            var user_id = $rootScope.userdata.ID;
        }else{
            var user_id = 0;
        }
        var oldPassword = $scope.atChangePassword.passwordField;
        var newPassword = $scope.atChangePassword.newPasswordField;
        var confirmNewPassword = $scope.atChangePassword.confirmNewPasswordField;
        $scope.changePwdResField = [];
        if (newPassword !== confirmNewPassword) {
            $scope.changePwdResField[0] = {
                msgType: 'alert-error',
                msg: 'Passwords do not match'
            };
            return false
        } else {
            if($rootScope.userdata.user_login!=undefined || $rootScope.userdata.user_login!=null){
                var user_login = $rootScope.userdata.user_login;
            }
            $scope.UpdatePwdFrm = 1;
            $http({
                method: 'POST',
                data: {
                    mobile: 'yes',
                    oldPassword: oldPassword,
                    new_password: newPassword,
                    confirmNewPassword: confirmNewPassword,
                    user_id:user_id,
                    user_login:user_login,
                    update_user_password: 'yes',
                    action: 'my_front_end_action'
                },
                url: site_url + '/mobile_api.php'
            }).success(function(data) {
                if (data.error) {
                    $scope.changePwdResField[0] = {
                        msgType: 'alert-error',
                        msg: data.error.message
                    }
                }
                if (data.success) {
                    $scope.changePwdResField[0] = {
                        msgType: 'alert-success',
                        msg: data.success.message
                    };
                    if(data.success.user_detail && data.success.user_detail.user_pass!=null){
                        $rootScope.userdata.user_pass = data.success.user_detail.user_pass;
                        $cookieStore.put('userdata', $rootScope.userdata);
                    }
                }
                $scope.atChangePassword = null;
                $scope.UpdatePwdFrm = 0
            })
        }
    };
    $scope.updateAddressForm = function() {
    	if($rootScope.userdata.ID!=null && $rootScope.userdata.ID!=undefined){
            var user_id = $rootScope.userdata.ID;
        }else{
            var user_id = 0;
        }
        var address_1 = $scope.atbillingAdrUpdate.aes_address_one;
        var address_2 = $scope.atbillingAdrUpdate.aes_address_two;
        var city = $scope.atbillingAdrUpdate.aes_address_emirate;
        var po_box = $scope.atbillingAdrUpdate.aes_address_pin;
        $scope.UpdateAddFrm = 1;
        $scope.atbillingAdrUpdate.resMessage = [];
        $http({
            method: 'POST',
            data: {
                mobile: 'yes',
                address_1: address_1,
                address_2: address_2,
                city: city,
                po_box: po_box,
                update_address: 'yes',
                user_id:user_id,
                action: 'my_front_end_action'
            },
            url: site_url + '/mobile_api.php'
        }).success(function(data) {
            if (data.success) {
                $scope.atbillingAdrUpdate.resMessage[0] = {
                    msgType: 'alert-success',
                    msg: data.success.message
                };
                $scope.UpdateAddFrm = 0;
                $rootScope.userdata._aes_address_one = address_1;
                $rootScope.userdata._aes_address_two = address_2;
                $rootScope.userdata._aes_address_emirate = city;
                $rootScope.userdata._aes_address_pin = po_box;
                $cookieStore.put('userdata', $rootScope.userdata);
            }
        })
    };
    $scope.updateUserForm = function() {
        if($rootScope.userdata.ID!=null && $rootScope.userdata.ID!=undefined){
            var user_id = $rootScope.userdata.ID;
        }else{
            var user_id = 0;
        }
        var first_name = $scope.atUpdateUsr.first_name;
        var nationality = $scope.atUpdateUsr.nationality;
        var gender = $scope.atUpdateUsr.gender;
        var last_name = $scope.atUpdateUsr.last_name;
        var contact_mobile = $scope.atUpdateUsr.contact_mobile;
        $scope.UpdateUsrFrm = 1;
        $scope.atUpdateUsr.resMessage = [];
        $http({
            method: 'POST',
            data: {
                mobile: 'yes',
                user_id:user_id,
                first_name: first_name,
                last_name: last_name,
                gender: gender,
                nationality: nationality,
                contact_mobile: contact_mobile,
                update_registration: 'yes',
                action: 'my_front_end_action'
            },
            url: site_url + '/mobile_api.php'
        }).success(function(data) {
            if (data.success) {
                $scope.atUpdateUsr.resMessage[0] = {
                    msgType: 'alert-success',
                    msg: data.success.message
                };
                $rootScope.userdata.nationality = nationality;
                $rootScope.userdata._aes_contact = contact_mobile;
                $rootScope.userdata.at_first_name = first_name;
                $rootScope.userdata.at_last_name = last_name;
                $rootScope.userdata.at_user_gender = gender;
                $cookieStore.put('userdata', $rootScope.userdata);
            }
            $scope.UpdateUsrFrm = 0;
        })
    };
    $scope.updateEmailPreferences = function() {
        if($rootScope.userdata.ID!=null && $rootScope.userdata.ID!=undefined){
            var user_id = $rootScope.userdata.ID;
        }else{
            var user_id = 0;
        }
        var emailpreferences = $scope.atEmailPreUpdate.at_subscribe_news_letter;
        var subscribe_city = $scope.atEmailPreUpdate.at_user_subscribed_city;
        $scope.UpdateEmailPreFrm = 1;
        $scope.atEmailPreUpdate.resMessage = [];
        $http({
            method: 'POST',
            data: {
                mobile: 'yes',
                user_id:user_id,
                emailpreferences: emailpreferences,
                subscribe_city: subscribe_city,
                email_preferences: 'yes',
                action: 'my_front_end_action'
            },
            url: site_url + '/mobile_api.php'
        }).success(function(data) {
            if (data.success) {
                $scope.atEmailPreUpdate.resMessage[0] = {
                    msgType: 'alert-success',
                    msg: data.success.message
                };
                $rootScope.userdata.at_user_subscribed_city = subscribe_city;
                $rootScope.userdata.at_subscribe_news_letter = emailpreferences;
                $cookieStore.put('userdata', $rootScope.userdata);
            }
            $scope.UpdateEmailPreFrm = 0;
        })
    }
})
app.controller('myPurchaseController',function($rootScope,$scope,$http,$location,$routeParams,apiFactory,$cookies,$cookieStore){
	$scope.userPurchase=null;
	if($scope.userPurchase==null && $rootScope.userdata.ID){
		$rootScope.loading = true;
        var user_id = $rootScope.userdata.ID;
        $http({
            method: 'POST',
            data: {
                mobile: 'yes',
                userPurchase: 'yes',
                user_id:user_id
            },
            url: site_url + '/mobile_api.php'
            }).success(function(data) {
                if(data.success){
                    $scope.userPurchase=data.success.userPurchase;
                    $rootScope.loading = false
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loading = false;
                alert('Error Accessing Network!')
                $location.url('deals/all');
            });
	}
})