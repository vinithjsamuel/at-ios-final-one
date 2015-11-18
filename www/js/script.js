var site_url="http://aesthetictoday.com";
var _wpcf7 = {"loaderUrl":site_url+"/wp-content\/plugins\/contact-form-7\/images\/ajax-loader.gif","sending":"Sending ..."};
if (window.location.protocol == "https:")
{
	site_url="https://aesthetictoday.com";
}

var windowWidth=0,windowHeight=0;

var AesthticMobile={
	windowResize:function()
	{
		if(windowWidth<=600)
		{
			$(".clsMobileDeals .clsDealTimeLeft").addClass('clearfix');
			$(".genPopupNoBorder").addClass("scrollable");
			$(".clsDealOptionCon").addClass("scrollable-content");
			
		}
		else
		{
			$(".clsMobileDeals .clsDealTimeLeft").removeClass('clearfix');
			$(".genPopupNoBorder").removeClass("scrollable");
			$(".clsDealOptionCon").removeClass("scrollable-content");
		}
	},
	loadContactFrmJs:function($scripts,callback){
		var ajaxes = [],
		loaded_scripts =[];		
		if($scripts.length)
		{
			 for (i=0;i<$scripts.length;i++)	
			 {
				var index=i;
				
				var src = $scripts[i];
				
				if (src) {
					ajaxes.push(jQuery.get(src, null, function (data) {
						loaded_scripts[index] = data;
					}, "html"));
				}
			 }			 
			jQuery.when.apply(null, ajaxes)
			.always(function () {
					for (var i in loaded_scripts) {
						try {
							jQuery.globalEval(loaded_scripts[i]);
						} catch (e) {}
					}
					callback();
			});
		}
	},
	closeOverlay:function(){
		window.location='#';
	}
}
$(document).ready(function(e) {
	vinapp.initialize();
	windowWidth=$(window).width();
	windowHeight=$(window).height();
	AesthticMobile.windowResize();
	window.onresize = function(event) {
		windowWidth=$(window).width();
		windowHeight=$(window).height();
		AesthticMobile.windowResize();
	}
	var prevCon="#buyRegisterFrmCon";
	/*to open and close sidebar submenu*/
	$(document).on('click','#myAccountDropdown a.dropdown-toggle',function(){
		if($('body.has-sidebar-left').hasClass('sidebar-left-in')){
			//
		}
		else{
			$('body.has-sidebar-left').addClass('sidebar-left-in');
		}
	});
	$(document).on('click','#myAccountDropdown ul li',function(){
		if($('body.has-sidebar-left').hasClass('sidebar-left-in')){
			$('body.has-sidebar-left').removeClass('sidebar-left-in');
		}
	});
	$(document).on('click','.list-group > a.list-group-item',function(){
		if($('body.has-sidebar-left').hasClass('sidebar-left-in')){
			$('body.has-sidebar-left').removeClass('sidebar-left-in');
		}
	});

	$(document).on('click','.clsHaveAccount a',function(e){
		e.preventDefault();
		//console.log();
		var currentCon=$(this).attr("data-href");
		$(prevCon).fadeOut(1000,function(){
			prevCon	=currentCon;
			$(currentCon).fadeIn();
		});
		return false;
	})
	
});

var vinapp = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	vinapp.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	var client = new Apigee.Client({
    		orgName:"aesthetictoday",
    		appName:"aesthetictoday",
    		logging:true
	    });
    	var pushNotification = window.plugins.pushNotification;
    	var isdevice = navigator.userAgent.toLowerCase();
		var isAndroid = isdevice.indexOf("android") > -1;
		if(isAndroid) {
    		pushNotification.register(function(result) {console.log('Callback Success! Result = '+result);}, function(error) {console.log(error);},{"senderID":"284777660095","ecb":"vinapp.onNotificationGCM"});
    	}else{
    		pushNotification.register(
			    function(result) {
			    	atsavetodb(result);
			    	var options = {
	                    notifier:"AestheticToday",
	                    deviceToken:result
	                };
	                client.registerDevice(options, function(error, result){
	                	if(error) {
	                		alert('line144'+JSON.stringify(error));
	                		console.log(error);
	                	} else {
	                		alert('line147'+JSON.stringify(result));
	                		console.log(result);
	                		sendpushtoatdevice();
	                	}
	                });
			    	console.log('Callback Success! Result = '+result);
			    },
			    function(error) {console.log(error);},
			    {
			        "badge":"true",
			        "sound":"true",
			        "alert":"true",
			        "ecb":"vinapp.onNotificationAPN"
			    }
			);
    		/*pushNotification.register(function(result) {console.log('Callback Success! Result = '+result);atsavetodb(result);}, function(error) {console.log(error);},{"badge":"true","sound":"true","alert":"true","ecb":"vinapp.onNotificationAPN"});*/
    	}
    },
    onNotificationAPN: function(event) {
    	alert('line166'+JSON.stringify(event));
    	if ( event.alert )
	    {
	        navigator.notification.alert(event.alert);
	    }

	    if ( event.sound )
	    {
	        var snd = new Media(event.sound);
	        snd.play();
	    }

	    if ( event.badge )
	    {
	        pushNotification.setApplicationIconBadgeNumber(
	        	function successHandler (result) {
				    alert('result 160 = ' + result);
				},
	        	function errorHandler (error) {
				    alert('error 163 = ' + error);
				},
	        	event.badge
	        );
	    }else{
	    	pushNotification.setApplicationIconBadgeNumber(
	    		function successHandler (result) {
				    alert('result 170 = ' + result);
				},
	        	function errorHandler (error) {
				    alert('error 174 = ' + error);
				},
	        	1
	    	);
	    }
    },

    onNotificationGCM: function(e) {
    	alert('Success onNotificationGCM');
    	switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    alert("Regid " + e.regid);
                    /*atsavetodb(e.regid);*/
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              /*alert('message = '+e.message+' msgcnt = '+e.msgcnt+' Title'+e.payload.title);*/
              if(e.payload.redirecturl){
              	localStorage.setItem('push_redirecturl',e.payload.redirecturl);
              }
              navigator.notification.alert(e.message,function(){},e.payload.title,'Ok');
            break;
 
            case 'error':
              console.log('GCM error = '+e.msg);
            break;
 
            default:
              console.log('An unknown GCM event has occurred');
              break;
        }
    }

};

function atsavetodb(regid){
    $.post("http://aesthetictoday.com/ajax/android/pushnotification.php",{ios_insert_regid: regid}, function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
}


function sendpushtoatdevice(){
	alert('sendpushtoatdevice fn');
	setTimeout(function() {
		alert(client.getDeviceUUID());
		var devicePath = "devices/"+client.getDeviceUUID()+"/notifications";
		alert(devicePath);
		var options = {
			notifier:"AestheticToday",
			path:devicePath,
			message:"hello world from JS"
		};
		client.sendPushToDevice(options, function(error, data){
			if(error) {
				alert(JSON.stringify(error));
				console.log(error);
			} else {
				alert(JSON.stringify(data));
				console.log("push sent");
			}
		});
	}, 5000);
}