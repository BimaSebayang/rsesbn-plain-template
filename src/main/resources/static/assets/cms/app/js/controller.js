APP.controller('SidebarController', function($scope, $http, $rootScope,
		$location, $window) {
	$rootScope.pendingNotificationCount = 0;
	if (localStorage.getItem('pendingNotificationCount')) {
		$rootScope.pendingNotificationCount = localStorage
				.getItem('pendingNotificationCount');
	}
});

APP.directive("datepicker", function () {
    return {
        restrict: "A",
        link: function (scope, el, attr) {
            el.datepicker({
                            dateFormat: 'dd/mm/yy'
                        });
        }
    };
})

APP.controller('GroupManagementController', function($scope, $http, $rootScope,
		$location, $window) {
	$scope.keyIndex = 'id';
	$scope.linkAction = {};
	$scope.datas = null;
	$scope.modules = null;
	$scope.currentPage = 1;
	$scope.currentPageInfo = 1;
	$scope.pageSize = PAGE_SIZE;
	$scope.total = 1;
	$scope.from = 1;
	$scope.to = PAGE_SIZE;
	$scope.qlue = '';

	$scope.sortBy = ''; // set the default sort order
	// $scope.sortType = 'asc'; // set the default sort type
	$scope.sortReverse = false;

	$scope.filterData = {
		columnSelected : null,
		availableColumn : [

		],
	};

	$scope.loadData = function(page, qlue) {
		if (page != undefined) {
			$scope.currentPage = page;
		}
		if (qlue != undefined) {
			$scope.qlue = qlue;
		}
		$http.get(endPoint + 'groupmanagement/list', {
			params : {}
		}).success(function(response) {
			$scope.datas = response.listResponse;
			$scope.message = response.message;
			$scope.status = response.status;
			$scope.error = response.error;
			if ('invalid_token' == $scope.error) {
				$scope.invalidToken();
			}
		});
	};

	$scope.invalidToken = function() {
		return invalidConfirm(function() {
			$http.get(endPoint + 'invalid-token', {

			}, {}).then(function successCallback(response) {
				window.location.reload();
			}, function errorCallback(response) {
				console.log(response);
			});
		});
	}

	$scope.loadDataSort = function(sortBy, sortReverse) {
		$scope.sortBy = sortBy;
		$scope.loadData($scope.page);
	}

	$scope.loadDataSearch = function(page, term) {
		$scope.loadData(page, term);
	};

	$scope.onDeleteClick = function(keyId) {
		return deleteConfirm(function() {
			$http.post(endPoint + 'users/delete', {
				"adminId" : keyId
			}, {}).then(function successCallback(response) {
				window.location.reload();
			}, function errorCallback(response) {
				console.log(response);
			});
		});
	}

	$scope.$watch("currentPage", function() {
		$scope.loadData($scope.currentPage);
	});

});

APP.controller('UserManagementController', function($scope, $http, $rootScope,
		$location, $window) {
	$scope.keyIndex = 'id';
	$scope.linkAction = {
		add : "users/add-ldap",
		update : "detail-update?id=",
		remove : "remove?uid=",
		paramId : "?id=",
		paramPdf : "?extend=PDF",
		paramXLS : "?extend=XLS",
		dataUpload : "&dataList="
	};

	$scope.datas = null;
	$scope.modules = null;
	$scope.currentPage = 1;
	$scope.currentPageInfo = 1;
	$scope.pageSize = PAGE_SIZE;
	$scope.total = 1;
	$scope.from = 1;
	$scope.to = PAGE_SIZE;
	$scope.qlue = '';
	$scope.flagStatus = false;
	$scope.dataStatus = [ {
		'id' : 'true',
		'name' : 'Active'
	}, {
		'id' : 'false',
		'name' : 'Inactive'
	} ];
	$scope.checkTotalUser = 'true';

	$scope.search = function() {
		$scope.checkTotalUser = 'false';
		this.loadData();
	};

	$scope.sortBy = ''; // set the default sort order
	// $scope.sortType = 'asc'; // set the default sort type
	$scope.sortReverse = false;

	$scope.filterData = {
		columnSelected : null,
		availableColumn : [

		],
	};

	$scope.inputParam = function(paramKey) {
		if (paramKey == 'status') {
			$scope.flagStatus = true;
			$scope.paramVal = 'true';
		} else {
			$scope.paramVal = '';
			$scope.flagStatus = false;
		}
	}

	$scope.checkDetail = function() {
		return $("#lookDetailUser").val();
	}

	$scope.getValueGroupName = function() {
		return $("#setGroupName").val();
	}

	$scope.onChangeValue = function(paramVal) {
		$scope.paramVal = paramVal;
	}

	$scope.loadData = function(page, qlue) {
		$scope.var1 = '0';
		$scope.var2 = '0';
		$scope.page = '';

		if ($scope.checkTotalUser == 'true') {
			$scope.checkDetailTotalUser = $scope.checkDetail();
			if ($scope.checkDetailTotalUser == 'true') {
				$scope.var1 = 'groupName';
				$scope.var2 = $scope.getValueGroupName();
			}
		}
		if (page != undefined) {
			$scope.currentPage = page;
		}
		if (qlue != undefined) {
			$scope.qlue = qlue;
		}
		if ($scope.paramKey != undefined) {
			$scope.var1 = $scope.paramKey;
		}
		if ($scope.paramVal != undefined) {
			$scope.var2 = $scope.paramVal;
		}
		if ($scope.secPage != undefined) {
			$scope.page = $scope.secPage;
		}
		$http.get(endPoint + 'admin/usermanagement/list', {
			params : {
				'param1' : $scope.var1,
				'param2' : $scope.var2,
				'page' : $scope.page
			}
		}).success(function(response) {
			$scope.datas = response.listResponse;
			$scope.message = response.message;
			$scope.status = response.status;
			$scope.error = response.error;
			$scope.pageNumber = response.pageNumber;
			$scope.pageSize = response.pageSize;
			$scope.totalPage = response.totalPage;
			if ($scope.datas == 0) {
				$scope.emptyData = true;
			} else {
				$scope.emptyData = false;
			}

		});
	};

	$scope.download = function(datas, extend) {
		$http.get(endPoint + 'admin/usermanagement/download', {
			params : {
				'dataList' : JSON.stringify(datas),
				'extend' : extend
			}
		}).success(function(response) {
			$scope.message = response.message;
			$scope.status = response.status;
			$scope.error = response.error;

			$scope.loadDataSearch();
		});
	}

	$scope.getPage = function(totalPage) {
		return new Array(totalPage);
	}

	$scope.pagging = function(secPage) {
		$scope.secPage = secPage;
		$scope.loadData();
	}

	$scope.loadDataSort = function(sortBy, sortReverse) {
		$scope.sortBy = sortBy;
		$scope.loadData($scope.page);
	}

	$scope.loadDataSearch = function(page, term) {
		$scope.loadData(page, term);
	};

	$scope.$watch("currentPage", function() {
		$scope.loadData($scope.currentPage);
	});

});

