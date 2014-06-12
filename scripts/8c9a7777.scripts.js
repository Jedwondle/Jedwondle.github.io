"use strict";function isEmpty(a){if(null===a)return!0;if(a.length>0)return!1;if(0===a.length)return!0;for(var b in a)if(hasOwnProperty2.call(a,b))return!1;return!0}var app=angular.module("openstorefrontApp",["ngCookies","ngResource","ngSanitize","ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/userprofile",{templateUrl:"views/userprofile.html",controller:"UserProfileCtrl"}).when("/results",{templateUrl:"views/results.html",controller:"ResultsCtrl"}).otherwise({redirectTo:"/"})}]).run(["$rootScope","localCache","$location","$route",function(a){a.Current=null,a.$on("$routeChangeStart",function(a,b,c){c&&"views/results.html"===c.loadedTemplateUrl&&resetAnimGlobals(),setTimeout(function(){$(".searchBar:input[type='text']").on("click",function(){$(this).select()})},500)}),a.$on("$viewContentLoaded",function(){setupTypeahead()}),a.$on("$viewModal",function(a,b){$("#"+b).modal("show")}),a.openModal=function(b,c){a.current=c,a.$broadcast("$"+b),a.$broadcast("$viewModal",b)}}]);app.factory("localCache",function(){var a=window.sessionStorage,b=function(b,c){if("string"!=typeof b)throw new Error("Key must be a string");"object"==typeof c&&(c=c instanceof Date?c.toString():JSON.stringify(c)),a.setItem(b,c)},c=function(b,c){if("string"!=typeof b)throw new Error("Key must be a string");return"undefined"!=typeof c&&"object"===c?JSON.parse(a.getItem(b)):"undefined"!=typeof c&&"date"===c?new Date(a.getItem(b)):a.getItem(b)},d=function(){a.clear()},e=function(b){if("string"!=typeof b)throw new Error("Key must be a string");a.removeItem(b)};return{save:b,get:c,clearAll:d,clear:e}}),app.factory("business",["localCache","$http","$q",function(a){var b=6e4,c={};return c.getFilters=function(){return MOCKDATA.filters},c.getWatches=function(){return MOCKDATA.watchTypes.watches},c.getData=function(){return MOCKDATA.assets.assets},c.getDataByType=function(a){return _.filter(MOCKDATA.assets.assets,function(b){return b.type===a})},c.getWatches=function(){return MOCKDATA.watches},c.setWatches=function(a){return MOCKDATA.watches=a,!0},c.search=function(c,d){if(c&&d){if(!c&&d)return a.save("searchKey",[{key:"search",code:d}]),a.save("searchKey-time",new Date),d;if(c&&d)return a.save("searchKey",[{key:c,code:d}]),a.save("searchKey-time",new Date),d;throw new Error("There was an unexpected & unknown error.")}var e=a.get("searchKey","object");if(e){var f=a.get("searchKey-time","date"),g=new Date-f;if(.25*b>g)return e;throw new Error("The searchKey has expired.")}throw new Error("The searchKey has not been set.")},c}]),angular.module("openstorefrontApp").directive("raty",function(){return{restrict:"AE",link:function(a,b,c){c.$observe("score",function(){$(b).raty({score:c.score,number:c.number,path:c.path})},!0)}}}),angular.module("openstorefrontApp").directive("modal",function(){return{restrict:"AE",scope:{},controller:"@",name:"controllerName",template:'<div class="modal fade {{classes}}" id="{{id}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <div ng-include="header"></div> </div> <div class="modal-body"> <div ng-include="body"></div> </div> <div class="modal-footer"> <div ng-include="footer"></div> </div> </div> </div </div>',link:function(a,b,c){a.header="views/modalDefaults/header.html",a.footer="views/modalDefaults/footer.html",a.body="views/modalDefaults/body.html",a.id=c.modalid,null!==c.header&&void 0!==c.header&&(a.header=c.header),null!==c.footer&&void 0!==c.footer&&(a.footer=c.footer),null!==c.body&&void 0!==c.body&&(a.body=c.body),null!==c.modalclasses&&void 0!==c.modalclasses&&(a.classes=c.modalclasses)}}}),app.controller("MainCtrl",["$scope","business","localCache","$location","$rootScope","$timeout",function(a,b,c,d,e,f){a.searchKey=e.searchKey,a._scopename="main",a.pageTitle="DI2E Storefront Catalog",a.filters=b.getFilters(),a.goToSearch=function(c,e){"search"===c?(updateMainTypeahead(),f(function(){b.search(c,a.searchKey),d.path("/results")},200)):(b.search(c,e),d.path("/results"))},e.$watch("searchKey",function(){a.searchKey=e.searchKey}),a.$watch("searchKey",function(){e.searchKey=a.searchKey}),setupMain()}]),app.controller("UserProfileCtrl",["$scope","business","$rootScope",function(a,b,c){a._scopename="userprofile",a.pageTitle="DI2E Storefront Catalog",a.defaultTitle="Browse Categories",a.watches=b.getWatches(),a.total=b.getData(),a.feedbackDetails=[{id:"1",date:"Jan 4, 2014 8:25 am",comments:"This VANTAGE WESS OZONE Widget is really cool",author:"Jim Calhoun"},{id:"2",date:"01/05/2014 9:25 am",comments:"This VANTAGE WESS OZONE Widget is really cool",author:"Jill Calhoun"},{id:"3",date:"01/06/2014 10:25 am",comments:"This VANTAGE WESS OZONE Widget is really cool",author:"Jay Calhoun"}],a.user={userName:"John Q. Sample",userRole:"Admin",userMemberSince:"01/10/2012",userEmail:"john.q.sample@gmail.com"},a.userBackup=jQuery.extend(!0,{},a.user);var d=0,e=["images/wess_logo.png","images/core-map-api.png","images/maps-icon.png"];a.nav={current:null,bars:[{title:"User Profile",include:"views/userprofiletab.html"},{title:"Watches",include:"views/watchestab.html"},{title:"Component Feedback",include:"views/feedbacktab.html"}]},c.$on("$profileModal",function(){a.nav.current=c.current?c.current:"User Profile",f()});var f=function(){a.data=[],_.each(a.watches,function(b){_.each(_.where(a.total,{id:b.id}),function(c){d>2&&(d=0),c.src=e[d],d+=1,c.watched=b.watched,a.data.push(c)})})};f(),a.saveProfileChanges=function(){a.userBackup=jQuery.extend(!0,{},a.user)},a.revertProfileChanges=function(){a.user=jQuery.extend(!0,{},a.userBackup)},a.removeFromWatches=function(c){var d=_.findWhere(a.watches,{id:c});void 0===d||isEmpty(d)||a.watches.splice(_.indexOf(a.watches,d),1),a.showWatchButton=!0,b.setWatches(a.watches),f()}}]),app.controller("ResultsCtrl",["$scope","localCache","business","$filter","$timeout","$location","$rootScope",function(a,b,c,d,e,f,g){a._scopename="results",a.searchGroup=b.get("searchKey","object"),a.searchKey=g.searchKey,a.searchCode=null,a.searchTitle=null,a.searchDescription=null,a.details=null,a.isPage1=!0,a.showSearch=!1,a.showWatchButton=!1,a.showDetails=!1,a.orderProp="",a.query="",a.noDataMessage="You have filtered out all of the results.",a.filters=c.getFilters(),a.total=c.getData(),a.watches=c.getWatches(),null===a.searchGroup[0]&&(a.searchGroup[0]={key:"all",code:""}),a.filteredTotal=a.total,a.data=a.total,a.rowsPerPage=10,a.pageNumber=1,a.maxPageNumber=Math.ceil(a.data.length/a.rowsPerPage),_.each(a.data,function(a){a.shortdescription=a.description.match(/^(.*?)[.?!]\s/)[1]+"."});var h=function(){a.filters=_.reject(a.filters,function(b){return b.key===a.searchGroup[0].key})};if(isEmpty(a.searchGroup))a.searchKey="DOALLSEARCH",a.showSearch=!0,a.searchTitle="All",a.modalTitle="All",a.searchDescription="Search all results",a.modalBody="The results found on this page are not restricted by any implied filters.";else{var i=_.pluck(a.filters,"key");_.contains(i,a.searchGroup[0].key)?(a.searchKey=a.searchGroup[0].key,a.searchCode=a.searchGroup[0].code,a.showSearch=!0,a.searchGroupItem=_.where(a.filters,{key:a.searchKey})[0],a.searchColItem=_.where(a.searchGroupItem.collection,{code:a.searchCode})[0],a.searchType=a.searchGroupItem.name,a.searchTitle=a.searchType+", "+a.searchColItem.type,a.modalTitle=a.searchType+", "+a.searchColItem.type,a.searchDescription=a.searchColItem.desc,a.modalBody=a.searchColItem.longDesc,h()):"search"===a.searchGroup[0].key?(a.searchKey="DOALLSEARCH",a.showSearch=!0,a.searchTitle=a.searchGroup[0].code,a.modalTitle=a.searchGroup[0].code,a.searchDescription="Search resutls based on the search key: "+a.searchGroup[0].code,a.modalBody="The restuls on this page are restricted by an implied filter on words similar to the search key '"+a.searchGroup[0].code+"'"):(a.searchKey="DOALLSEARCH",a.showSearch=!0,a.searchTitle="All",a.modalTitle="All",a.searchDescription="Search all results",a.modalBody="The results found on this page are not restricted by any implied filters.")}a.$on("$viewContentLoaded",function(){e(function(){moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2")),0===fullClick&&$(window).width()>=768&&openFiltersToggle()},100)}),a.$watch("pageNumber",function(b){a.pageNumber=parseInt(b),a.pageNumber<1&&(a.pageNumber=1),a.pageNumber>a.maxPageNumber&&(a.pageNumber=a.maxPageNumber);var c=a.pageNumber;(1>c||""===c||isNaN(c)||null===c)&&(c=1),a.data=a.filteredTotal.slice((c-1)*a.rowsPerPage,c*a.rowsPerPage),a.applyFilters()}),a.$watch("rowsPerPage",function(){var b=a.rowsPerPage;(1>b||""===b||isNaN(b)||null===b)&&(b=1),a.pageNumber=1,a.maxPageNumber=Math.ceil(a.filteredTotal.length/b),a.applyFilters()}),a.$watch("orderProp",function(){a.applyFilters()}),a.$watch("query",function(){a.applyFilters()}),a.doButtonOpen=function(){buttonOpen()},a.doButtonClose=function(){buttonClose()},a.toggleChecks=function(b){var c=!1,d=_.where(b,{checked:!0});c=isEmpty(d)?!0:d.length!==b.length?!0:!1,_.each(b,function(a){a.checked=c}),a.applyFilters()},a.updateDetails=function(b){a.showWatchButton=!_.where(a.watches,{id:b}).length,openClick||buttonOpen();var c=_.where(a.data,{id:b})[0];c&&(a.details=c),a.showDetails=!0,a.getEvaluationState()},a.addToWatches=function(b){var d=_.findWhere(a.watches,{id:b});(void 0===d||isEmpty(d))&&a.watches.push({id:b,watched:!0}),a.showWatchButton=!1,c.setWatches(a.watches)},a.removeFromWatches=function(b){var d=_.findWhere(a.watches,{id:b});void 0===d||isEmpty(d)||a.watches.splice(_.indexOf(a.watches,d),1),a.showWatchButton=!0,c.setWatches(a.watches)},a.viewWatches=function(){f.path("/userprofile")},a.getEvaluationState=function(){if(a.details){var b=a.details.conformanceState[0].code,c=_.where(a.filters,{key:"conformanceState"})[0],d=_.where(c.collection,{code:b})[0];return d.type}return""},a.applyFilters=function(){var b=d("orderBy")(d("componentFilter")(d("filter")(a.total,a.query),a.filters),a.orderProp);a.filteredTotal=[""],a.filteredTotal=b,a.maxPageNumber=Math.ceil(a.filteredTotal.length/a.rowsPerPage),(a.pageNumber-1)*a.rowsPerPage>=a.filteredTotal.length&&(a.pageNumber=1),a.data=a.filteredTotal.slice((a.pageNumber-1)*a.rowsPerPage,a.pageNumber*a.rowsPerPage),e(function(){setupPopovers()},300)},g.$on("$descModal",function(){}),setupResults()}]),app.controller("NavCtrl",["$scope","$location","$rootScope","localCache","$route","$timeout",function(a,b,c,d,e,f){a._scopename="nav",a.searchKey=c.searchKey,a.goToSearchWithSearch=function(){updateNavTypeahead(),f(function(){d.save("searchKey",[{key:"search",code:a.searchKey}]),"/results"===b.path()?e.reload():b.path("/results")},200)},a.sendHome=function(){updateNavTypeahead(),f(function(){d.save("searchKey",[{key:"search",code:a.searchKey}]),b.path("/")},200)},c.$watch("searchKey",function(){a.searchKey=c.searchKey}),a.$watch("searchKey",function(){c.searchKey=a.searchKey})}]),app.filter("componentFilter",function(){var a=function(a){var b=_.every(a,function(a){return a.checked===!1}),c=_.every(a,function(a){return a.checked===!0});return b||c};return function(b,c){var d=null;return d=_.filter(b,function(b){return _.every(c,function(c){var d=c.collection,e=c.key;return a(d)?!0:_.some(d,function(a){if(a.checked===!0){var c=_.pluck(b[e],"code");return _.contains(c,a.code)}return!1})})})}}),app.filter("partition",function(){var a={},b=function(b,c){if(b){for(var d=[],e=0;e<b.length;e+=c)d.push(b.slice(e,e+c));var f=JSON.stringify(b),g=a[f+c];return JSON.stringify(g)===JSON.stringify(d)?g:(a[f+c]=d,d)}};return b});var setupMain=function(){$(window).resize(function(){$(".defaultSearch")&&setTimeout(function(){$(".defaultSearch").data("offset",$(".defaultSearch").offset().top+parseInt($(".defaultSearch").css("padding-top"),10)-52),floatBelowTop($(".defaultSearch"),768,$(window),$(".top").height())},10)}),$(window).scroll(function(){$(".defaultSearch")&&floatBelowTop($(".defaultSearch"),768,$(window),$(".top").height())}),$(document).ready(function(){$(".defaultSearch")&&setTimeout(function(){$(".defaultSearch").data("offset",$(".defaultSearch").offset().top+parseInt($(".defaultSearch").css("padding-top"),10)-52),floatBelowTop($(".defaultSearch"),768,$(window),$(".top").height())},10)})},setupResults=function(){$("#filtersButton").on("mouseenter",function(){filtClick||$(".filtersButton").stop(!0,!0).animate({"margin-left":"0px"},200,function(){})}),$("#filtersButton").on("mouseleave",function(){filtClick||$(".filtersButton").stop(!0,!0).animate({"margin-left":"-55px"},200,function(){})}),$(".pagination :input").on("blur",function(){(isNaN($(this).val())||""===$(this).val())&&($(this).val($(this).data("default")),$(this).trigger("input"))}),$(".pagination").on("mouseleave",function(){var a=$(".page1");a.css("overflow","auto")}),$(".pagination").on("mouseenter",function(){var a=$(".page1");a.css("overflow","hidden")}),$(".page1").scroll(function(){floatBelowTop($("#filtersButton"),3e3,$(".page1"),52),moveButtons($("#showPageRight"),this)}),$(".page2").scroll(function(){moveButtons($("#showPageLeft"),this)});var a=function(){var a=$(".page2"),b=$(".page1"),c=$(".filters"),d=$(window).height()-$(".top").height()-40;if($(window).width()<767?fullClick||(resetAnimations(a,b,c),resetAnimGlobals()):fullClick?setPageMargin(a,0):setPageMargin(a,-d),$(window).width()<=992&&openClick&&filtClick){var e=$(".pagination"),f=$(window).width();unStretchFilterbutton(),closeFilter(c,b,a,e,f),filtClick=0}setPageHeight($(".resultsContainer"),0),setRightOpenWidth(a),setLeftOpenWidth(b),setPageHeight(c,0),setPageHeight(b,40),setPageHeight(a,0),$("#filtersButton").data("offset","0"),floatBelowTop($("#filtersButton"),3e3,$(".page1"),52),moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2"))};$(document).ready(function(){a()}),$(window).resize(function(){a()})},openClick=0,fullClick=0,filtClick=0,resetStyles=function(a){a.attr("style","")},floatBelowTop=function(a,b,c,d){if(c.width()<=b){var e=a.data("offset"),f=c.scrollTop();f>e?a.css({position:"fixed",top:d+"px","z-index":"1010",padding:"0px",margin:"0px"}):resetStyles(a)}else resetStyles(a)},moveButtons=function(a,b){var c=$(b).scrollTop(),d=$(b).height()/2,e=c+d-45;a.css({top:e+"px"})},setRightOpenWidth=function(a){var b,c=400;1===filtClick&&(c=650),b=fullClick?$(window).width():$(window).width()-c,a.css({width:b+"px"})},setLeftOpenWidth=function(a){var b=$(window).width();1===filtClick?(1===openClick&&(b=650),b-=250):1===openClick&&(b=400),a.css({width:b+"px"})},setPageHeight=function(a,b){var c=$(window).height()-$(".top").height();a.css({height:c-b+"px"})},setPageMargin=function(a,b){a.css({"margin-top":b+"px"})},stretchFilterbutton=function(){var a=$(".filtersButton");a.stop(!0,!0).animate({width:"248px","margin-left":"-250px"},200,function(){})},unStretchFilterbutton=function(){var a=$(".filtersButton");a.stop(!0,!0).animate({width:"74px","margin-left":"-55px"},200,function(){})},openDetails=function(a,b,c){b.css({display:"inherit"});var d=$(window).height()-$(".top").height()-40;setPageMargin(b,-d);var e=400;1===filtClick&&(e=650);var f=c-e;a.stop(!0,!0).animate({width:"400px"},200,function(){}),b.stop(!0,!0).animate({"margin-left":"-="+f+"px",width:c-e+"px"},200,function(){})},closeDetails=function(a,b,c){a.css({display:"inherit"});var d=$(window).height()-$(".top").height()-40;setPageMargin(b,-d);var e=c;1===filtClick&&(e=c-250),a.stop(!0,!0).animate({width:e+"px"},200,function(){}),b.stop(!0,!0).animate({width:"0px","margin-left":"100%"},200,function(){b.css({width:"100%",display:"none"})})},openFullDetails=function(a,b,c){b.css({display:"inherit"}),a.stop(!0,!0).animate({width:"0px"},200,function(){a.css({display:"none"}),b.css({"margin-top":"0px"})}),b.stop(!0,!0).animate({width:c+"px","margin-left":"0px"},200,function(){})},closePartialDetails=function(a,b,c){var d=400;1===filtClick&&(d=650),a.css({display:"inherit"});var e=$(window).height()-$(".top").height()-40;setPageMargin(b,-e),a.stop(!0,!0).animate({width:d+"px"},200,function(){}),b.stop(!0,!0).animate({width:c-d+"px","margin-left":d+"px"},200,function(){})},openFilter=function(a,b,c,d,e){b.css({display:"inherit"}),a.css({display:"inherit"});var f=$(window).height()-$(".top").height()-40;setPageMargin(c,-f),1===openClick?(b.stop(!0,!0).animate({"margin-left":"250px"},200,function(){}),d.stop(!0,!0).animate({"margin-right":"-250px"},200,function(){}),a.stop(!0,!0).animate({width:"250px"},200,function(){}),c.stop(!0,!0).animate({"margin-left":"650px",width:e-650+"px"},200,function(){})):(b.stop(!0,!0).animate({"margin-left":"250px",width:e-250+"px"},200,function(){}),d.stop(!0,!0).animate({"margin-right":"-250px"},200,function(){}),a.stop(!0,!0).animate({width:"250px"},200,function(){}))},closeFilter=function(a,b,c,d,e){b.css({display:"inherit"});var f=$(window).height()-$(".top").height()-40;setPageMargin(c,-f),1===openClick?(b.stop(!0,!0).animate({"margin-left":"0px"},200,function(){}),d.stop(!0,!0).animate({"margin-right":"0px"},200,function(){}),a.stop(!0,!0).animate({width:"0px"},200,function(){a.css({display:"none"})}),c.stop(!0,!0).animate({"margin-left":"400px",width:e-400+"px"},200,function(){})):(b.stop(!0,!0).animate({"margin-left":"0px",width:"100%"},200,function(){}),d.stop(!0,!0).animate({"margin-right":"0px"},200,function(){}),a.stop(!0,!0).animate({width:"0px"},200,function(){a.css({display:"none"})}))},openWindowToggle=function(){moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2"));var a=$(window).width(),b=$(".page1"),c=$(".page2");setTimeout(function(){0===openClick?(992>=a&&filtClick&&openFiltersToggle(),openDetails(b,c,a),openClick=1):(closeDetails(b,c,a),openClick=0)},100)},fullDetailsToggle=function(){moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2"));var a=$(window).width(),b=$(".filters"),c=$(".page1"),d=$(".page2"),e=$(".pagination");setTimeout(function(){0===fullClick?(unStretchFilterbutton(),closeFilter(b,c,d,e,a),filtClick=0,openFullDetails(c,d,a),fullClick=1):1===fullClick&&(closePartialDetails(c,d,a),fullClick=0)},100)},closeDetailsFull=function(){moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2"));var a=$(window).width(),b=$(".page1"),c=$(".page2");setTimeout(function(){closeDetails(b,c,a),fullClick=0},100)},openFiltersToggle=function(){var a=$(window).width(),b=$(".page1"),c=$(".filters"),d=$(".page2"),e=$(".pagination");setTimeout(function(){0===filtClick?(992>=a&&openClick&&openWindowToggle(),stretchFilterbutton(),openFilter(c,b,d,e,a),filtClick=1):(unStretchFilterbutton(),closeFilter(c,b,d,e,a),filtClick=0)},100)},buttonOpen=function(){if($(window).width()>767)if(openClick){if(fullClick)return;fullDetailsToggle()}else openWindowToggle();else if(openClick){if(fullClick)return;fullDetailsToggle()}else openClick=1,fullDetailsToggle()},buttonClose=function(){if($(window).width()>767){if(!openClick)return;fullClick?fullDetailsToggle():openWindowToggle()}else{if(!openClick)return;fullClick?(fullClick=0,openWindowToggle()):openWindowToggle()}},resetAnimGlobals=function(){openClick=0,fullClick=0,filtClick=0},resetAnimations=function(a,b,c){unStretchFilterbutton(),resetStyles(a),resetStyles(b),resetStyles(c),resetAnimGlobals()},updateNavTypeahead=function(){$("[ng-model='searchKey']").trigger("input").trigger("change").trigger("keydown")},updateMainTypeahead=function(){$(".mainSearch[ng-model='searchKey']").trigger("input").trigger("change").trigger("keydown")},setupPopovers=function(){$("[data-toggle='popover']").length>2&&$(".lastPopover[data-toggle='popover']").last().popover({trigger:"hover",placement:"top",html:!0}),$("[data-toggle='popover']").popover({trigger:"hover",placement:"bottom",html:!0})},substringMatcher=function(a){return function(b,c){var d,e;d=[],e=new RegExp(b,"i"),$.each(a,function(a,b){e.test(b.name)&&d.push({value:b.name})}),c(d)}},setupTypeahead=function(){setTimeout(function(){$(".typeahead").typeahead({hint:!0,highlight:!0,minLength:1},{name:"states",displayKey:"value",source:substringMatcher(MOCKDATA.assets.assets)}),$(".typeahead").toggleClass("typeahead")},300)},hasOwnProperty2=Object.prototype.hasOwnProperty;!function(){if(!window.localStorage){if(window.globalStorage){try{window.localStorage=window.globalStorage}catch(a){}return}var b=document.createElement("div"),c="localStorage";if(b.style.display="none",document.getElementsByTagName("head")[0].appendChild(b),b.addBehavior){b.addBehavior("#default#userdata");var d=window.localStorage={length:0,setItem:function(a,d){b.load(c),a=e(a),b.getAttribute(a)||this.length++,b.setAttribute(a,d),b.save(c)},getItem:function(a){return b.load(c),a=e(a),b.getAttribute(a)},removeItem:function(a){b.load(c),a=e(a),b.removeAttribute(a),b.save(c),this.length--,this.length<0&&(this.length=0)},clear:function(){b.load(c);for(var a=0;attr=b.XMLDocument.documentElement.attributes[a++];)b.removeAttribute(attr.name);b.save(c),this.length=0},key:function(a){return b.load(c),b.XMLDocument.documentElement.attributes[a]}},e=function(a){return a.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g,"-")};b.load(c),d.length=b.XMLDocument.documentElement.attributes.length}}if(!window.sessionStorage){if(window.globalStorage){try{window.sessionStorage=window.globalStorage}catch(a){}return}var b=document.createElement("div"),c="sessionStorage";if(b.style.display="none",document.getElementsByTagName("head")[0].appendChild(b),b.addBehavior){b.addBehavior("#default#userdata");var f=window.sessionStorage={length:0,setItem:function(a,d){b.load(c),a=e(a),b.getAttribute(a)||this.length++,b.setAttribute(a,d),b.save(c)},getItem:function(a){return b.load(c),a=e(a),b.getAttribute(a)},removeItem:function(a){b.load(c),a=e(a),b.removeAttribute(a),b.save(c),this.length--,this.length<0&&(this.length=0)},clear:function(){b.load(c);for(var a=0;attr=b.XMLDocument.documentElement.attributes[a++];)b.removeAttribute(attr.name);b.save(c),this.length=0},key:function(a){return b.load(c),b.XMLDocument.documentElement.attributes[a]}},e=function(a){return a.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g,"-")};b.load(c),f.length=b.XMLDocument.documentElement.attributes.length}}}();