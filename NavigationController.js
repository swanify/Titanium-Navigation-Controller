var navigationController = {};
navigationController.windowStack = [];
navigationController.navGroup = {};

(function(){
	navigationController.open = function(windowToOpen){
		//add the window to the stack of windows managed by the controller
		navigationController.windowStack.push(windowToOpen);
	
		//grab a copy of the current nav controller for use in the callback
		var that = this;
		//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
		windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
	
		//This is the first window
		if(navigationController.windowStack.length === 1) {
			if(Ti.Platform.osname === 'android') {
				windowToOpen.exitOnClose = true;
				windowToOpen.open();
			} else {
				navigationController.navGroup = Ti.UI.iPhone.createNavigationGroup({
					window : windowToOpen
				});
				var containerWindow = Ti.UI.createWindow();
				containerWindow.add(navigationController.navGroup);
				containerWindow.open();
			}
		}
		//All subsequent windows
		else {
			if(Ti.Platform.osname === 'android') {
				windowToOpen.open();
			} else {
				navigationController.navGroup.open(windowToOpen);
			}
		}
	};
	navigationController.home = function(windowToOpen){
		//store a copy of all the current windows on the stack
		var windows = navigationController.windowStack.concat([]);
		for(var i = 1, l = windows.length; i < l; i++) {
			(navigationController.navGroup) ? navigationController.navGroup.close(windows[i]) : windows[i].close();
		}
		navigationController.windowStack = [navigationController.windowStack[0]]; //reset stack
		
		Ti.API.info(navigationController.windowStack);
	};
	navigationController.back = function(w){
		//store a copy of all the current windows on the stack
		if(Ti.Platform.osname === 'android') {
			w.close();
		}else{
			navigationController.navGroup.close(w);
		}
	};
})();