APP
		.controller(
				'ManualMergeSplitController',
				function($scope, $http, $rootScope, $location, $window) {
					$scope.custom = [];
					$scope.keyIndex = 'id';
					$scope.linkAction = {
						list : "/list",
						add : "/add",
						search : "/search"
					};

					$scope.datas = null;
					$scope.datasModal = null;
					$scope.modules = null;
					$scope.currentPage = 1;
					$scope.currentPageInfo = 1;
					$scope.pageSize = PAGE_SIZE;
					$scope.total = 1;
					$scope.from = 1;
					$scope.to = PAGE_SIZE;
					$scope.qlue = '';
					$scope.dataList = '';
					$scope.checkedCustom = [];
					$scope.msgStatus = false;
					$scope.errorSubmit = false;
					$scope.comment = [];
					$scope.lockGCN = false;
					$scope.emptyDatasLock = false;
					$scope.datas = {};
					$scope.sortBy = ''; // set the default sort order
					$scope.sortReverse = false;

					$scope.remove = function(varGcn) {
						var i = $scope.datas.length;
						while (i--) {
							if ($scope.datas[i].idnSvp == varGcn) {
								$scope.datas.splice(i, 1);
							}
						}

						var check = $scope.checkedCustom;
						var checkArr = [];
						checkArr = check.toString().split(",");
						var j = checkArr.length;
						while (j--) {
							if (check[j] == varGcn) {
								$scope.checkedCustom.splice(j, 1);
							}
						}

						$scope.lockGcnByUser();
					}

					// function load comment
					$scope.onComment = function(comment, res) {
						$scope.comment = comment;
					}

					$scope.save = function(idnSvp, checkedFlag) {
						if (checkedFlag) {
							for ( var k in $scope.custom) {
								if ($scope.custom.hasOwnProperty(k)
										&& $scope.custom[k]) {
									$scope.checkedCustom.push(idnSvp);
								}
							}
						} else {
							var i = $scope.checkedCustom.length;
							while (i--) {
								if ($scope.checkedCustom[i] == idnSvp) {
									$scope.checkedCustom.splice(i, 1);
								}
							}
						}
					}

					$scope.search = function(datas) {
						$scope.msgStatus = false;
						$scope.secPage = undefined
						$scope.customeList(datas);
						this.loadDatas();
					}

					$scope.customeList = function(datas) {
						$scope.checkedCustom = [];
						for ( var k in datas) {
							if (datas.hasOwnProperty(k) && datas[k].idnSvp
									&& datas[k].idnSvp) {
								if ($scope.checkedCustom.length > 0) {
									var check = $scope.checkedCustom;
									var checkArr = [];
									checkArr = check.toString().split(",");
									var j = checkArr.length;
									while (j--) {
										if (check[j] != datas[k].idnSvp) {
											$scope.checkedCustom.splice(j, 1);
										}
									}
								} else {
									$scope.checkedCustom.push(datas[k].idnSvp);
								}
							}
						}
					}

					$scope.functionalGrouping = function(datas) {
						$scope.counter = 0;
						var counter = 1;

						$scope.itemsGroup = [];
						var varGroup = [];
						// grouping GCN load first and set temp value
						if (datas.length > 0) {
							for (var k = 0; k < datas.length; k++) {
								for (var l = k; l < datas.length; l++) {
									if (datas[l].idnSvp == datas[k].idnSvp) {
										if (varGroup.length > 0) {
											if ($scope.checkVarGroup(varGroup,
													datas[k].idnSvp)) {
												varGroup.push({
													'value' : datas[k].idnSvp
												});
											}
										} else {
											varGroup.push({
												'value' : datas[k].idnSvp
											});
										}
									}
								}
							}

							// grouping sec
							varGroup.sort();

							for (var k = 0; k < varGroup.length; k++) {
								$scope.itemsGroup.push({
									'key' : counter++,
									'value' : varGroup[k].value
								});
							}

							for (var i = $scope.itemsGroup.length; i < datas.length; i++) {
								$scope.itemsGroup.push({
									'key' : counter++,
									'value' : 'AutoGenerate'
								});
							}
							// set group and golden Record default first load
							for (var k = 0; k < datas.length; k++) {
								datas[k].goldenRecord = false;
								datas[k].newIdnSvp = varGroup[0].value;
								datas[k].group = 1;
							}
						}
					}

					$scope.checkVarGroup = function(varGroup, gcn) {
						for (var i = 0; i < varGroup.length; i++) {
							if (varGroup[i].value == gcn) {
								return false;
							}
						}
						return true;
					}

					// function disable for same GCN
					$scope.onCheckedGolden = function(goldenChecked, row, data) {
						var idnSvp = row.idnSvp;
						var idnParty = row.idnParty;

						if (goldenChecked == true) {
							for (var i = 0; i < data.length; i++) {
								if (data[i].idnSvp == idnSvp
										&& data[i].idnParty == idnParty) {
									row.goldenRecord = goldenChecked;
									data[i].goldenRecordFlag = false;
								}
								if (data[i].idnSvp == idnSvp
										&& data[i].idnParty != idnParty) {
									data[i].goldenRecordFlag = true;
								}
							}
						} else {
							for (var i = 0; i < data.length; i++) {
								if (data[i].idnSvp == idnSvp
										&& data[i].idnParty == idnParty) {
									row.goldenRecord = goldenChecked;
									data[i].goldenRecordFlag = false;
								}
								if (data[i].idnSvp == idnSvp
										&& data[i].idnParty != idnParty) {
									data[i].goldenRecordFlag = false;
								}
							}
						}
					}

					// function onload grouping
					$scope.onSelected = function(key, res) {
						for ( var i in $scope.itemsGroup) {
							if (i == key - 1) {
								res.newIdnSvp = $scope.itemsGroup[i].value;
								res.group = $scope.itemsGroup[i].key;
							}
						}
					}

					$scope.listload = function() {
						$scope.msgStatus = false;
						$scope.errorSubmit = false;
						var checkedCustom = '';

						if ($scope.checkedCustom != undefined
								&& $scope.checkedCustom != true
								&& $scope.checkedCustom != false) {
							checkedCustom = $scope.checkedCustom;
						}

						$http.get(endPoint + 'maintenance/mergesplit/listAdd',
								{
									params : {
										'inGcn' : checkedCustom
									}
								}).success(function(response) {
							$scope.datasAdd = response.listResponse;
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.error = response.error;

							if ($scope.datasAdd.length > 0) {
								$scope.lockGcnByUser();
							}
							$scope.functionalGrouping($scope.datas);

							if ($scope.datas.length > 0) {
								$scope.emptyDatas = true;
							} else {
								$scope.emptyDatas = false;
							}

						});
					};

					$scope.loadDatas = function(page, qlue) {
						var checkedCustom = '';
						var paramgcn = '';
						var paramname = '';
						var parambirtdate = '';
						var parammother = ''
						var paramktp = '';
						var paramnpwp = '';
						var secPage = '';
						$scope.custom = [];
						$scope.errorSubmit = false;

						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						if ($scope.checkedCustom != undefined
								&& $scope.checkedCustom != true
								&& $scope.checkedCustom != false) {
							checkedCustom = $scope.checkedCustom;
						}
						if ($scope.paramgcn != undefined) {
							paramgcn = $scope.paramgcn;
						}
						if ($scope.paramname != undefined) {
							paramname = $scope.paramname;
						}
						if ($scope.parambirtdate != undefined) {
							var dateString = '';
							var _date = $scope.parambirtdate;
							dateString = _date.getFullYear()
									+ ""
									+ (_date.getMonth() + 1 < 10 ? '0'
											+ (_date.getMonth() + 1) : _date
											.getMonth() + 1)
									+ ""
									+ (_date.getDate() < 10 ? '0'
											+ (_date.getDate()) : _date
											.getDate());
							parambirtdate = dateString;
						}
						if ($scope.parammother != undefined) {
							parammother = $scope.parammother;
						}
						if ($scope.paramktp != undefined) {
							paramktp = $scope.paramktp;
						}
						if ($scope.paramnpwp != undefined) {
							paramnpwp = $scope.paramnpwp;
						}
						if ($scope.secPage != undefined) {
							secPage = $scope.secPage;
						}
						$http.get(endPoint + 'maintenance/mergesplit/list', {
							params : {
								'notInGcn' : checkedCustom,
								'paramgcn' : paramgcn,
								'paramname' : paramname,
								'parambirtdate' : parambirtdate,
								'parammother' : parammother,
								'paramktp' : paramktp,
								'paramnpwp' : paramnpwp,
								'secPage' : secPage

							}
						}).success(
								function(response) {
									$scope.datasModal = response.listResponse;
									$scope.message = response.message;
									$scope.status = response.status;
									$scope.error = response.error;
									$scope.last = response.last;
									$scope.totalPage = response.totalPage;
									$scope.pageNumber = response.pageNumber;
									$scope.pageSize = response.pageSize;
									if ($scope.datasModal != null
											&& $scope.datasModal != undefined) {
										if ($scope.datasModal.length > 0) {
											$scope.emptyDataModal = false;
										} else {
											$scope.emptyDataModal = true;
										}
									}
									if ('invalid_token' == $scope.error) {
										$scope.invalidToken();
									}
								});
					};

					$scope.invalidToken = function() {
						$http
								.get(
										endPoint
												+ 'maintenance/mergesplit/invalid-token',
										{

										}, {}).then(
										function successCallback(response) {
											window.location.reload();
										}, function errorCallback(response) {
											console.log(response);
										});
					}

					$scope.submit = function(datas) {
						var comment = '';
						if ($scope.comment != undefined && $scope.comment != '') {
							comment = $scope.comment;
						}

						if (comment == '') {
							$scope.errorSubmit = true;
							$scope.status = '';
							$scope.title = 'Please Add Comment';
							return $scope.listload;
						}

						$scope.dataList = [];
						$scope.dataList = datas;
						$http
								.get(
										endPoint
												+ 'maintenance/mergesplit/submit',
										{
											params : {
												'dataList' : JSON
														.stringify(datas),
												'comment' : comment
											}
										})
								.success(
										function(response) {
											$scope.dataResponse = response.objectResponse;
											$scope.message = response.message;
											$scope.status = response.status;
											$scope.title = response.title;
											$scope.detail = response.detail;

											if ($scope.status != 201
													&& $scope.message == 'CREATED') {
												$scope.errorSubmit = true;
											} else {
												$scope.errorSubmit = false;
											}
											if ($scope.dataResponse != null
													&& $scope.dataResponse != undefined) {
												$scope.msgStatus = true;
												$scope.idRecomendation = $scope.dataResponse.id;
											}
											$scope.checkedCustom = [];
											$scope.datas = [];
											$scope.emptyDatas = false;
											$scope.comment = '';

											$scope.sendEmail();
										});
					}

					$scope.sendEmail = function() {
						$http.get(
								endPoint + 'maintenance/mergesplit/sendEmail',
								{
									params : {
										'idRec' : $scope.idRecomendation
									}
								}).success(function(response) {
						});
					}

					$scope.lockGcnByUser = function() {
						$http
								.get(
										endPoint
												+ 'maintenance/mergesplit/lockByUserLogin',
										{
											params : {}
										}).success(function(response) {
									$scope.datas = response.listResponse;
									$scope.message = response.message;
									$scope.status = response.status;
									$scope.error = response.error;
									$scope.title = response.title;
									$scope.detail = response.detail;

									$scope.functionalGrouping($scope.datas);
									if ($scope.datas.length > 0) {
										$scope.emptyDatas = true;
									}

									if ('invalid_token' == $scope.error) {
										$scope.invalidToken();
									}

								});
					}

					$scope.releaseLock = function(gcn) {
						$http
								.get(
										endPoint
												+ 'maintenance/mergesplit/releaseByUserLogin',
										{
											params : {
												'gcn' : gcn
											}
										}).success(function(response) {
									$scope.message = response.message;
									$scope.status = response.status;
									$scope.remove(gcn);
									if ($scope.datas.length > 0) {
										$scope.emptyDatas = true;
									} else {
										$scope.emptyDatas = false;
									}
								});
					}

					$scope.detailCIF = function(cif, source) {
						$http
								.get(
										endPoint
												+ '/maintenance/rekomendasi/detailCif',
										{
											params : {
												'cif' : cif,
												'source' : source
											}
										})
								.success(
										function(response) {
											$scope.datasCifDetail = response.objectResponse;
											$scope.message = response.message;
											$scope.status = response.status;
											$scope.error = response.error;
											if ($scope.datasCifDetail != undefined
													&& $scope.datasCifDetail != null) {
												if ($scope.datasCifDetail.dteBirth != undefined
														&& $scope.datasCifDetail.dteBirth != null) {
													$scope.datasCifDetail.dteBirth = formatterDate($scope.datasCifDetail.dteBirth);
												}
											}
											if ('invalid_token' == $scope.error) {
												$scope.invalidToken();
											}
										});
					}

					$scope.invalidToken = function() {
						$http
								.get(
										endPoint
												+ '/maintenance/rekomendasi/invalid-token',
										{

										}, {}).then(
										function successCallback(response) {
											window.location.reload();
										}, function errorCallback(response) {
											console.log(response);
										});
					}

					$scope.release = function(gcn) {
						$scope.releaseLock(gcn);
					}

					$scope.reset = function() {
						$scope.datas = [];
						$scope.emptyDatas = false;
						$scope.msgStatus = false;
						$scope.errorSubmit = false;
						$scope.comment = undefined;
						$scope.lockGcnByUser();
					}

					$scope.getPage = function(totalPage) {
						return new Array(totalPage);
					}

					$scope.pagging = function(secPage) {
						$scope.secPage = secPage;
						$scope.loadDatas();
					}

				});

