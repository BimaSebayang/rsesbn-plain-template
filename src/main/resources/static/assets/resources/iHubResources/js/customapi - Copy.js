// login functions
	function login(form)
	{
		loginForm = form;
		var userid = form.userName.value;
		var pwd = form.password.value;
		
		actuate.authenticate(iportalURL,
			getReqOpts(), 
			userid,
			pwd,
			null,
			authCallback,	
			loginerrcallback);
	}

	function authCallback()
	{
		window.location=landingPage;
	}

	function loginerrcallback(exception)
	{
		loginForm.password.value = "";
		alert("The user name or password you entered is incorrect");
		//alert(exception.getMessage());
	}

	// logout functions
	function logout()
	{
		actuate.logout(iportalURL, getReqOpts(), logoutCallback, logouterrcallback);
	}
	
	function logoutCallback()
	{
		window.location= logoutPage;
	}

	function logouterrcallback(exception)
	{
		alert(exception.getMessage());
	}
	
	// RequestOptions
	function getReqOpts()
	{
		var reqOps  = new actuate.RequestOptions( );
		reqOps.setRepositoryType(actuate.RequestOptions.REPOSITORY_ENCYCLOPEDIA);
		reqOps.setVolume(volumeName);
		return reqOps;
	}
	
	// Load Report content
	function initReport(reportName,wd,ht,iv)
	{
		rptName = reportName;
		eIV = iv;

			
		if( isNaN(wd) || typeof(wd) == "undefined" || wd == null )
			rptWd="1200";
		else
			rptWd=wd;
				
		if( isNaN(ht) || typeof(ht) == "undefined" || ht == null )
			rptHt="1400";
		else
			rptHt = ht;
				
		actuate.load("viewer");
		actuate.initialize(iportalURL, getReqOpts(), null, null, reportCallback, reportErrCallback);
	} 

	function reportCallback()
	{
		actuViewer = new actuate.Viewer("reportpane");
		actuViewer.setReportName(rptPath + rptName);
		//actuViewer.setWidth(parseInt(rptWd));
		//actuViewer.setHeight(parseInt(rptHt));
		actuViewer.setWidth(window.innerWidth - 16);
		actuViewer.setHeight(window.innerHeight -30);		
		if(!eIV || eIV=="true")
			actuViewer.submit(function() {actuViewer.enableIV();});	
		else
			actuViewer.submit();		
	}
				
	function reportErrCallback(exception)
	{
		alert(exception.getMessage());
	}
	
	// Load Dashboard Content
	function initDashBoard(dashboardName,wd,ht,edit,showTab)
	{
		dsbName = dashboardName;
		
				
		if( isNaN(wd) || typeof(wd) == "undefined" || wd == null )
			dsbWd='1200';
		else
			dsbWd=wd;
				
		if( isNaN(ht) || typeof(ht) == "undefined" || ht == null )
			dsbHt='1400';
		else
			dsbHt = ht;
			
			
		
		if(!edit || edit=="true")	
			editDashboard = edit;
		else
			editDashboard = "false";
			
		if(!showTab || showTab=="false")
			showTabNav = showTab;
		else
			showTabNav = "true";
		
		actuate.load("dashboard");
		actuate.initialize(iportalURL, getReqOpts(), null, null, dashBoardCallback, dashBoardErrCallback);
	} 

	function dashBoardCallback( )
	{
		var dash = new actuate.Dashboard("dashboardpane");
		dash.setDashboardName(dsbpath + dsbName + ".dashboard");
		
		if(editDashboard=="" || editDashboard=="false")
			dash.setIsDesigner(false); 
		else 
			dash.setIsDesigner(true);
				
		if(showTabNav=="false")
				dash.showTabNavigation(false);
		else 
				dash.showTabNavigation(true);
		
		dash.setWidth(parseInt(dsbWd));
		dash.setHeight(parseInt(dsbHt));
		dash.submit();
	}

	function dashBoardErrCallback(exception)
	{
		alert(exception.getMessage());
	}
	
	// Retreive the file list from report explorer
	function initReportExplr() 
	{
		actuate.load("reportexplorer");
		actuate.load("viewer");
		actuate.load("parameter");
		actuate.initialize(iportalURL, getReqOpts(), null, null, rptExplrCallback, rptExplrErrCallback);
	}
	
	function rptExplrCallback() 
	{
		var reportExplorer = new actuate.ReportExplorer();
		reportExplorer.setResultDef(["Name", "FileType","TimeStamp","Version"]);
		reportExplorer.setSearch(setFileSearch());
		reportExplorer.getFolderItems(rptPath, getReportList);	
	}
	
	function rptExplrErrCallback(exception)
	{
		alert(exception.getMessage());
	}
	
	function setFileSearch()
	{
		var fileSearch = new actuate.reportexplorer.FileSearch();
		var filterArr = new Array();
		var fileCondition = new actuate.reportexplorer.FileCondition( );
		fileCondition.setField( "FileType" );
		fileCondition.setMatch( "rptdesign" );
		filterArr.push( fileCondition );
		fileSearch.setConditionArray( filterArr );
		return fileSearch;
	}
	
	function getReportList(folderItems, folder) {
		files = [];
		for (var i=0;i<folderItems.getItemList().length;i++)
		{
			files.push([]);
			files[i].push(new Array(3));
			fileName = folderItems.getItemList()[i].getName();
			modDate = folderItems.getItemList()[i].getTimeStamp()
			files[i][0] = fileName.substring(0,fileName.indexOf(".")); 
			files[i][1] = folderItems.getItemList()[i].getVersion();
			files[i][2] = modDate.substring(0,modDate.indexOf("T"));
		} 
		reportList(files);
	}
	
	function reportList(files)
	{
		var rowCount = files.length;
		var tbl = "<table class=\"tblAltCol\">";
		tbl +="<tr><td>List of Reports</td><td style=\"text-align:center;\"> Modified Date</td><td style=\"text-align:center;\"> Version</td></tr>";
		for (var i=0;i<files.length;i++)
		{
			tbl += "<tr>";	
			
			tbl += "<td><a href='#' onclick=\"paramCallback('"+ files[i][0] +"')\">" + files[i][0] + "</a></td>";
			tbl += "<td style=\"text-align:center;\">" + files[i][2] + "</td>";
			tbl += "<td style=\"text-align:center;\">" + files[i][1] + "</td>";
			tbl += "</tr>";
		}
		tbl += "</table>";
		document.getElementById("reportList").innerHTML = tbl;
	}
		
	function iHubComp(type)
	{
		url = "";
		if(type == "BRS")
			url = brsPath;
		else if (type == "DSB")
			url = dsbPath;
		document.getElementById("iHubComp").src = url; 
	}
	//Rob Resize Viewer
	function acload(){
			var reqOps  = new actuate.RequestOptions( );
			reqOps.setRepositoryType(actuate.RequestOptions.REPOSITORY_ENCYCLOPEDIA);
			reqOps.setVolume(volumeName);
			actuate.load("viewer");
			actuate.load("parameter");
			actuate.initialize(iportalURL, getReqOpts(), null, null,reportCallback,reportErrCallback );
	}
	function addEvent(elem, type, eventHandle) {
			if (elem == null || typeof(elem) == 'undefined') return;
			if ( elem.addEventListener ) {
				elem.addEventListener( type, eventHandle, false );
			} else if ( elem.attachEvent ) {
				elem.attachEvent( "on" + type, eventHandle );
			} else {
				elem["on"+type]=eventHandle;
			}
		}
		
		$(function() {
			acload();
			addEvent(window, "resize", function(){
				if(actuViewer != null){
					$("#acviewer").width(window.innerWidth - 16);
					actuViewer.setWidth(window.innerWidth - 16);
					actuViewer.refresh();
				}
			});
		});