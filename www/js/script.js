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



var pushapp = {
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
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        pushapp.receivedEvent('deviceready');
    },
    tokenHandler:function(msg) {
    	atsavetodb(msg);
    	console.log("Token Handler " + msg);
    	alert(JSON.stringify(msg));
    },
    errorHandler:function(error) {
        console.log("Error Handler  " + error);
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        alert('Success! Result = '+result);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	if(PushbotsPlugin.isiOS()){
			PushbotsPlugin.initializeiOS("565431621779599c3a8b4568");
			alert('pushbot works ios');
		}
		if(PushbotsPlugin.isAndroid()){
			PushbotsPlugin.initializeAndroid("565431621779599c3a8b4568", "284777660095");
			alert('pushbot works android');
		}
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(this.tokenHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"pushapp.onNotificationAPN"});
    },
    // iOS
    onNotificationAPN: function(event) {
        var pushNotification = window.plugins.pushNotification;
        console.log("Received a notification! " + event.alert);
        console.log("event sound " + event.sound);
        console.log("event badge " + event.badge);
        console.log("event " + event);
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }
        if (event.badge) {
            console.log("Set badge on  " + pushNotification);
            pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
    },
    // Android
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    alert('registration id = '+e.regid);
                }
            break;

            case 'message':
              // this is the actual push notification. its format depends on the data model
              // of the intermediary push server which must also be reflected in GCMIntentService.java
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;

            case 'error':
              alert('GCM error = '+e.msg);
            break;

            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }

};
pushapp.initialize();
function atsavetodb(regid){
    $.post("http://aesthetictoday.com/ajax/android/pushnotification.php",{ios_insert_regid: regid}, function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
}