APP
		.controller(
				'RekomendasiController',
				function($scope, $http, $rootScope, $location, $window) {
					$scope.keyIndex = 'id';
					$scope.linkAction = {
						detail : "/detail-investigasi?id=",
						paramId : "?id="
					};
					$scope.datas = null;
					$scope.modules = null;
					$scope.currentPage = 1;
					$scope.currentPageInfo = 1;
					$scope.pageSize = PAGE_SIZE;
					$scope.total = 1;
					$scope.from = 1;
					$scope.to = PAGE_SIZE;
					$scope.qlue = '';
					$scope.flagStatus = false;
					$scope.flagDate = false;
					$scope.flagInput = true;
					$scope.emptyData = false;
					$scope.msgStatus = false;
					$scope.detailId = '';
					$scope.pageDetail = false;
					$scope.comments = [];
					$scope.newComments = [];
					$scope.orderByField = 'id';
					$scope.reverseSort = false;
					$scope.errorSubmit = false;
					$scope.errorComment = false;

					$scope.search = function() {
						$scope.secPage = '';
						this.loadData();
					};

					$scope.onChangeValue = function(param2) {
						$scope.param2 = param2;
					}

					// load disable for first load
					$scope.cekDisableRecord = function(res, dataDetail) {
						var idnSvp = res.customer.idnSvp;
						var idnParty = res.customer.idnParty;

						if (res.goldenRecord == false) {
							for (var i = 0; i < dataDetail.length; i++) {
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty != idnParty) {
									if (dataDetail[i].goldenRecord == true) {
										res.customer.goldenRecordFlag = true;
									}
								}
							}
						}
					}

					// function disable for same GCN
					$scope.onCheckedGolden = function(goldenChecked, row,
							dataDetail) {
						var idnSvp = row.customer.idnSvp;
						var idnParty = row.customer.idnParty;
						if (goldenChecked == true) {
							for (var i = 0; i < dataDetail.length; i++) {
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty == idnParty) {
									row.customer.goldenRecord = goldenChecked;
									dataDetail[i].customer.goldenRecordFlag = false;
								}
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty != idnParty) {
									dataDetail[i].customer.goldenRecordFlag = true;
								}
							}
						} else {
							for (var i = 0; i < dataDetail.length; i++) {
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty == idnParty) {
									row.customer.goldenRecord = goldenChecked;
									dataDetail[i].customer.goldenRecordFlag = false;
								}
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty != idnParty) {
									dataDetail[i].customer.goldenRecordFlag = false;
								}
							}
						}
					}

					// function onload grouping
					$scope.onSelected = function(key, res) {
						for ( var i in $scope.itemsGroup) {
							if (i == key - 1) {
								res.newGcn = $scope.itemsGroup[i].value;
								res.group = $scope.itemsGroup[i].key;
							}
						}
					}

					// function load comment
					$scope.onComment = function(comments, index) {
						$scope.newComments[index].text = comments;
					}

					// function add comments
					$scope.addComment = function() {
						$scope.newComments.push({
							'text' : ''
						});
					}

					$scope.sortBy = ''; // set the default sort order
					// $scope.sortType = 'asc'; // set the default sort type
					$scope.sortReverse = false;

					$scope.filterData = {
						columnSelected : null,
						availableColumn : [

						],
					};

					$scope.onSelectStatus = function() {
						$http
								.get(
										endPoint
												+ 'maintenance/rekomendasi/listStatus',
										{
											params : {}
										}).success(function(response) {
									$scope.dataStatus = response.listResponse;
								});
					}

					$scope.statusFilter = function(item) {
						return (item.id != '4') && (item.id != '5')
								&& (item.id != '6');
					}

					$scope.inputParam = function(param) {
						$scope.param1 = param;
						if ($scope.param1 != 'recommenDate'
								&& $scope.param1 != 'investDate'
								&& $scope.param1 != 'reviewDate') {
							$scope.param2 = '';
						}
						if (param == 'status') {
							$scope.flagStatus = true;
							$scope.flagInput = false;
							$scope.flagDate = false;
							this.onSelectStatus();
						} else if (param == 'recommenDate'
								|| param == 'investDate'
								|| param == 'reviewDate') {
							$scope.flagStatus = false;
							$scope.flagInput = false;
							$scope.flagDate = true;
						} else {
							$scope.flagStatus = false;
							$scope.flagInput = true;
							$scope.flagDate = false;
						}
					}

					$scope.loadData = function(page, qlue) {
						$scope.var1 = '0';
						$scope.var2 = '0';
						$scope.page = '';

						$scope.datas = [];
						$scope.newComments = [];
						$scope.errorSubmit = false;

						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						if ($scope.param1 != undefined) {
							$scope.var1 = $scope.param1;
						}
						if ($scope.param2 != undefined) {
							$scope.var2 = $scope.param2;
						}
						if ($scope.param1 == 'status' && $scope.param2 == '') {
							$scope.var2 = '1';
						}
						if ($scope.param1 == 'recommenDate'
								|| $scope.param1 == 'investDate'
								|| $scope.param1 == 'reviewDate') {
							var dateString = '';
							if ($scope.param2 != undefined
									&& $scope.param2 != '') {
								var _date = $scope.param2;
								dateString = _date.getFullYear()
										+ "-"
										+ (_date.getMonth() + 1 < 10 ? '0'
												+ (_date.getMonth() + 1)
												: _date.getMonth() + 1)
										+ "-"
										+ (_date.getDate() < 10 ? '0'
												+ (_date.getDate()) : _date
												.getDate());
							}
							$scope.var2 = dateString;
						}
						if ($scope.secPage != undefined && $scope.secPage != '') {
							$scope.page = $scope.secPage;
						}
						$http.get(endPoint + 'maintenance/rekomendasi/list', {
							params : {
								'param1' : $scope.var1,
								'param2' : $scope.var2,
								'page' : $scope.page
							}
						}).success(function(response) {
							$scope.datas = response.listResponse;
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.error = response.error;
							$scope.last = response.last;
							$scope.totalPage = response.totalPage;
							$scope.pageNumber = response.pageNumber;
							$scope.pageSize = response.pageSize;
							if ($scope.datas == 0) {
								$scope.emptyData = true;
							} else {
								$scope.emptyData = false;
							}

						});
					};

					$scope.getPage = function(totalPage) {
						return new Array(totalPage);
					}

					$scope.pagging = function(secPage) {
						$scope.secPage = secPage;
						$scope.loadData();
					}

					$scope.loadDetailData = function(page, qlue) {
						$scope.dataDetail = [];
						$scope.newComments = [];
						$scope.errorSubmit = false;

						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						$http
								.get(
										endPoint
												+ 'maintenance/rekomendasi/detailInvestigasi',
										{
											params : {
												'id' : $scope.detailId
											}
										})
								.success(
										function(response) {
											$scope.dataDetail = response.content;
											$scope.message = response.message;
											$scope.status = response.status;
											$scope.error = response.error;
											$scope.comments = response.comments;
											$scope.idDetail = $scope.detailId;
											$scope.pageDetail = true;

											// grouping GCN load first and set
											// temp value
											$scope
													.functionalGrouping($scope.dataDetail);
										});
					};

					$scope.functionalGrouping = function(datas) {
						$scope.counter = 0;
						var counter = 1;

						$scope.itemsGroup = [];
						var varGroup = [];
						// grouping GCN load first and set temp value
						if (datas.length > 0) {
							for (var k = 0; k < datas.length; k++) {
								for (var l = k; l < datas.length; l++) {
									if (datas[l].customer.idnSvp == datas[k].customer.idnSvp) {
										if (varGroup.length > 0) {
											if ($scope.checkVarGroup(varGroup,
													datas[k].customer.idnSvp)) {
												varGroup
														.push({
															'value' : datas[k].customer.idnSvp
														});
											}
										} else {
											varGroup
													.push({
														'value' : datas[k].customer.idnSvp
													});
										}

									}
								}
							}

							// grouping sec
							varGroup.sort();

							for (var k = 0; k < varGroup.length; k++) {
								$scope.itemsGroup.push({
									'key' : counter++,
									'value' : varGroup[k].value
								});
							}

							for (var i = $scope.itemsGroup.length; i < datas.length; i++) {
								$scope.itemsGroup.push({
									'key' : counter++,
									'value' : 'AutoGenerate'
								});
							}
							// set group and golden Record default first load
							for (var k = 0; k < datas.length; k++) {
								datas[k].newGcn = varGroup[0].value;
								datas[k].group = 1;
							}
						}
					}

					$scope.checkVarGroup = function(varGroup, gcn) {
						for (var i = 0; i < varGroup.length; i++) {
							if (varGroup[i].value == gcn) {
								return false;
							}
						}
						return true;
					}

					$scope.getIdInvestigasi = function(id) {
						$scope.errorSubmit = false;
						$scope.newComments = [];
						$scope.detailId = id;
						$scope.loadDetailData();
					}

					$scope.submit = function(dataDetail) {
						var comment = [];
						$scope.newComments = [];
						$scope.errorSubmit = false;

						if ($scope.comments != undefined
								&& $scope.comments != '') {
							comment = $scope.comments;
						}

						$scope.dataList = [];
						$scope.dataList = dataDetail;
						$http.get(endPoint + 'maintenance/rekomendasi/edit', {
							params : {
								'id' : $scope.detailId,
								'dataList' : JSON.stringify(dataDetail)
							// 'comments' : comment
							}
						}).success(function(response) {
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.title = response.title;
							if ($scope.status == 201) {
								$scope.loadDataSearch();
								$scope.errorSubmit = false;
							} else {
								$scope.errorSubmit = true;
							}

						});
					}

					$scope.saveComment = function(id) {
						var comment = [];
						$scope.errorSubmit = false;
						var boolFlag = false;
						if ($scope.newComments != undefined
								&& $scope.newComments != null) {
							for (var i = 0; i < $scope.newComments.length; i++) {
								var com = $scope.newComments[i].text;
								if (com == '') {
									boolFlag = true;
								}
							}
						}

						if (boolFlag) {
							$scope.errorComment = true;
						} else {

							comment = $scope.newComments;

							$http
									.get(
											endPoint
													+ 'maintenance/rekomendasi/submitComments',
											{
												params : {
													'id' : id,
													'newComments' : JSON
															.stringify(comment)
												}
											}).success(function(response) {
										$scope.message = response.message;
										$scope.status = response.status;
										$scope.error = response.error;
										$scope.errorComment = false;
										$scope.loadDetailData();
									});
						}
					}

					$scope.back = function(id) {
						$http.get(endPoint + 'maintenance/rekomendasi/lock', {
							params : {
								'idInvestigation' : id
							}
						}).success(function(response) {
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.error = response.error;

							$scope.loadDataSearch();
						});
					}

					$scope.detailCIF = function(cif, source) {
						$http
								.get(
										endPoint
												+ '/maintenance/rekomendasi/detailCif',
										{
											params : {
												'cif' : cif,
												'source' : source
											}
										})
								.success(
										function(response) {
											$scope.datasCifDetail = response.objectResponse;
											$scope.message = response.message;
											$scope.status = response.status;
											$scope.error = response.error;
											if ($scope.datasCifDetail != undefined
													&& $scope.datasCifDetail != null) {
												if ($scope.datasCifDetail.dteBirth != undefined
														&& $scope.datasCifDetail.dteBirth != null) {
													$scope.datasCifDetail.dteBirth = formatterDate($scope.datasCifDetail.dteBirth);
												}
											}
											if ('invalid_token' == $scope.error) {
												$scope.invalidToken();
											}
										});
					}

					$scope.invalidToken = function() {
						$http
								.get(
										endPoint
												+ 'maintenance/rekomendasi/invalid-token',
										{

										}, {}).then(
										function successCallback(response) {
											window.location.reload();
										}, function errorCallback(response) {
											console.log(response);
										});
					}

					$scope.submitData = function(dataDetail) {
						this.submit(dataDetail);
					}

					$scope.loadDataSort = function(sortBy, sortReverse) {
						$scope.sortBy = sortBy;
						$scope.loadData($scope.page);
					}

					$scope.loadDataSearch = function(page, term) {
						$scope.pageDetail = false;
						$scope.newComments = [];
						$scope.loadData(page, term);
					};

					$scope.$watch("currentPage", function() {
						$scope.loadData($scope.currentPage);
					});

				});

