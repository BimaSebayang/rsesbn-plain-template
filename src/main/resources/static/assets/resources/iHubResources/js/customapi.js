// login functions
function login() {
	// loginForm = form;
	var userid = '';
	var pwd = '';
	actuate.authenticate(iportalURL, getReqOpts(), userid, pwd, null,
			authCallback, loginerrcallback);
}
function authCallback() {
	window.location = landingPage;
}

function loginerrcallback(exception) {
	loginForm.password.value = "";
	alert("The user name or password you entered is incorrect");
	// alert(exception.getMessage());
}

// logout functions
function logout() {
	actuate.logout(iportalURL, getReqOpts(), logoutCallback, logouterrcallback);
}

function logoutCallback() {
	window.location = logoutPage;
}

function logouterrcallback(exception) {
	alert(exception.getMessage());
}

// RequestOptions
function getReqOpts() {
	var reqOps = new actuate.RequestOptions();
	reqOps.setRepositoryType(actuate.RequestOptions.REPOSITORY_ENCYCLOPEDIA);
	reqOps.setVolume(volumeName);
	return reqOps;
}

// Load Report content
function initReport(userID, pwd) {
	// login();

	// reportName= '/Applications/Account Statement/Report Designs/Account
	// Statement.rptdesign';
	rptName = '/Applications/Account Statement/Report Designs/Account Statement.rptdesign';
	eIV = false;
	toolBar = null;
	wd = null;
	ht = null;
	// userID='administrator';
	// pwd='P@ssw0rd';
	if (isNaN(wd) || typeof (wd) == "undefined" || wd == null)
		rptWd = "1200";
	else
		rptWd = wd;

	if (isNaN(ht) || typeof (ht) == "undefined" || ht == null)
		rptHt = "1400";
	else
		rptHt = ht;
	actuate.load("viewer");
	if (userID.length <= 4)
		actuate.initialize(iportalURL, getReqOpts(), null, null,
				reportCallback, reportErrCallback);
	else {
		// alert("Entered with userID:" + userID);
		if (pwd.length <= 4)
			actuate.initialize(iportalURL, getReqOpts(), userID, null,
					reportCallback, reportErrCallback);
		else
			actuate.initialize(iportalURL, getReqOpts(), userID, pwd,
					reportCallback, reportErrCallback);
	}
}

function reportCallback() {
	// actuViewer = new actuate.Viewer("reportpane");
	actuViewer = new actuate.Viewer("dashboardpane");
	var uioptions = new actuate.viewer.UIOptions();
	actuViewer.setUIOptions(uioptions);

	if (isNaN(toolBar) || typeof (toolBar) == "undefined" || toolBar == null
			|| toolBar == true)
		uioptions.enableToolBar(true);
	else
		uioptions.enableToolBar(false);

	if (rptName.includes("/"))
		actuViewer.setReportName(rptName);
	else
		actuViewer.setReportName(rptPath + rptName);
	// actuViewer.setWidth(parseInt(rptWd));
	// actuViewer.setHeight(parseInt(rptHt));
	actuViewer.setWidth(window.innerWidth - 20);
	actuViewer.setHeight(window.innerHeight - 60);
	if (!eIV || eIV == "true")
		actuViewer.submit(function() {
			actuViewer.enableIV();
		});
	else
		actuViewer.submit();
}

function reportErrCallback(exception) {
	alert(exception.getMessage());
}

// Load Dashboard Content
function initDashBoard(userID, pwd, iportalURL) {
	dsbName = 'Customer_Analysis';
	wd = 1400;
	ht = 1600;
	edit = false;
	showTab = true;;
	if (isNaN(wd) || typeof (wd) == "undefined" || wd == null)
		dsbWd = '1200';
	else
		dsbWd = wd;

	if (isNaN(ht) || typeof (ht) == "undefined" || ht == null)
		dsbHt = '1400';
	else
		dsbHt = ht;

	if (!edit || edit == "true")
		editDashboard = edit;
	else
		editDashboard = "false";

	if (!showTab || showTab == "false")
		showTabNav = showTab;
	else
		showTabNav = "true";

	actuate.load("dashboard");

	if (userID.length <= 4)
		actuate.initialize(iportalURL, getReqOpts(), null, null,
				dashBoardCallback, dashBoardErrCallback);
	else {
		// alert("Entered with userID:" + userID);
		if (pwd.length <= 4)
			actuate.initialize(iportalURL, getReqOpts(), userID, null,
					dashBoardCallback, dashBoardErrCallback);
		else
			actuate.initialize(iportalURL, getReqOpts(), userID, pwd,
					dashBoardCallback, dashBoardErrCallback);
	}

}

