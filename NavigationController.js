exports.NavigationController = function() {
	this.windowStack = [];
	this.theCurrentWindow = null;
	this.platformName = Ti.Platform.osname;
};

exports.NavigationController.prototype.open = function(/*Ti.UI.Window*/windowToOpen) {
	
	var windows = this.windowStack.concat([]);
	
	if(windows.length === 0 && this.theCurrentWindow != null) {
		this.windowStack.push(this.theCurrentWindow);
	}
	
	//add the window to the stack of windows managed by the controller
	this.windowStack.push(windowToOpen);
	this.theCurrentWindow = windowToOpen;
	
	var windows = this.windowStack.concat([]);

	//grab a copy of the current nav controller for use in the callback
	var that = this;
	windowToOpen.addEventListener('close', function() {
		that.windowStack.pop();
	});

	//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
	windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;

	//This is the first window
	if(this.windowStack.length === 1) {

		if(this.platformName === 'android') {
			windowToOpen.exitOnClose = true;
			windowToOpen.open();
		} else {
			this.navGroup = Ti.UI.iPhone.createNavigationGroup({
				window : windowToOpen
			});
			var containerWindow = Ti.UI.createWindow();
			containerWindow.add(this.navGroup);
			containerWindow.open();
		}
	}
	//All subsequent windows
	else {
		if(this.platformName === 'android') {
			windowToOpen.open();
		} else {
			this.navGroup.open(windowToOpen);
		}
	}
};

//go back to the initial window of the NavigationController
exports.NavigationController.prototype.home = function() {
	//store a copy of all the current windows on the stack
	var windows = this.windowStack.concat([]);

	for(var i = 1, l = windows.length; i < l; i++) {
		if(this.platformName == 'android') {
			windows[i].close();
		}else{
			this.navGroup.close(this.windowStack[i]);
		}
	}
	this.theCurrentWindow = this.windowStack[0];
	this.windowStack = []; //reset stack
	this.windowStack.push(this.theCurrentWindow);

	
};

exports.NavigationController.prototype.back = function(w){
	//store a copy of all the current windows on the stack
	if(Ti.Platform.osname === 'android') {
		w.close();
	}else{
		var win = Titanium.UI.currentWindow;
		this.navGroup.close(this.windowStack[this.windowStack.length -1]);
	}
};