APP
		.controller(
				'ApprovalController',
				function($scope, $http, $rootScope, $location, $window) {
					$scope.keyIndex = 'id';
					$scope.linkAction = {
						detail : "/detail-investigasi?id=",
						paramId : "?id="
					};
					$scope.datas = null;
					$scope.modules = null;
					$scope.currentPage = 1;
					$scope.currentPageInfo = 1;
					$scope.pageSize = PAGE_SIZE;
					$scope.total = 1;
					$scope.from = 1;
					$scope.to = PAGE_SIZE;
					$scope.qlue = '';
					$scope.flagStatus = false;
					$scope.flagDate = false;
					$scope.flagInput = true;
					$scope.emptyData = false;
					$scope.msgStatus = false;
					$scope.detailId = '';
					$scope.pageDetail = false;
					$scope.orderByField = 'id';
					$scope.reverseSort = false;
					$scope.comments = [];
					$scope.newComments = [];
					$scope.reverseSort = false;
					$scope.errorSubmit = false;
					$scope.createdBySystems = false;
					$scope.disableButton = false;
					$scope.errorComment = false;
					$scope.reason = '';
					$scope.checkParam = true;

					$scope.search = function() {
						$scope.secPage = '';
						this.loadData();
					};

					$scope.paramCheck = function() {
						return $("#paramIdRec").val();
					}

					$scope.paramGetValue = function() {
						return $("#idRecom").val();
					}

					$scope.onChangeValue = function(param2) {
						$scope.param2 = param2;
					}

					// load disable for first load
					$scope.cekDisableRecord = function(res, dataDetail) {
						var idnSvp = res.customer.idnSvp;
						var idnParty = res.customer.idnParty;

						if (res.goldenRecord == false) {
							for (var i = 0; i < dataDetail.length; i++) {
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty != idnParty) {
									if (dataDetail[i].goldenRecord == true) {
										res.customer.goldenRecordFlag = true;
									}
								}
							}
						}
					}

					// function disable for same GCN
					$scope.onCheckedGolden = function(goldenChecked, row,
							dataDetail) {
						var idnSvp = row.customer.idnSvp;
						var idnParty = row.customer.idnParty;
						if (goldenChecked == true) {
							for (var i = 0; i < dataDetail.length; i++) {
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty == idnParty) {
									row.customer.goldenRecord = goldenChecked;
									dataDetail[i].customer.goldenRecordFlag = false;
								}
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty != idnParty) {
									dataDetail[i].customer.goldenRecordFlag = true;
								}
							}
						} else {
							for (var i = 0; i < dataDetail.length; i++) {
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty == idnParty) {
									row.customer.goldenRecord = goldenChecked;
									dataDetail[i].customer.goldenRecordFlag = false;
								}
								if (dataDetail[i].customer.idnSvp == idnSvp
										&& dataDetail[i].customer.idnParty != idnParty) {
									dataDetail[i].customer.goldenRecordFlag = false;
								}
							}
						}
					}

					// function onload grouping
					$scope.onSelected = function(key, res) {
						for ( var i in $scope.itemsGroup) {
							if (i == key - 1) {
								res.newGcn = $scope.itemsGroup[i].value;
								res.group = $scope.itemsGroup[i].key;
							}
						}
					}

					$scope.sortBy = ''; // set the default sort order
					// $scope.sortType = 'asc'; // set the default sort type
					$scope.sortReverse = false;

					$scope.filterData = {
						columnSelected : null,
						availableColumn : [

						],
					};

					// function load comment
					$scope.onComment = function(comments, index) {
						$scope.newComments[index].text = comments;
					}

					// function add comments
					$scope.addComment = function() {
						$scope.newComments.push({
							'text' : ''
						});
					}

					$scope.loadData = function(page, qlue) {
						$scope.var1 = '0';
						$scope.var2 = '0';
						$scope.page = '';

						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						if ($scope.param1 != undefined) {
							$scope.var1 = $scope.param1;
						}
						if ($scope.param2 != undefined) {
							$scope.var2 = $scope.param2;
						}
						if ($scope.param1 == 'status' && $scope.param2 == '') {
							$scope.var2 = '3';
						}
						if ($scope.param1 == 'recommenDate'
								|| $scope.param1 == 'investDate'
								|| $scope.param1 == 'reviewDate') {
							var dateString = '';
							if ($scope.param2 != undefined
									&& $scope.param2 != '') {
								var _date = $scope.param2;
								dateString = _date.getFullYear()
										+ "-"
										+ (_date.getMonth() + 1 < 10 ? '0'
												+ (_date.getMonth() + 1)
												: _date.getMonth() + 1)
										+ "-"
										+ (_date.getDate() < 10 ? '0'
												+ (_date.getDate()) : _date
												.getDate());
							}
							$scope.var2 = dateString;
						}
						if ($scope.secPage != undefined && $scope.secPage != '') {
							$scope.page = $scope.secPage
						}
						$http.get(endPoint + 'maintenance/approval/list', {
							params : {
								'param1' : $scope.var1,
								'param2' : $scope.var2,
								'page' : $scope.page
							}
						}).success(function(response) {
							$scope.datas = response.listResponse;
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.pageNumber = response.pageNumber;
							$scope.pageSize = response.pageSize;
							$scope.totalPage = response.totalPage;
							$scope.error = response.error;

							if ($scope.datas == 0) {
								$scope.emptyData = true;
							} else {
								$scope.emptyData = false;
							}
							if ($scope.checkParam == true) {
								if ($scope.paramCheck() == 'true') {
									$scope.detailId = $scope.paramGetValue();
									$scope.loadDetailData();
								}
								$scope.checkParam = false;
							}
						});
					};

					$scope.getPage = function(totalPage) {
						return new Array(totalPage);
					}

					$scope.pagging = function(secPage) {
						$scope.secPage = secPage;
						$scope.loadData();
					}

					$scope.onSelectStatus = function() {
						$http
								.get(
										endPoint
												+ 'maintenance/rekomendasi/listStatus',
										{
											params : {}
										}).success(function(response) {
									$scope.dataStatus = response.listResponse;

								});
					}

					$scope.statusFilter = function(item) {
						return (item.id != '4') && (item.id != '5')
								&& (item.id != '1') && (item.id != '2');
					}

					$scope.inputParam = function(param) {
						$scope.param1 = param;
						if ($scope.param1 != 'recommenDate'
								&& $scope.param1 != 'investDate'
								&& $scope.param1 != 'reviewDate') {
							$scope.param2 = '';
						}
						if (param == 'status') {
							$scope.flagStatus = true;
							$scope.flagInput = false;
							$scope.flagDate = false;
							this.onSelectStatus();
						} else if (param == 'recommenDate'
								|| param == 'investDate'
								|| param == 'reviewDate') {
							$scope.flagStatus = false;
							$scope.flagInput = false;
							$scope.flagDate = true;
						} else {
							$scope.flagStatus = false;
							$scope.flagInput = true;
							$scope.flagDate = false;
						}
					}

					$scope.loadDetailData = function(page, qlue) {
						$scope.dataDetail = [];
						$scope.newComments = [];
						$scope.failedApprove = false;
						$scope.errorComment = false;

						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						$http
								.get(
										endPoint
												+ 'maintenance/rekomendasi/detailInvestigasi',
										{
											params : {
												'id' : $scope.detailId
											}
										})
								.success(
										function(response) {
											$scope.dataDetail = response.content;
											$scope.message = response.message;
											$scope.status = response.status;
											$scope.comments = response.comments;
											$scope.idDetail = $scope.detailId;
											$scope.error = response.error;
											$scope.reason = '';

											$scope.pageDetail = true;
											// grouping GCN load first and set
											// temp value
											// $scope.functionalGrouping($scope.dataDetail);

											if (response.createdBySystems == 'true') {
												$scope.createdBySystems = true;
											} else {
												$scope.createdBySystems = false;
											}

											if (response.statusRecommendationDTO.id == 6) {
												$scope.disableButton = true;
											} else {
												$scope.disableButton = false;
											}
										});
					};

					$scope.functionalGrouping = function(datas) {
						$scope.counter = 0;
						var counter = 1;

						$scope.itemsGroup = [];
						var varGroup = [];
						// grouping GCN load first and set temp value
						if (datas.length > 0) {
							for (var k = 0; k < datas.length; k++) {
								for (var l = k; l < datas.length; l++) {
									if (datas[l].customer.idnSvp == datas[k].customer.idnSvp) {
										if (varGroup.length > 0) {
											if ($scope.checkVarGroup(varGroup,
													datas[k].customer.idnSvp)) {
												varGroup
														.push({
															'value' : datas[k].customer.idnSvp
														});
											}
										} else {
											varGroup
													.push({
														'value' : datas[k].customer.idnSvp
													});
										}
									}
								}
							}

							// grouping sec
							varGroup.sort();

							for (var k = 0; k < varGroup.length; k++) {
								$scope.itemsGroup.push({
									'key' : counter++,
									'value' : varGroup[k].value
								});
							}

							for (var i = $scope.itemsGroup.length; i < datas.length; i++) {
								$scope.itemsGroup.push({
									'key' : counter++,
									'value' : 'AutoGenerate'
								});
							}
							// set group and golden Record default first load
							/*
							 * for(var k=0; k < datas.length; k++){
							 * datas[k].newGcn = varGroup[0].value;
							 * datas[k].group = 1; }
							 */
						}
					}

					$scope.checkVarGroup = function(varGroup, gcn) {
						for (var i = 0; i < varGroup.length; i++) {
							if (varGroup[i].value == gcn) {
								return false;
							}
						}
						return true;
					}

					$scope.getIdInvestigasi = function(id) {
						$scope.detailId = id;
						this.loadDetailData();
					}

					$scope.approve = function(idDetail) {
						$scope.newComments = [];

						if (idDetail != undefined && $scope != '') {
							$scope.detailId = idDetail;
						}

						$http.get(endPoint + 'maintenance/approval/approve', {
							params : {
								'id' : $scope.detailId
							}
						}).success(function(response) {
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.title = response.title;
							$scope.error = response.error;

							if ($scope.status == 200) {
								$scope.loadDataSearch();
								$scope.errorSubmit = false;
							} else {
								$scope.errorSubmit = true;
							}
						});
					}

					$scope.reject = function(dataDetail) {
						var reason = '';
						$scope.newComments = [];

						if ($scope.reason != undefined && $scope.reason != '') {
							reason = $scope.reason;
						}

						$scope.dataList = [];
						$scope.dataList = dataDetail;
						$http.get(endPoint + 'maintenance/approval/reject', {
							params : {
								'id' : $scope.detailId,
								'dataList' : JSON.stringify(dataDetail),
								'reason' : reason
							}
						}).success(function(response) {
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.title = response.title;
							$scope.error = response.error;

							if ($scope.status == 200) {
								$scope.loadDataSearch();
								$scope.errorSubmit = false;
							} else {
								$scope.errorSubmit = true;
							}
						});
					}

					$scope.requestModify = function(dataDetail) {
						var reason = '';
						$scope.newComments = [];

						if ($scope.reason != undefined && $scope.reason != '') {
							reason = $scope.reason;
						}

						$scope.dataList = [];
						$scope.dataList = dataDetail;

						$http
								.get(
										endPoint
												+ 'maintenance/approval/modification',
										{
											params : {
												'id' : $scope.detailId,
												'dataList' : JSON
														.stringify(dataDetail),
												'reason' : reason
											}
										}).success(function(response) {
									$scope.message = response.message;
									$scope.status = response.status;
									$scope.title = response.title;
									$scope.error = response.error;

									if ($scope.status == 200) {
										$scope.loadDataSearch();
										$scope.errorSubmit = false;
									} else {
										$scope.errorSubmit = true;
									}
								});
					}

					$scope.saveComment = function(id) {
						var comment = [];
						$scope.errorSubmit = false;
						var boolFlag = false;
						if ($scope.newComments != undefined
								&& $scope.newComments != null) {
							for (var i = 0; i < $scope.newComments.length; i++) {
								var com = $scope.newComments[i].text;
								if (com == '') {
									boolFlag = true;
								}
							}
						}

						if (boolFlag) {
							$scope.errorComment = true;
						} else {

							comment = $scope.newComments;

							$http
									.get(
											endPoint
													+ 'maintenance/rekomendasi/submitComments',
											{
												params : {
													'id' : id,
													'newComments' : JSON
															.stringify(comment)
												}
											}).success(function(response) {
										$scope.message = response.message;
										$scope.status = response.status;
										$scope.error = response.error;
										$scope.errorComment = false;
										$scope.loadDetailData();
									});
						}
					}

					$scope.back = function(id) {
						$scope.newComments = [];
						$scope.errorSubmit = false;

						$http.get(endPoint + 'maintenance/approval/lock', {
							params : {
								'idInvestigation' : id
							}
						}).success(function(response) {
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.loadDataSearch();
						});
					}

					$scope.detailCIF = function(cif, source) {
						$http
								.get(
										endPoint
												+ '/maintenance/rekomendasi/detailCif',
										{
											params : {
												'cif' : cif,
												'source' : source
											}
										})
								.success(
										function(response) {
											$scope.datasCifDetail = response.objectResponse;
											$scope.message = response.message;
											$scope.status = response.status;
											$scope.error = response.error;
											if ($scope.datasCifDetail != undefined
													&& $scope.datasCifDetail != null) {
												if ($scope.datasCifDetail.dteBirth != undefined
														&& $scope.datasCifDetail.dteBirth != null) {
													$scope.datasCifDetail.dteBirth = formatterDate($scope.datasCifDetail.dteBirth);
												}
											}
											if ('invalid_token' == $scope.error) {
												$scope.invalidToken();
											}
										});
					}

					$scope.invalidToken = function() {
						$http
								.get(
										endPoint
												+ 'maintenance/approval/invalid-token',
										{

										}, {}).then(
										function successCallback(response) {
											window.location.reload();
										}, function errorCallback(response) {
											console.log(response);
										});
					}

					$scope.loadDataSort = function(sortBy, sortReverse) {
						$scope.sortBy = sortBy;
						$scope.loadData($scope.page);
					}

					$scope.loadDataSearch = function(page, term) {
						$scope.newComments = [];
						$scope.pageDetail = false;
						$scope.errorSubmit = false;
						$scope.loadData(page, term);
					};

					$scope.$watch("currentPage", function() {
						$scope.loadData($scope.currentPage);
					});

				});