function dashBoardCallback() {
	var dash = new actuate.Dashboard("dashboardpane");
	// alert(dsbName.includes("/"));
	if (dsbName.includes("/"))
		dash.setDashboardName(dsbName + ".dashboard");
	else
		dash.setDashboardName(dsbpath + dsbName + ".dashboard");

	if (editDashboard == "" || editDashboard == "false")
		dash.setIsDesigner(false);
	else
		dash.setIsDesigner(true);

	if (showTabNav == "false")
		dash.showTabNavigation(false);
	else
		dash.showTabNavigation(true);

	// dash.setWidth(parseInt(dsbWd));
	// dash.setHeight(parseInt(dsbHt));
	dash.setWidth(window.innerWidth - 20);
	dash.setHeight(window.innerHeight - 60);
	dash.submit(function() {
		$("button:contains('Hide')").click();
	});
}

function dashBoardErrCallback(exception) {
	alert(exception.getMessage());
}

// Retreive the file list from report explorer
function initReportExplr(userID, pwd) {
	// debugger;
	// reportName = '/Applications/Account Statement/Report Designs/Account
	// Statement';
	actuate.load("executereport");
	actuate.load("viewer");
	actuate.load("parameter");
	actuate.initialize(iportalURL, getReqOpts(), userID, pwd, rptExplrCallback,
			rptExplrErrCallback);
}

function rptExplrCallback() {
	var reportExplorer = new actuate.ReportExplorer();
	reportExplorer.setResultDef([ "Name", "FileType", "TimeStamp", "Version" ]);
	reportExplorer.setSearch(setFileSearch());
	reportExplorer.getFolderItems(rptPath, getReportList);
}

function rptExplrErrCallback(exception) {
	alert(exception.getMessage());
}

function setFileSearch() {
	var fileSearch = new actuate.reportexplorer.FileSearch();
	var filterArr = new Array();
	var fileCondition = new actuate.reportexplorer.FileCondition();
	fileCondition.setField("FileType");
	fileCondition.setMatch("rptdesign");
	filterArr.push(fileCondition);
	fileSearch.setConditionArray(filterArr);
	return fileSearch;
}

function getReportList(folderItems, folder) {
	files = [];
	for (var i = 0; i < folderItems.getItemList().length; i++) {
		files.push([]);
		files[i].push(new Array(3));
		fileName = folderItems.getItemList()[i].getName();
		modDate = folderItems.getItemList()[i].getTimeStamp()
		files[i][0] = fileName.substring(0, fileName.indexOf("."));
		files[i][1] = folderItems.getItemList()[i].getVersion();
		files[i][2] = modDate.substring(0, modDate.indexOf("T"));
	}
	reportList(files);
}

function reportList(files) {
	var rowCount = files.length;
	var tbl = "<table class=\"tblAltCol\">";
	tbl += "<tr><td>List of Reports</td><td style=\"text-align:center;\"> Modified Date</td><td style=\"text-align:center;\"> Version</td></tr>";
	for (var i = 0; i < files.length; i++) {
		tbl += "<tr>";

		tbl += "<td><a href='#' onclick=\"paramCallback('" + files[i][0]
				+ "')\">" + files[i][0] + "</a></td>";
		tbl += "<td style=\"text-align:center;\">" + files[i][2] + "</td>";
		tbl += "<td style=\"text-align:center;\">" + files[i][1] + "</td>";
		tbl += "</tr>";
	}
	tbl += "</table>";
	document.getElementById("reportList").innerHTML = tbl;
}

function iHubComp(type) {
	url = "";
	if (type == "BRS")
		url = brsPath;
	else if (type == "DSB")
		url = dsbPath;
	document.getElementById("iHubComp").src = url;
}

function showReportAccountStatement(iportalURL) {
	actuate.load('viewer');
	var reqOps = new actuate.RequestOptions();
	reqOps.setRepositoryType('Enterprise');
	reqOps.setVolume('Default Volume');
	reqOps.setCustomParameters({});
	actuate.initialize(iportalURL,getReqOpts(), null, null, accountStatementInit);
}

function accountStatementInit() {
	//viewer1 = new actuate.Viewer('container1');
	viewer1 = new actuate.Viewer("dashboardpane");
	
	viewer1.setReportDesign('/Applications/Account Statement/Report Designs/Account Statement.rptdesign');
	var parameterValueMap = {
		//parmAccountNo : "10740020721541",
		parmAccountNo : "",
		parmFromDate : "12/1/2018",
		parmToDate : "12/1/2018"
	};
	var parameterValues = [];
	for ( var key in parameterValueMap) {
		var param = new actuate.viewer.impl.ParameterValue();
		param.setName(key);
		if (parameterValueMap[key] != null) {
			param.setValue(parameterValueMap[key]);
		} else {
			param.setValueIsNull(true);
		}
		parameterValues.push(param);
	}
	viewer1.setParameterValues(parameterValues);
	var options = new actuate.viewer.UIOptions();
	
	options.enableToolBar(true);
	viewer1.setUIOptions(options);
	viewer1.setWidth(window.innerWidth - 500);
	viewer1.setHeight(window.innerHeight - 60);
	viewer1.submit(function() {
		viewer1.downloadReport("pdf",null,null);
		$("button:contains('Hide')").click();
		
	});
	
	//viewer1.submit();
}