APP
		.controller(
				'ApprovedController',
				function($scope, $http, $rootScope, $location, $window) {
					$scope.keyIndex = 'id';
					$scope.linkAction = {
						paramId : "?id=",
						downloadPdf : "?id=PDF",
						downloadXls : "?id=XLS"
					};

					$scope.datas = null;
					$scope.modules = null;
					$scope.currentPage = 1;
					$scope.currentPageInfo = 1;
					$scope.pageSize = PAGE_SIZE;
					$scope.total = 1;
					$scope.from = 1;
					$scope.to = PAGE_SIZE;
					$scope.qlue = '';
					$scope.flagStatus = false;
					$scope.flagDate = false;
					$scope.flagInput = true;
					$scope.emptyData = false;
					$scope.msgStatus = false;
					$scope.detailId = '';
					$scope.pageDetail = false;
					$scope.comments = '';
					$scope.orderByField = 'id';
					$scope.reverseSort = false;
					$scope.todayParam = false;
					$scope.todayParamCheck = true;

					$scope.search = function() {
						$scope.secPage = '';
						this.loadData();
					};

					$scope.getIdInvestigasi = function(id) {
						$scope.detailId = id;
						$scope.loadDetailData();
					}

					$scope.onChangeValue = function(param2) {
						$scope.param2 = param2;
					}

					$scope.sortBy = ''; // set the default sort order
					// $scope.sortType = 'asc'; // set the default sort type
					$scope.sortReverse = false;

					$scope.filterData = {
						columnSelected : null,
						availableColumn : [

						],
					};

					$scope.onSelectStatus = function() {
						$http
								.get(
										endPoint
												+ 'maintenance/rekomendasi/listStatus',
										{
											params : {}
										}).success(function(response) {
									$scope.dataStatus = response.listResponse;

								});
					}

					$scope.checkToday = function() {
						return $("#todayParam").val();
					}

					$scope.loadData = function(page, qlue) {
						$scope.var1 = '0';
						$scope.var2 = '0';
						$scope.page = '';

						if ($scope.todayParamCheck) {
							$scope.todayParam = $scope.checkToday();
						} else {
							$scope.todayParam = 'false';
						}

						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						if ($scope.param1 != undefined) {
							$scope.var1 = $scope.param1;
						}
						if ($scope.param2 != undefined) {
							$scope.var2 = $scope.param2;
						}
						if ($scope.param1 == 'status' && $scope.param2 == '') {
							$scope.var2 = '1';
						}
						if ($scope.todayParam == 'true') {
							$scope.var1 = 'completedDate';
							var dateString = '';
							var _date = new Date();
							dateString = _date.getFullYear()
									+ "-"
									+ (_date.getMonth() + 1 < 10 ? '0'
											+ (_date.getMonth() + 1) : _date
											.getMonth() + 1)
									+ "-"
									+ (_date.getDate() < 10 ? '0'
											+ (_date.getDate()) : _date
											.getDate());
							$scope.var2 = dateString;
						} else if ($scope.todayParam == 'false') {
							if ($scope.param1 == 'recommenDate'
									|| $scope.param1 == 'investDate'
									|| $scope.param1 == 'reviewDate'
									|| $scope.param1 == 'completedDate') {
								var dateString = '';
								if ($scope.param2 != undefined
										&& $scope.param2 != '') {
									var _date = $scope.param2;
									dateString = _date.getFullYear()
											+ "-"
											+ (_date.getMonth() + 1 < 10 ? '0'
													+ (_date.getMonth() + 1)
													: _date.getMonth() + 1)
											+ "-"
											+ (_date.getDate() < 10 ? '0'
													+ (_date.getDate()) : _date
													.getDate());
								}
								$scope.var2 = dateString;
							}
						}
						if ($scope.secPage != undefined && $scope.secPage != '') {
							$scope.page = $scope.secPage
						}
						$http.get(endPoint + 'report/approved/list', {
							params : {
								'param1' : $scope.var1,
								'param2' : $scope.var2,
								'page' : $scope.page
							}
						}).success(
								function(response) {
									$scope.datas = response.listResponse;
									$scope.message = response.message;
									$scope.status = response.status;
									$scope.pageNumber = response.pageNumber;
									$scope.pageSize = response.pageSize;
									$scope.totalPage = response.totalPage;
									$scope.error = response.error;

									if ($scope.datas == 0
											|| $scope.datas == undefined) {
										$scope.emptyData = true;
									} else {
										$scope.emptyData = false;
									}
								});
					};

					$scope.inputParam = function(param) {
						$scope.param1 = param;
						if ($scope.param1 != 'recommenDate'
								&& $scope.param1 != 'investDate'
								&& $scope.param1 != 'reviewDate'
								&& $scope.param1 != 'completedDate') {
							$scope.param2 = '';
						}
						if (param == 'status') {
							$scope.flagStatus = true;
							$scope.flagInput = false;
							$scope.flagDate = false;
							this.onSelectStatus();
						} else if (param == 'recommenDate'
								|| param == 'investDate'
								|| param == 'reviewDate'
								|| param == 'completedDate') {
							$scope.flagStatus = false;
							$scope.flagInput = false;
							$scope.flagDate = true;
						} else {
							$scope.flagStatus = false;
							$scope.flagInput = true;
							$scope.flagDate = false;
						}
					}

					$scope.download = function(datas, extend) {
						$http.get(endPoint + '/report/approved/download', {
							params : {
								'dataList' : JSON.stringify(datas),
								'extend' : extend
							}
						}).success(function(response) {
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.error = response.error;

							$scope.loadDataSearch();
						});
					}

					$scope.loadDetailData = function(page, qlue) {
						$scope.dataDetail = [];
						$scope.failedApprove = false;

						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						$http
								.get(
										endPoint
												+ 'maintenance/rekomendasi/detailInvestigasi',
										{
											params : {
												'id' : $scope.detailId
											}
										}).success(function(response) {
									$scope.dataDetail = response.content;
									$scope.message = response.message;
									$scope.status = response.status;
									$scope.comments = response.comments;
									$scope.idDetail = $scope.detailId;
									$scope.error = response.error;
									$scope.reason = '';
									$scope.pageDetail = true;

									if ('invalid_token' == $scope.error) {
										$scope.invalidToken();
									}

								});
					};

					$scope.detailCIF = function(cif, source) {
						$http
								.get(
										endPoint
												+ '/maintenance/rekomendasi/detailCif',
										{
											params : {
												'cif' : cif,
												'source' : source
											}
										})
								.success(
										function(response) {
											$scope.datasCifDetail = response.objectResponse;
											$scope.message = response.message;
											$scope.status = response.status;
											$scope.error = response.error;
											if ($scope.datasCifDetail != undefined
													&& $scope.datasCifDetail != null) {
												if ($scope.datasCifDetail.dteBirth != undefined
														&& $scope.datasCifDetail.dteBirth != null) {
													$scope.datasCifDetail.dteBirth = formatterDate($scope.datasCifDetail.dteBirth);
												}
											}
											if ('invalid_token' == $scope.error) {
												$scope.invalidToken();
											}
										});
					}

					$scope.invalidToken = function() {
						$http.get(endPoint + 'report/rejected/invalid-token',
								{}, {}).then(
								function successCallback(response) {
									window.location.reload();
								}, function errorCallback(response) {
									console.log(response);
								});
					}

					$scope.getPage = function(totalPage) {
						return new Array(totalPage);
					}

					$scope.pagging = function(secPage) {
						$scope.secPage = secPage;
						$scope.loadData();
					}

					$scope.loadDataSort = function(sortBy, sortReverse) {
						$scope.sortBy = sortBy;
						$scope.loadData($scope.page);
					}

					$scope.loadDataSearch = function(page, term) {
						$scope.pageDetail = false;
						$scope.loadData(page, term);
					};

					$scope.$watch("currentPage", function() {
						$scope.pageDetail = false;
						$scope.loadData($scope.currentPage);
					});

				});

APP
		.controller(
				'RejectedController',
				function($scope, $http, $rootScope, $location, $window) {
					$scope.keyIndex = 'id';
					$scope.linkAction = {
						paramId : "?id=",
						downloadPdf : "?id=PDF",
						downloadXls : "?id=XLS"
					};

					$scope.datas = null;
					$scope.modules = null;
					$scope.currentPage = 1;
					$scope.currentPageInfo = 1;
					$scope.pageSize = PAGE_SIZE;
					$scope.total = 1;
					$scope.from = 1;
					$scope.to = PAGE_SIZE;
					$scope.qlue = '';
					$scope.flagStatus = false;
					$scope.flagDate = false;
					$scope.flagInput = true;
					$scope.emptyData = false;
					$scope.msgStatus = false;
					$scope.detailId = '';
					$scope.pageDetail = false;
					$scope.comments = '';
					$scope.orderByField = 'id';
					$scope.reverseSort = false;
					$scope.todayParam = false;
					$scope.todayParamCheck = true;

					$scope.search = function() {
						$scope.secPage = '';
						this.loadData();
					};

					$scope.onChangeValue = function(param2) {
						$scope.param2 = param2;
					}

					$scope.sortBy = ''; // set the default sort order
					// $scope.sortType = 'asc'; // set the default sort type
					$scope.sortReverse = false;

					$scope.filterData = {
						columnSelected : null,
						availableColumn : [

						],
					};

					$scope.checkToday = function() {
						return $("#todayParam").val();
					}

					$scope.getIdInvestigasi = function(id) {
						$scope.detailId = id;
						$scope.loadDetailData();
					}

					$scope.loadData = function(page, qlue) {
						$scope.var1 = '0';
						$scope.var2 = '0';
						$scope.varPage = '';

						if ($scope.todayParamCheck) {
							$scope.todayParam = $scope.checkToday();
						} else {
							$scope.todayParam = 'false';
						}
						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						if ($scope.param1 != undefined) {
							$scope.var1 = $scope.param1;
						}
						if ($scope.param2 != undefined) {
							$scope.var2 = $scope.param2;
						}
						if ($scope.param1 == 'status' && $scope.param2 == '') {
							$scope.var2 = '1';
						}
						if ($scope.todayParam == 'true') {
							$scope.var1 = 'completedDate';
							var dateString = '';
							var _date = new Date();
							dateString = _date.getFullYear()
									+ "-"
									+ (_date.getMonth() + 1 < 10 ? '0'
											+ (_date.getMonth() + 1) : _date
											.getMonth() + 1)
									+ "-"
									+ (_date.getDate() < 10 ? '0'
											+ (_date.getDate()) : _date
											.getDate());
							$scope.var2 = dateString;
						} else if ($scope.todayParam == 'false') {
							if ($scope.param1 == 'recommenDate'
									|| $scope.param1 == 'investDate'
									|| $scope.param1 == 'reviewDate'
									|| $scope.param1 == 'completedDate') {
								var dateString = '';
								if ($scope.param2 != undefined
										&& $scope.param2 != '') {
									var _date = $scope.param2;
									dateString = _date.getFullYear()
											+ "-"
											+ (_date.getMonth() + 1 < 10 ? '0'
													+ (_date.getMonth() + 1)
													: _date.getMonth() + 1)
											+ "-"
											+ (_date.getDate() < 10 ? '0'
													+ (_date.getDate()) : _date
													.getDate());
								}
								$scope.var2 = dateString;
							}
						}
						if ($scope.secPage != undefined && $scope.secPage != '') {
							$scope.varPage = $scope.secPage
						}

						$http.get(endPoint + 'report/rejected/list', {
							params : {
								'param1' : $scope.var1,
								'param2' : $scope.var2,
								'page' : $scope.varPage
							}
						}).success(function(response) {
							$scope.datas = response.listResponse;
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.pageNumber = response.pageNumber;
							$scope.pageSize = response.pageSize;
							$scope.totalPage = response.totalPage;
							$scope.error = response.error;

							$scope.todayParamCheck = false;
							if ($scope.datas == 0) {
								$scope.emptyData = true;
							} else {
								$scope.emptyData = false;
							}
						});
					};

					$scope.onSelectStatus = function() {
						$http
								.get(
										endPoint
												+ 'maintenance/rekomendasi/listStatus',
										{
											params : {}
										}).success(function(response) {
									$scope.dataStatus = response.listResponse;

								});
					}

					$scope.inputParam = function(param) {
						$scope.param1 = param;
						if ($scope.param1 != 'recommenDate'
								&& $scope.param1 != 'investDate'
								&& $scope.param1 != 'reviewDate'
								&& $scope.param1 != 'completedDate') {
							$scope.param2 = '';
						}
						if (param == 'status') {
							$scope.flagStatus = true;
							$scope.flagInput = false;
							$scope.flagDate = false;
							this.onSelectStatus();
						} else if (param == 'recommenDate'
								|| param == 'investDate'
								|| param == 'reviewDate'
								|| param == 'completedDate') {
							$scope.flagStatus = false;
							$scope.flagInput = false;
							$scope.flagDate = true;
						} else {
							$scope.flagStatus = false;
							$scope.flagInput = true;
							$scope.flagDate = false;
						}
					}

					$scope.download = function(datas, extend) {
						$http.get(endPoint + '/report/rejected/download', {
							params : {
								'dataList' : JSON.stringify(datas),
								'extend' : extend
							}
						}).success(function(response) {
							$scope.message = response.message;
							$scope.status = response.status;
							$scope.error = response.error;

							$scope.loadDataSearch();
						});
					}

					$scope.loadDetailData = function(page, qlue) {
						$scope.dataDetail = [];
						$scope.failedApprove = false;

						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						$http
								.get(
										endPoint
												+ 'maintenance/rekomendasi/detailInvestigasi',
										{
											params : {
												'id' : $scope.detailId
											}
										}).success(function(response) {
									$scope.dataDetail = response.content;
									$scope.message = response.message;
									$scope.status = response.status;
									$scope.comments = response.comments;
									$scope.idDetail = $scope.detailId;
									$scope.error = response.error;
									$scope.reason = '';
									$scope.pageDetail = true;

									if ('invalid_token' == $scope.error) {
										$scope.invalidToken();
									}

								});
					};

					$scope.detailCIF = function(cif, source) {
						$http
								.get(
										endPoint
												+ '/maintenance/rekomendasi/detailCif',
										{
											params : {
												'cif' : cif,
												'source' : source
											}
										})
								.success(
										function(response) {
											$scope.datasCifDetail = response.objectResponse;
											$scope.message = response.message;
											$scope.status = response.status;
											$scope.error = response.error;
											if ($scope.datasCifDetail != undefined
													&& $scope.datasCifDetail != null) {
												if ($scope.datasCifDetail.dteBirth != undefined
														&& $scope.datasCifDetail.dteBirth != null) {
													$scope.datasCifDetail.dteBirth = formatterDate($scope.datasCifDetail.dteBirth);
												}
											}
											if ('invalid_token' == $scope.error) {
												$scope.invalidToken();
											}
										});
					}

					$scope.invalidToken = function() {
						$http.get(endPoint + 'report/rejected/invalid-token',
								{}, {}).then(
								function successCallback(response) {
									window.location.reload();
								}, function errorCallback(response) {
									console.log(response);
								});
					}

					$scope.getPage = function(totalPage) {
						return new Array(totalPage);
					}

					$scope.pagging = function(secPage) {
						$scope.secPage = secPage;
						$scope.loadData();
					}

					$scope.loadDataSort = function(sortBy, sortReverse) {
						$scope.sortBy = sortBy;
						$scope.loadData($scope.page);
					}

					$scope.loadDataSearch = function(page, term) {
						$scope.pageDetail = false;
						$scope.loadData(page, term);
					};

					$scope.$watch("currentPage", function() {
						$scope.pageDetail = false;
						$scope.loadData($scope.currentPage);
					});

				});

APP.controller('InquiryController', function($scope, $http, $rootScope,
		$location, $window) {
	$scope.keyIndex = 'id';
	$scope.linkAction = {
		paramId : "?gcnNo="
	};

	$scope.datas = null;
	$scope.modules = null;
	$scope.currentPage = 1;
	$scope.currentPageInfo = 1;
	$scope.pageSize = PAGE_SIZE;
	$scope.total = 1;
	$scope.from = 1;
	$scope.to = PAGE_SIZE;
	$scope.qlue = '';
	$scope.flagStatus = false;
	$scope.flagDate = false;
	$scope.flagInput = true;
	$scope.emptyData = false;
	$scope.msgStatus = false;
	$scope.detailId = '';
	$scope.pageDetail = false;
	$scope.tableClick = false;

	$scope.search = function() {
		$scope.secPage = undefined;
		$scope.loadDatas();
	};

	$scope.onChangeValue = function(param2) {
		$scope.param2 = param2;
	}

	$scope.sortBy = ''; // set the default sort order
	// $scope.sortType = 'asc'; // set the default sort type
	$scope.sortReverse = false;

	$scope.filterData = {
		columnSelected : null,
		availableColumn : [

		],
	};

	$scope.loadDatas = function(page, qlue) {
		var paramCif = '';
		var paramGcn = '';
		var paramName = '';
		var parambirtDate = '';
		var paramMother = ''
		var paramktp = '';
		var paramNpwp = '';
		var paramNoHp = '';
		var secPage = '';

		if (page != undefined) {
			$scope.currentPage = page;
		}
		if (qlue != undefined) {
			$scope.qlue = qlue;
		}
		if ($scope.paramCif != undefined) {
			paramCif = $scope.paramCif;
		}
		if ($scope.paramGcn != undefined) {
			paramGcn = $scope.paramGcn;
		}
		if ($scope.paramName != undefined) {
			paramName = $scope.paramName;
		}
		if ($scope.parambirtDate != undefined) {
			var dateString = '';
			var _date = $scope.parambirtDate;
			dateString = _date.getFullYear()
					+ ''
					+ (_date.getMonth() + 1 < 10 ? '0' + (_date.getMonth() + 1)
							: _date.getMonth() + 1)
					+ ''
					+ (_date.getDate() < 10 ? '0' + (_date.getDate()) : _date
							.getDate());
			parambirtDate = dateString;
		}
		if ($scope.paramMother != undefined) {
			paramMother = $scope.paramMother;
		}
		if ($scope.paramktp != undefined) {
			paramktp = $scope.paramktp;
		}
		if ($scope.paramNpwp != undefined) {
			paramNpwp = $scope.paramNpwp;
		}
		if ($scope.paramNoHp != undefined) {
			paramNoHp = $scope.paramNoHp;
		}
		if ($scope.secPage != undefined) {
			secPage = $scope.secPage;
		}
		$http.get(endPoint + 'inquiryGCN/inquiry/list', {
			params : {
				'paramCif' : paramCif,
				'paramGcn' : paramGcn,
				'paramName' : paramName,
				'parambirtDate' : parambirtDate,
				'paramMother' : paramMother,
				'paramktp' : paramktp,
				'paramNpwp' : paramNpwp,
				'paramNoHp' : paramNoHp,
				'secPage' : secPage
			}
		}).success(function(response) {
			$scope.datas = response.listResponse;
			$scope.message = response.message;
			$scope.status = response.status;
			$scope.error = response.error;
			$scope.last = response.last;
			$scope.totalPage = response.totalPage;
			$scope.pageNumber = response.pageNumber;
			$scope.pageSize = response.pageSize;
			$scope.tableClick = true;

			if ('invalid_token' == $scope.error) {
				$scope.invalidToken();
			}

			if ($scope.datas != null && $scope.datas != undefined) {
				if ($scope.datas.length > 0) {
					$scope.emptyData = true;
				} else {
					$scope.emptyData = false;
				}
			}

		});
	};

	$scope.invalidToken = function() {
		$http.get(endPoint + 'inquiryGCN/inquiry/invalid-token', {

		}, {}).then(function successCallback(response) {
			window.location.reload();
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	$scope.getPage = function(totalPage) {
		return new Array(totalPage);
	}

	$scope.pagging = function(secPage) {
		$scope.secPage = secPage;
		$scope.loadDatas();
	}

	$scope.loadDataSort = function(sortBy, sortReverse) {
		$scope.sortBy = sortBy;
		$scope.loadDatas($scope.page);
	}

	$scope.loadDataSearch = function(page, term) {
		$scope.pageDetail = false;
		$scope.loadDatas(page, term);
	};

	/*
	 * $scope.$watch("currentPage", function() {
	 * $scope.loadDatas($scope.currentPage); });
	 */

});

APP.controller('InquiryDetailController', function($scope, $http, $rootScope,
		$location, $window) {
	$scope.keyIndex = 'id';
	$scope.linkAction = {};

	$scope.datas = null;
	$scope.modules = null;
	$scope.currentPage = 1;
	$scope.currentPageInfo = 1;
	$scope.pageSize = PAGE_SIZE;
	$scope.total = 1;
	$scope.from = 1;
	$scope.to = PAGE_SIZE;
	$scope.qlue = '';
	$scope.dataDetailCB = [];
	$scope.dataDetailCC = [];
	$scope.dataDetailJF = [];

	$scope.search = function() {
		$scope.loadDatas();
	};

	$scope.onChangeValue = function(param2) {
		$scope.param2 = param2;
	}

	$scope.sortBy = ''; // set the default sort order
	// $scope.sortType = 'asc'; // set the default sort type
	$scope.sortReverse = false;

	$scope.filterData = {
		columnSelected : null,
		availableColumn : [

		],
	};

	$scope.search = function(cifNo, source) {
		$scope.cifNo = cifNo;
		$scope.source = source;
		$scope.loadDatas();
	}

	$scope.loadDatas = function(page, qlue) {
		var paramCif = '';
		var paramSource = '';

		if ($scope.cifNo != undefined) {
			paramCif = $scope.cifNo;
		}
		if ($scope.source != undefined) {
			paramSource = $scope.source;
		}
		$http.get(endPoint + 'inquiryGCN/inquiry/list-account', {
			params : {
				'paramCif' : paramCif,
				'paramSource' : paramSource
			}
		}).success(function(response) {
			if ($scope.source == 'CB') {
				$scope.dataDetailCB = response.listResponse;
				if ($scope.dataDetailCB.length > 0) {
					$scope.dataRowCB = true;
				} else {
					$scope.dataRowCB = false;
				}
			} else if ($scope.source == 'CC') {
				$scope.dataDetailCC = response.listResponse;
				if ($scope.dataDetailCC.length > 0) {
					$scope.dataRowCC = true;
				} else {
					$scope.dataRowCC = false;
				}
			} else if ($scope.source == 'JF') {
				$scope.dataDetailJF = response.listResponse;
				if ($scope.dataDetailJF.length > 0) {
					$scope.dataRowJF = true;
				} else {
					$scope.dataRowJF = false;
				}
			}

			$scope.message = response.message;
			$scope.status = response.status;
			$scope.error = response.error;

		});
	};

	$scope.loadDataSort = function(sortBy, sortReverse) {
		$scope.sortBy = sortBy;
		$scope.loadDatas($scope.page);
	}

	$scope.loadDataSearch = function(page, term) {
		$scope.pageDetail = false;
		$scope.loadDatas(page, term);
	};

});

APP.controller('dashboardController', function($scope, $http, $rootScope,
		$location, $window) {
	$scope.keyIndex = 'id';
	$scope.datas = null;

	$scope.loadData = function(page, qlue) {

		$http.get(endPoint + '/dashboard/analytic', {
			params : {}
		}).success(function(response) {
			$scope.datas = response.objectResponse;
			$scope.error = response.error;

			if ('invalid_token' == $scope.error) {
				$scope.invalidToken();
			}

		});
	};

	$scope.invalidToken = function() {
		// return invalidConfirm(function() {
		$http.get(endPoint + '/dashboard/invalid-token', {

		}, {}).then(function successCallback(response) {
			window.location.reload();
		}, function errorCallback(response) {
			console.log(response);
		});
		// });
	}

	$scope.$watch("currentPage", function() {
		$scope.loadData($scope.currentPage);
	});

});

APP.controller('DataInquiryController', function($scope, $http, $rootScope,
		$location, $window) {

	$scope.keyIndex = 'id';
	$scope.linkAction = {};

	$scope.datas = null;
	$scope.currentPage = 1;
	$scope.currentPageInfo = 1;
	$scope.pageSize = PAGE_SIZE;
	$scope.total = 1;
	$scope.from = 1;
	$scope.to = PAGE_SIZE;
	$scope.qlue = '';
	$scope.emptyData = false;

	$scope.sortBy = ''; // set the default sort order
	// $scope.sortType = 'asc'; // set the default sort type
	$scope.sortReverse = false;

	$scope.filterData = {
		columnSelected : null,
		availableColumn : [

		],
	};

	$scope.pagging = function(secPage) {
		$scope.secPage = secPage;
		$scope.loadData();
	}

	$scope.DateFormatter = function(arg) {
		if (arg == '' || arg == undefined) {
			return '';
		}
		return arg.substring(0, 2) + "/" + arg.substring(2, 4) + "/"
				+ arg.substring(4, 8);
	};

	$scope.search = function() {
		this.loadData();
	}

	$scope.viewDetail = function(arg) {
		$scope.detail = arg;
	}

	// part synchronization between save file and gain datas when save
	// background.
	setInterval(function() {
		if ($scope.paramVal == undefined && $scope.paramKey == undefined) {
			var paramKey = '0';
			var paramVal = '0';

			if ($scope.paramVal != undefined) {
				paramVal = $scope.paramVal;
			}

			if ($scope.paramKey != undefined) {
				paramKey = $scope.paramKey;

				if (paramKey == 'custDob') {
					paramVal = paramVal.replace('/', '');
				}
			}

			if ($scope.secPage == undefined) {
				$scope.secPage = '0';
			}

			$http.get(endPoint + 'blacklist/datainquiry/list/asynch', {
				params : {
					'paramKey' : paramKey,
					'paramVal' : paramVal,
					'secPage' : $scope.secPage,
				}
			}).success(function(response) {
				$scope.datas = response.listResponse;
				$scope.message = response.message;
				$scope.status = response.status;
				$scope.error = response.error;
				$scope.totalPage = response.totalPage;
				$scope.pageNumber = response.pageNumber;
				if ($scope.datas.length > 0) {
					$scope.emptyData = false;
				} else {
					$scope.emptyData = true;
				}
			});
		}
	}, 1000);

	$scope.loadData = function(page, qlue) {
		var paramKey = '0';
		var paramVal = '0';

		if ($scope.paramVal != undefined) {
			paramVal = $scope.paramVal;
		}

		if ($scope.paramKey != undefined) {
			paramKey = $scope.paramKey;

			if (paramKey == 'custDob') {
				paramVal = paramVal.replace('/', '');
			}
		}

		if ($scope.secPage == undefined) {
			$scope.secPage = '0';
		}

		$http.get(endPoint + 'blacklist/datainquiry/list', {
			params : {
				'paramKey' : paramKey,
				'paramVal' : paramVal,
				'secPage' : $scope.secPage
			}
		}).success(function(response) {
			$scope.datas = response.listResponse;
			$scope.message = response.message;
			$scope.status = response.status;
			$scope.error = response.error;
			$scope.totalPage = response.totalPage;
			$scope.pageNumber = response.pageNumber;
			if ($scope.datas.length > 0) {
				$scope.emptyData = false;
			} else {
				$scope.emptyData = true;
			}
		});
	};

	$scope.pagging = function(secPage) {
		$scope.secPage = secPage;
		$scope.loadData();
	}

	$scope.loadDataSort = function(sortBy, sortReverse) {
		$scope.sortBy = sortBy;
		$scope.loadData($scope.page);
	}

	$scope.loadDataSearch = function(page, term) {
		$scope.loadData(page, term);
	};

	$scope.$watch("currentPage", function() {
		$scope.loadData($scope.currentPage);
	});

});

APP.controller('DataInputBlacklistController', function($scope, $http,
		$rootScope, $location, $window, SharingData) {
	$scope.selectFlag = function(blacklistFlagTemp) {
		var list = $scope.datas;
		for (var i = 0; i < list.length; i++) {
			if (list[i].id == blacklistFlagTemp) {
				$scope.blacklistFlagTempDesc = list[i].blacklistFlagDesc;
				break;
			}
		}
	}

	$scope.gcnCekMasukKagak = function(){
		
		$scope.custDob;
	}
	
	$scope.selectFlagDesc = function(blacklist) {
		var list = $scope.datas;
		for (var i = 0; i < list.length; i++) {
			if (list[i].blacklistFlag == blacklist) {
				$scope.blacklistFlagTemp = list[i].id;
				$scope.blacklistFlagTempDesc = list[i].blacklistFlagDesc;
				break;
			}
		}
	}
	
	$scope.cannotSave = false;

	$scope.getGcnData = function() {
        
		$http.get(endPoint + '/blacklist/datainput/getDataGcnProfile', {
			params : {
				'idnId' : $scope.IdNo,
				'nmeFull' : $scope.custName,
				'dteBirth' : $scope.custDob
			}
		}).success(function(response) {
			debugger;
			var list = response.objectResponse;
			if (list != '' || list != undefined) {
				
				if(list.idn_mobile_phone!=null)
				$scope.phoneNo = list.idn_mobile_phone;
				if(list.cde_gender != null)
				$scope.custGender = list.cde_gender;
				if(list.crdacct_nbr != null)
				$scope.cifBg = list.crdacct_nbr;
				if(list.noseri != null)
				$scope.cifCC = list.noseri;
				if(list.no_rekening != null)
				$scope.cifMojf = list.no_rekening;
				if(list.idn_svp != null)
				$scope.gcnNo = list.idn_svp;
				if(list.idn_party != null)
				$scope.cifHost = list.idn_party;
				if(list.nationality != null)
				$scope.addressCountry = list.nationality;
				if(list.cfdhn != null)
				$scope.dhnbiBlacklistNo = list.cfdhn;
				if(list.cfurut != null)
				$scope.dhnbiSeqNo = list.cfurut;
				if(list.cfref != null)
				$scope.dhnbiRefNo = list.cfref;
				if(list.cfnamb != null)
				$scope.dhnbiBankName = list.cfnamb;
				if(list.cfbasd != null)
				$scope.dhnbiDateEnd = list.cfbasd;
				if(list.cfnpwp != null)
				$scope.npwpNo = list.cfnpwp;
				if(list.idType != null)
				$scope.idType = list.idType;
				if(list.blacklistFlag != null)
				$scope.selectFlagDesc(list.blacklistFlag);
				if(list.addressCity != null)
				$scope.addressCity = list.addressCity;
				if(list.address != null)
				$scope.address = list.address;
				if(list.addressProvince != null)
				$scope.addressProvince = list.addressProvince;
				if(list.addressPostalCode != null)
				$scope.addressPostalCode = list.addressPostalCode;
				if( list.nationality!= null)
				$scope.addressCountry = list.nationality;
				if(  list.custType!= null)
				$scope.custType = list.custType;
				if(  list.startDate!= null)
				$scope.startDate = list.startDate; 	
				if(  list.endDate!= null)
				$scope.endDate = list.endDate;
			}
		});
		// e.cfdhn, e.cfurut, e.cfref, e.cfnamb, e.cfbasd, e.cfnpwp
	}

	$http.get(endPoint + '/blacklist/listparameter/BlacklistParameter/all', {
		params : {
			'secPage' : '',
			'isPaging' : false
		}
	}).success(function(response) {
		$scope.datas = response.listResponse;
		$scope.message = response.message;
		$scope.status = response.status;
		$scope.error = response.error;
		$scope.totalPage = response.totalPage;
		$scope.pageNumber = response.pageNumber;
	});

	$scope.Date = function(arg) {
		return new Date(arg);
	}

	$scope.save = function() {
		var idData = $scope.idData;
		var csrf = $scope._csrf.token;

		var config = {
			headers : {
				'Accept' : 'application/json, */*',
				'x-csrf-token' : csrf
			}
		};
		
		
		$scope.cannotSave = false;
		
//		if(($scope.custName == undefined || $scope.custName == "") ||
//				($scope.IdNo == undefined || $scope.IdNo == "") ||
//			($scope.custDob == undefined || $scope.custDob == "")	){
//			
//			$scope.cannotSave = true;
//			return;
		//}else{
			
		var data = {
			idData : idData,
			custName : $scope.custName,
			gcnNo : $scope.gcnNo,
			cifHost : $scope.cifHost,
			idNo : $scope.IdNo,
			idType : $scope.idType,
			npwpNo : $scope.npwpNo,
			custDob : $scope.custDob,
			custGender : $scope.custGender,
			custType : $scope.custType,
			blacklistFlagTemp : $scope.blacklistFlagTemp,
			phoneNo : $scope.phoneNo,
			startDate : $scope.startDate,
			endDate : $scope.endDate,
			addressCity : $scope.addressCity,
			address : $scope.address,
			addressProvince : $scope.addressProvince,
			addressPostalCode : $scope.addressPostalCode,
			addressCountry : $scope.addressCountry,
			description : $scope.description,
			cifBg : $scope.cifBg,
			cifCC : $scope.cifCC,
			cifMojf : $scope.cifMojf,
			dhnbiBlacklistNo : $scope.dhnbiBlacklistNo,
			dhnbiSeqNo : $scope.dhnbiSeqNo,
			dhnbiRefNo : $scope.dhnbiRefNo,
			dhnbiBankName : $scope.dhnbiBankName,
			dhnbiDateEnd : $scope.dhnbiDateEnd
		};

		$http.post(endPoint + 'blacklist/datainput/save', data, config).then(
				function(response) {
					if (idData == '' || idData == undefined) {
						$window.location.href = endPoint
								+ 'blacklist/datainquiry';
					} else {
						$window.location.href = endPoint
								+ '/blacklist/datamaintenance';
					}
				}, function errorCallback(response) {
					$window.alert(response.data);
				});
		//}
	}

	$scope.downloadFile = function() {
		$http.get(endPoint + 'blacklist/datainput/downloadFile').success(
				function(response) {
					$scope.downloadHref = response.objectResponse;
				});
	};

	$scope.saveFiles = function() {
		var url = endPoint + 'blacklist/datainput/save/files';
		var csrf = $scope._csrf.token;
		var reader = new FileReader();
        if($scope.input == undefined){
        	$scope.cannotSave = true;
        	return;
        }
		reader.onload = function() {
			
			dataURL = reader.result;
			var config = {
				headers : {
					'Accept' : 'application/json, */*',
					'x-csrf-token' : csrf
				}
			};
			$http.post(url, dataURL, config).then(function(response) {
				$window.location.href = endPoint + 'blacklist/datainquiry';
			}, function errorCallback(response) {
				$window.alert("error : " + response.errorMessage);
			});
		}
		reader.readAsDataURL($scope.input.files[0]);
	}

	if ($scope.totalPageFile == undefined) {
		$scope.totalPageFile = 1;
	}
	if ($scope.pageNumberFile == undefined || scope.pageNumberFile == '') {
		$scope.pageNumberFile = 1;
	}

	$scope.paggingFile = function(page) {
		$scope.pageNumberFile = page;
		var csrf = $scope._csrf.token;
		var reader = new FileReader();
		reader.onload = function() {
			dataURL = reader.result;
			var url = endPoint + 'blacklist/datainput/uploadWebService/'
					+ $scope.pageNumberFile;
			var config = {
				headers : {
					'Accept' : 'application/json, */*',
					'x-csrf-token' : csrf
				}
			};

			$http.post(url, dataURL, config).then(function(response) {
				
				if (response.data.error == 'NO ERROR') {

					$scope.dataFiles = response.data.listResponse;
					$scope.totalPageFile = response.data.totalPage;
				} else {
				}
			}, function errorCallback(response) {
				alert('error');
				$window.alert(response.errorMessage);
			});
		}
		reader.readAsDataURL($scope.input.files[0]);

	}

	$scope.readExcelFile = function(event) {
		var csrf = $scope._csrf.token;
		$scope.input = event.target;
		var size = $scope.input.files[0].size;
		var reader = new FileReader();

		if (size < 393216) {
			reader.onload = function() {
				dataURL = reader.result;
				var url = endPoint + 'blacklist/datainput/uploadWebService/'
						+ $scope.pageNumberFile;
				var config = {
					headers : {
						'Accept' : 'application/json, */*',
						'x-csrf-token' : csrf
					}
				};

				$http.post(url, dataURL, config).then(function(response) {
					if (response.data.error == 'NO ERROR') {
						debugger;
						$scope.dataFiles = response.data.listResponse;
						$scope.totalPageFile = response.data.totalPage;
					} else {
					}
				}, function errorCallback(response) {
					$window.alert(response.errorMessage);
				});
			}
		} else {
			$window.alert('Ukuran file terlalu besar');
		}

		reader.readAsDataURL($scope.input.files[0]);
	}
});

APP
		.controller(
				'blacklistParameterController',
				function($scope, $http, $rootScope, $location, $window) {
					$scope.errorParameter = false;
					$scope.errorSave = false;
					$scope.errorRequired = false;
					$scope.nameRequired = null;
					$scope.emptyData = false;

					$scope.linkAction = {
						paramId : '?id='
					};

					$scope.sizeModel = [ {
						'blacklistFlag' : '',
						'blacklistFlagDesc' : ''
					} ];

					$scope.addModel = function() {
						$scope.sizeModel.push({
							'blacklistFlag' : '',
							'blacklistFlagDesc' : ''
						});
					}

					// function load parameter
					$scope.onParameter = function(parameter, index) {
						$scope.sizeModel[index].blacklistFlag = parameter;
					}

					// function load description
					$scope.onDescription = function(description, index) {
						$scope.sizeModel[index].blacklistFlagDesc = description;
					}

					$scope.validateParameterFlag = function(model) {
						for (var i = 0; i < model.length; i++) {
							for (var j = i; j < model.length; j++) {
								if (model[i].blacklistFlag == model[j].blacklistFlag
										&& i != j) {
									return false;
								}
							}
						}
						return true;
					}

					$scope.validateRequired = function(model) {
						for (var i = 0; i < model.length; i++) {
							if (model[i].blacklistFlag == ''
									|| model[i].blacklistFlag == null) {
								$scope.nameRequired = 'Parameter';
								return true;
							}
							if (model[i].blacklistFlagDesc == ''
									|| model[i].blacklistFlagDesc == null) {
								$scope.nameRequired = 'Deskripsi';
								return true;
							}
						}
					}

					$scope.save = function(model) {
						var bool = true;
						if ($scope.validateRequired(model)) {
							$scope.errorRequired = true;
							return;
						}

						if (model.length > 0) {
							bool = $scope.validateParameterFlag(model);
						}
						if (bool) {
							$http
									.get(
											endPoint
													+ 'blacklist/listparameter/save',
											{
												params : {
													"blacklistFlag" : JSON
															.stringify(model)
												}
											})
									.success(
											function(response) {
												$scope.message = response.message;
												$scope.status = response.status;
												if ($scope.status == 200) {
													$window.location.href = endPoint
															+ 'blacklist/listparameter';
												} else {
													$scope.errorSave = true;
													$scope.datas = response.objectResponse;
												}
											});
						} else {
							$scope.errorParameter = true;
						}

					};

					var urlParams = new URLSearchParams(window.location.search);

					$scope.update = function() {
						var parameter1 = urlParams.get('id');
						if ($scope.description != null
								|| $scope.description != '') {
							$http
									.get(
											endPoint
													+ 'blacklist/listparameter/update',
											{
												params : {
													"id" : parameter1,
													"blacklistFlag" : $scope.parameter,
													"blacklistFlagDesc" : $scope.description
												}

											})
									.success(
											function(response) {
												$window.location.href = endPoint
														+ 'blacklist/listparameter';
											});
						}
					};

					$scope.loadData = function(page, qlue) {

						if (page != undefined) {
							$scope.currentPage = page;
						}
						if (qlue != undefined) {
							$scope.qlue = qlue;
						}
						if ($scope.secPage == undefined) {
							$scope.secPage = 0;
						}

						$http
								.get(
										endPoint
												+ '/blacklist/listparameter/BlacklistParameter/all',
										{
											params : {
												'secPage' : $scope.secPage,
												'isPaging' : true
											}
										}).success(function(response) {
									$scope.datas = response.listResponse;
									$scope.message = response.message;
									$scope.status = response.status;
									$scope.error = response.error;
									$scope.totalPage = response.totalPage;
									$scope.pageNumber = response.pageNumber;
									if ($scope.datas.length == 0) {
										$scope.emptyData = true;
									}
								});

					};

					$scope.sortBy = ''; // set the default sort order
					// $scope.sortType = 'asc'; // set the default sort type
					$scope.sortReverse = false;

					$scope.checkDetail = function() {
						return $("#lookDetailUser").val();
					}

					$scope.getValueGroupName = function() {
						return $("#setGroupName").val();
					}

					$scope.onChangeValue = function(paramVal) {
						$scope.paramVal = paramVal;
					}

					$scope.inputParam = function(paramKey) {
						if (paramKey == 'status') {
							$scope.flagStatus = true;
							$scope.paramVal = 'true';
						} else {
							$scope.paramVal = '';
							$scope.flagStatus = false;
						}
					}

					$scope.filterData = {
						columnSelected : null,
						availableColumn : [

						],
					};

					$scope.getPage = function(totalPage) {
						return new Array(totalPage);
					}

					$scope.pagging = function(secPage) {
						$scope.secPage = secPage;
						$scope.loadData();
					}

					$scope.loadDataSort = function(sortBy, sortReverse) {
						$scope.sortBy = sortBy;
						$scope.loadData($scope.page);
					}

					$scope.loadDataSearch = function(page, term) {
						$scope.loadData(page, term);
					};

					$scope.$watch("currentPage", function() {
						$scope.loadData($scope.currentPage);
					});

					$scope.search = function() {
						$scope.checkTotalUser = 'false';
						$scope.emptyData = false;
						this.loadData();
					};

				});

APP.controller('DataMaintenanceController', function($scope, $http, $rootScope,
		$location, $window, SharingData) {

	$scope.viewDetail = function(arg) {
		$scope.detail = arg;
	}

	$scope.keyIndex = 'id';
	$scope.linkAction = {
		paramId : "?id="
	};

	$scope.datas = null;
	$scope.currentPage = 1;
	$scope.currentPageInfo = 1;
	$scope.pageSize = PAGE_SIZE;
	$scope.total = 1;
	$scope.from = 1;
	$scope.to = PAGE_SIZE;
	$scope.qlue = '';
	$scope.emptyData = false;

	$scope.sortBy = ''; // set the default sort order
	// $scope.sortType = 'asc'; // set the default sort type
	$scope.sortReverse = false;

	$scope.DateFormatter = function(arg) {
		if (arg == '' || arg == undefined) {
			return '';
		}
		return arg.substring(0, 2) + "/" + arg.substring(2, 4) + "/"
				+ arg.substring(4, 8);
	};

	$scope.filterData = {
		columnSelected : null,
		availableColumn : [

		],
	};

	$scope.search = function() {
		$scope.loadData();
	};

	$scope.onChangeValue = function(paramVal) {
		$scope.paramVal = paramVal;
	}

	$scope.editDataMaintenance = function(noId) {
		SharingData.sendData(noId);
		// $window.location.href = endPoint+"blacklist/datainput";
	}

	$scope.loadData = function(page, qlue) {
		var paramKey = '0';
		var paramVal = '0';

		if ($scope.paramKey != undefined) {
			paramKey = $scope.paramKey;
		}

		if ($scope.paramVal != undefined) {
			paramVal = $scope.paramVal;

			if (paramKey == 'custDob') {
				paramVal = paramVal.replace('/', '');
			}
		}
		if ($scope.secPage == undefined) {
			$scope.secPage = '0';
		}

		$http.get(endPoint + 'blacklist/datamaintenance/list', {
			params : {
				'paramKey' : paramKey,
				'paramVal' : paramVal,
				'secPage' : $scope.secPage
			}
		}).success(function(response) {
			$scope.datas = response.listResponse;
			$scope.message = response.message;
			$scope.status = response.status;
			$scope.error = response.error;
			$scope.totalPage = response.totalPage;
			$scope.pageNumber = response.pageNumber;
			if ($scope.datas.length > 0) {
				$scope.emptyData = false;
			} else {
				$scope.emptyData = true;
			}
		});
	};

	$scope.pagging = function(secPage) {
		$scope.secPage = secPage;
		$scope.loadData();
	}
	$scope.getPage = function(totalPage) {
		return new Array(totalPage);
	}

	$scope.pagging = function(secPage) {
		$scope.secPage = secPage;
		$scope.loadData();
	}

	$scope.loadDataSort = function(sortBy, sortReverse) {
		$scope.sortBy = sortBy;
		$scope.loadData($scope.page);
	}

	$scope.loadDataSearch = function(page, term) {
		$scope.loadData(page, term);
	};

	$scope.$watch("currentPage", function() {
		$scope.loadData($scope.currentPage);
	});

});

APP.controller('UploadController', function($scope, $http, $rootScope,
		$location, $window) {

	$scope.keyIndex = 'id';
	$scope.linkAction = {};

	$scope.datas = null;
	$scope.currentPage = 1;
	$scope.currentPageInfo = 1;
	$scope.pageSize = PAGE_SIZE;
	$scope.total = 1;
	$scope.from = 1;
	$scope.to = PAGE_SIZE;
	$scope.qlue = '';
	var formdata = new FormData();

	$scope.sortBy = ''; // set the default sort order
	// $scope.sortType = 'asc'; // set the default sort type
	$scope.sortReverse = false;

	$scope.filterData = {
		columnSelected : null,
		availableColumn : [

		],
	};

	$scope.Upload = function() {
		var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
		if (regex.test($scope.SelectedFile.uploadingFiles.toLowerCase())) {
			if (typeof (FileReader) != "undefined") {
				var reader = new FileReader();
				// For Browsers other than IE.
				if (reader.readAsBinaryString) {
					reader.onload = function(e) {
						$scope.ProcessExcel(e.target.result);
					};
					reader.readAsBinaryString($scope.SelectedFile);
				} else {
					// For IE Browser.
					reader.onload = function(e) {
						var data = "";
						var bytes = new Uint8Array(e.target.result);
						for (var i = 0; i < bytes.byteLength; i++) {
							data += String.fromCharCode(bytes[i]);
						}
						$scope.ProcessExcel(data);
					};
					reader.readAsArrayBuffer($scope.SelectedFile);
				}
			} else {
				$window.alert("This browser does not support HTML5.");
			}
		} else {
			$window.alert("Please upload a valid Excel file.");
		}
	};

	$scope.ProcessExcel = function(data) {
		// Read the Excel File data.
		var workbook = XLSX.read(data, {
			type : 'binary'
		});

		// Fetch the name of First Sheet.
		var firstSheet = workbook.SheetNames[0];

		// Read all rows from First Sheet into an JSON array.
		var excelRows = XLSX.utils
				.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
		// Display the data from Excel file in Table.
		$scope.$apply(function() {
			$scope.Customers = excelRows;
			$scope.IsVisible = true;
		});
	};

	$scope.add = function() {
		var f = document.getElementById('fileupload').files[0];
		var r = new FileReader();

		r.onloadend = function(e) {
			var data = e.target.result;
		}
		r.readAsBinaryString(f);
	}

	$scope.selectedFiles = function(files) {
		$scope.selectedFiles = files;
	};

});

APP.controller('ReportUserMonitoringController', function($scope, $http,
		$rootScope, $location, $window) {

	$scope.keyIndex = 'id';
	$scope.linkAction = {};

	$scope.datas = null;
	$scope.currentPage = 1;
	$scope.currentPageInfo = 1;
	$scope.pageSize = PAGE_SIZE;
	$scope.total = 1;
	$scope.from = 1;
	$scope.to = PAGE_SIZE;
	$scope.qlue = '';
	$scope.emptyData = false;
	$scope.serial = 1;

	$scope.sortBy = ''; // set the default sort order
	// $scope.sortType = 'asc'; // set the default sort type
	$scope.sortReverse = false;

	$scope.filterData = {
		columnSelected : null,
		availableColumn : [

		],
	};

	$scope.loadData = function(page, qlue) {
		$scope.var1 = '0';
		$scope.var2 = '0';
		$scope.page = '';

		if (page != undefined) {
			$scope.currentPage = page;
		}
		if (qlue != undefined) {
			$scope.qlue = qlue;
		}
		if ($scope.paramKey != undefined) {
			$scope.var1 = $scope.paramKey;
		}
		if ($scope.paramVal != undefined) {
			$scope.var2 = $scope.paramVal;
		}
		if ($scope.secPage != undefined) {
			$scope.page = $scope.secPage;
		}

		$http.get(endPoint + 'report/reportuser/list', {
			params : {
				'paramKey' : $scope.var1,
				'paramVal' : $scope.var2,
				'secPage' : $scope.page
			}
		}).success(function(response) {
			$scope.datas = response.listResponse;
			$scope.message = response.message;
			$scope.status = response.status;
			$scope.error = response.error;
			$scope.pageNumber = response.pageNumber;
			$scope.pageSize = response.pageSize;
			$scope.totalPage = response.totalPage;
			if ($scope.datas == 0) {
				$scope.emptyData = true;
			} else {
				$scope.emptyData = false;
			}

		});
	};

	$scope.search = function() {
		$scope.loadData();
	};

	$scope.getPage = function(totalPage) {
		return new Array(totalPage);
	}

	$scope.pagging = function(secPage) {
		$scope.secPage = secPage;
		$scope.loadData();
	}

	$scope.loadDataSort = function(sortBy, sortReverse) {
		$scope.sortBy = sortBy;
		$scope.loadData($scope.page);
	}

	$scope.loadDataSearch = function(page, term) {
		$scope.loadData(page, term);
	};

	$scope.$watch("currentPage", function() {
		$scope.loadData($scope.currentPage);
	});

});

/**
 * Helper
 */
function getTo(pageSize, currentPage, total) {
	var to = (pageSize * currentPage);
	to = (to > total) ? total : to;
	return to;
}

function stringToDate(_date, _format, _delimiter) {
	if (_format == undefined) {
		_format = "dd-mm-yyyy";
	}
	if (_delimiter == undefined) {
		_delimiter = "-";
	}

	var formatLowerCase = _format.toLowerCase();
	var formatItems = formatLowerCase.split(_delimiter);
	var dateItems = _date.split(_delimiter);
	var monthIndex = formatItems.indexOf("mm");
	var dayIndex = formatItems.indexOf("dd");
	var yearIndex = formatItems.indexOf("yyyy");
	var month = parseInt(dateItems[monthIndex]);
	month -= 1;

	var formatedDate = new Date(dateItems[yearIndex], month,
			dateItems[dayIndex]);
	return formatedDate;
}

function deleteConfirm(callback) {
	var isConfirmed = confirm("Are you sure to delete this record ?");
	if (isConfirmed) {
		if (typeof callback == 'function') {
			callback();
		}
	} else {
		return false;
	}
}
function invalidConfirm(callback) {
	var isConfirmed = confirm("Invalid Token, please re-login");
	// if (isConfirmed) {
	// if (typeof callback == 'function') {
	callback();
	// }
	// } else {
	// return false;
	// }
}
function getParameterByName(name, url) {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex
			.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function goBack() {
	return window.history.back();
}

function setStatusDesc(approvalStatus) {
	switch (approvalStatus) {
	case 1:
		return 'Approved';
	case 2:
		return 'Rejected';
	default:
		return 'Pending Approval';
	}
}
function getFilename(inputFile) {
	if (inputFile != undefined && inputFile != '') {
		var myArr = inputFile.split("\\");
		return myArr[myArr.length - 1];
	}
	return null;
}

function formatterDate(_date) {
	var formateDt = '';
	var year = _date.slice(0, 4);
	var month = _date.slice(4, 6);
	var day = _date.slice(6, 8);
	formateDt = month + '-' + day + '-' + year;
	return formateDt;
}

APP.factory('SharingData', function() {
	var service = {};
	service.data = false;
	service.getData = function() {
		return this.data;
	}
	service.sendData = function(data) {
		this.data = data;
	}
	return service;
});
