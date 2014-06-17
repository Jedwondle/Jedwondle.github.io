"use strict";function isEmpty(a){if(null===a||void 0===a)return!0;if(a.length>0)return!1;if(0===a.length)return!0;for(var b in a)if(hasOwnProperty2.call(a,b))return!1;return!0}var app=angular.module("openstorefrontApp",["ngCookies","ngResource","ngSanitize","ngRoute","mgcrea.ngStrap","ngTagsInput"]).config(["$routeProvider","tagsInputConfigProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/userprofile",{templateUrl:"views/userprofile.html",controller:"UserProfileCtrl"}).when("/results",{templateUrl:"views/results.html",controller:"ResultsCtrl"}).otherwise({redirectTo:"/"}),b.setDefaults("tagsInput",{placeholder:"Add a tag (single space for suggestions)"}).setDefaults("autoComplete",{maxResultsToShow:15}).setActiveInterpolation("tagsInput",{placeholder:!0,addOnEnter:!0,removeTagSymbol:!0})}]).run(["$rootScope","localCache","business","$location","$route",function(a,b,c){a.Current=null,a.$on("$routeChangeStart",function(a,b,c){c&&"views/results.html"===c.loadedTemplateUrl&&resetAnimGlobals(),setTimeout(function(){$(".searchBar:input[type='text']").on("click",function(){$(this).select()})},500)}),a.$on("$viewContentLoaded",function(){a.typeahead=c.typeahead()}),a.$on("$viewModal",function(a,b){$("#"+b).modal("show")}),a.openModal=function(b,c){a.current=c,a.$broadcast("$"+b),a.$broadcast("updateBody"),a.$broadcast("$viewModal",b)}}]);app.factory("localCache",function(){var a=window.sessionStorage,b=function(b,c){if("string"!=typeof b)throw new Error("Key must be a string");"object"==typeof c&&(c=c instanceof Date?c.toString():JSON.stringify(c)),a.setItem(b,c)},c=function(b,c){if("string"!=typeof b)throw new Error("Key must be a string");return"undefined"!=typeof c&&"object"===c?JSON.parse(a.getItem(b)):"undefined"!=typeof c&&"date"===c?new Date(a.getItem(b)):a.getItem(b)},d=function(){a.clear()},e=function(b){if("string"!=typeof b)throw new Error("Key must be a string");a.removeItem(b)};return{save:b,get:c,clearAll:d,clear:e}}),app.factory("business",["localCache","$http","$q",function(a,b,c){var d=6e4,e={};return e.getFilters=function(){return MOCKDATA.filters},e.getWatches=function(){return MOCKDATA.watchTypes.watches},e.getData=function(){return MOCKDATA.assets.assets},e.getDataByType=function(a){return _.filter(MOCKDATA.assets.assets,function(b){return b.type===a})},e.getTagsList=function(){return MOCKDATA.tagsList},e.getWatches=function(){return MOCKDATA.watches},e.saveTags=function(a,b){var c=_.findWhere(MOCKDATA.assets.assets,{id:a});return e.updateTagCloud(b),(void 0===c||isEmpty(c))&&(c.assetTags=b),!0},e.setWatches=function(a){return MOCKDATA.watches=a,!0},e.search=function(b,e,f){var g=c.defer(),h=null;if(b&&e)!b&&e?(a.save("searchKey",[{key:"search",code:e}]),a.save("searchKey-time",new Date),h=e,g.resolve(h)):b&&e?(a.save("searchKey",[{key:b,code:e}]),a.save("searchKey-time",new Date),h=e,g.resolve(h)):(g.reject("There was an unexpected or unknownn error."),h=null);else{if(h=a.get("searchKey","object")){var i=a.get("searchKey-time","date"),j=new Date-i;1440*d>j?g.resolve(h):(g.reject("The searchKey has expired."),h=null)}else g.reject("The search key has not been set. Search has been reset to Default."),h=null}return f?g.promise:h},e.typeahead=function(b,c){var e=null,f=a.get("typeahead","object");if(f){var g=a.get("typeahead-time","date"),h=new Date-g;if(1440*d>h)return f;b?(e=b(),void 0!==c&&null!==c&&(e=_.pluck(e,c))):e=_.pluck(this.getData(),"name")}else e=_.pluck(this.getData(),"name");if(e)return a.save("typeahead",e),a.save("typeahead-time",new Date),e;throw new Error("We need a new target in order to refresh the data")},e.updateTagCloud=function(a){console.log("tags",a),_.each(a,function(a){_.contains(MOCKDATA.tagsList,a.text)||MOCKDATA.tagsList.push(a.text)}),MOCKDATA.tagsList.sort()},e}]),angular.module("openstorefrontApp").directive("raty",function(){return{restrict:"AE",link:function(a,b,c){c.$observe("score",function(){var d=!1;void 0!==c.readOnly&&null!==c.readOnly&&(d=!0),$(b).raty({score:c.score,number:c.number,path:c.path,readOnly:d,click:function(b){a[c.ngModel]=b,a.$apply()}})},!0)}}}),angular.module("openstorefrontApp").directive("modal",function(){return{restrict:"AE",scope:{},controller:"@",name:"controllerName",template:'<div class="modal fade {{classes}}" id="{{id}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <div ng-include="header"></div> </div> <div class="modal-body"> <div ng-include src="body"></div> </div> <div class="modal-footer"> <div ng-include="footer"></div> </div> </div> </div </div>',link:function(a,b,c){var d=a.$parent;d.$on("updateBody",function(){void 0!==d.nav&&null!==d.nav&&(a.nav=d.nav),a.body=null,a.body="views/modalDefaults/body.html",void 0!==d.classes&&null!==d.classes&&(a.classes=d.classes)}),a.header="views/modalDefaults/header.html",a.footer="views/modalDefaults/footer.html",a.body="views/modalDefaults/body.html",a.id=c.modalid,null!==c.header&&void 0!==c.header&&(a.header=c.header),null!==c.footer&&void 0!==c.footer&&(a.footer=c.footer),null!==c.body&&void 0!==c.body&&(a.body=c.body),null!==c.modalclasses&&void 0!==c.modalclasses&&(a.classes=c.modalclasses)}}}),app.controller("MainCtrl",["$scope","business","localCache","$location","$rootScope","$timeout",function(a,b,c,d,e){a.searchKey=e.searchKey,a.typeahead=null,a.typeahead=e.typeahead?e.typeahead:b.typeahead(b.getData,"name"),a.$on("$typeahead.select",function(){a.goToSearch("search",a.searchkey),a.$apply()}),a._scopename="main",a.pageTitle="DI2E Storefront Catalog",a.filters=b.getFilters(),a.goToSearch=function(c,e){"search"===c?(console.log("Search save",b.search(c,a.searchKey)),d.path("/results")):(b.search(c,e),d.path("/results"))},e.$watch("searchKey",function(){a.searchKey=e.searchKey}),a.$watch("searchKey",function(){e.searchKey=a.searchKey}),setupMain()}]),app.controller("UserProfileCtrl",["$scope","business","$rootScope",function(a,b,c){a._scopename="userprofile",a.pageTitle="DI2E Storefront Catalog",a.defaultTitle="Browse Categories",a.watches=b.getWatches(),a.total=b.getData(),a.feedbackDetails=[{id:"1",date:"Jan 4, 2014 8:25 am",comments:"This VANTAGE WESS OZONE Widget is really cool",author:"Jim Calhoun"},{id:"2",date:"01/05/2014 9:25 am",comments:"This VANTAGE WESS OZONE Widget is really cool",author:"Jill Calhoun"},{id:"3",date:"01/06/2014 10:25 am",comments:"This VANTAGE WESS OZONE Widget is really cool",author:"Jay Calhoun"}],a.user={userName:"John Q. Sample",userRole:"Admin",userMemberSince:"01/10/2012",userEmail:"john.q.sample@gmail.com"},a.userBackup=jQuery.extend(!0,{},a.user);var d=0,e=["images/wess_logo.png","images/core-map-api.png","images/maps-icon.png"];a.nav={current:null,bars:[{title:"User Profile",include:"views/userprofiletab.html"},{title:"Watches",include:"views/watchestab.html"},{title:"Component Feedback",include:"views/feedbacktab.html"}]},c.$on("$profileModal",function(){a.nav.current=c.current?c.current:"User Profile",f()});var f=function(){a.data=[],_.each(a.watches,function(b){_.each(_.where(a.total,{id:b.id}),function(c){d>2&&(d=0),c.src=e[d],d+=1,c.watched=b.watched,a.data.push(c)})})};f(),a.saveProfileChanges=function(){a.userBackup=jQuery.extend(!0,{},a.user)},a.revertProfileChanges=function(){a.user=jQuery.extend(!0,{},a.userBackup)},a.removeFromWatches=function(c){var d=_.findWhere(a.watches,{id:c});void 0===d||isEmpty(d)||a.watches.splice(_.indexOf(a.watches,d),1),a.showWatchButton=!0,b.setWatches(a.watches),f()}}]),app.controller("ResultsCtrl",["$scope","localCache","business","$filter","$timeout","$location","$rootScope","$q",function(a,b,c,d,e,f,g,h){a._scopename="results",a.tagsList=c.getTagsList(),a.tagsList.sort(),a.checkTagsList=function(b,c){var d=h.defer(),e=null;return e=" "===b?_.reject(a.tagsList,function(a){return!!_.where(c,{text:a}).length}):_.filter(a.tagsList,function(a){return a.toLowerCase().indexOf(b.toLowerCase())>-1}),d.resolve(e),d.promise},a.searchCode=null,a.searchTitle=null,a.searchDescription=null,a.details=null,a.isPage1=!0,a.showSearch=!1,a.showWatchButton=!1,a.showDetails=!1,a.orderProp="",a.query="",a.noDataMessage="You have filtered out all of the results.",a.typeahead=null,a.searchGroup=null,a.searchKey=null,a.filters=null,a.total=null,a.watches=null,a.ratingsFilter=0,a.typeahead=g.typeahead?g.typeahead:c.typeahead(c.getData,"name"),a.filteredTotal=null,a.data=null,a.rowsPerPage=10,a.pageNumber=1,a.maxPageNumber=1,a.reAdjust=function(b){if(a.searchGroup=b,a.searchKey=g.searchKey,a.filters=c.getFilters(),a.total=c.getData(),a.watches=c.getWatches(),a.filteredTotal=a.total,a.data=a.total,_.each(a.data,function(a){a.shortdescription=a.description.match(/^(.*?)[.?!]\s/)[1]+"."}),isEmpty(a.searchGroup))a.searchKey="DOALLSEARCH",a.showSearch=!0,a.searchTitle="All",a.modalTitle="All",a.searchDescription="Search all results",a.modalBody="The results found on this page are not restricted by any implied filters.";else{var d=_.pluck(a.filters,"key");_.contains(d,a.searchGroup[0].key)?(a.searchKey=a.searchGroup[0].key,a.searchCode=a.searchGroup[0].code,a.showSearch=!0,a.searchGroupItem=_.where(a.filters,{key:a.searchKey})[0],a.searchColItem=_.where(a.searchGroupItem.collection,{code:a.searchCode})[0],a.searchType=a.searchGroupItem.name,a.searchTitle=a.searchType+", "+a.searchColItem.type,a.modalTitle=a.searchType+", "+a.searchColItem.type,a.searchDescription=a.searchColItem.desc,a.modalBody=a.searchColItem.longDesc,j()):"search"===a.searchGroup[0].key?(a.searchKey="DOALLSEARCH",a.showSearch=!0,a.searchTitle=a.searchGroup[0].code,a.modalTitle=a.searchGroup[0].code,a.searchDescription="Search resutls based on the search key: "+a.searchGroup[0].code,a.modalBody="The restuls on this page are restricted by an implied filter on words similar to the search key '"+a.searchGroup[0].code+"'"):(a.searchKey="DOALLSEARCH",a.showSearch=!0,a.searchTitle="All",a.modalTitle="All",a.searchDescription="Search all results",a.modalBody="The results found on this page are not restricted by any implied filters.")}a.applyFilters()};var i=function(){c.search(!1,!1,!0).then(function(b){a.reAdjust(null===b||void 0===b?[{key:"all",code:""}]:b)},function(b){console.error("Error",b),a.reAdjust([{key:"all",code:""}])})};a.toggleclass=function(a,b){toggleclass(a,b)},a.setupModal=function(b){var c=h.defer();return""!==b?(a.classes=b,a.nav={current:"Reviews",bars:[{title:"Reviews",include:"views/reviews/reviews.html"},{title:"Write a Review",include:"views/reviews/newfeedback.html"}]},c.resolve()):(a.classes="",a.nav="",c.resolve()),c.promise},a.$on("$callSearch",function(){i()}),a.$on("$typeahead.select",function(){a.applyFilters()});var j=function(){a.searchGroup[0].key&&(a.filters=_.reject(a.filters,function(b){return b.key===a.searchGroup[0].key}))};a.$on("$viewContentLoaded",function(){e(function(){moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2")),0===fullClick&&$(window).width()>=768&&openFiltersToggle()},100)}),a.$watch("pageNumber",function(b){a.pageNumber=parseInt(b),a.pageNumber<1&&(a.pageNumber=1),a.pageNumber>a.maxPageNumber&&(a.pageNumber=a.maxPageNumber);var c=a.pageNumber;(1>c||""===c||isNaN(c)||null===c)&&(c=1),a.data=a.filteredTotal?a.filteredTotal.slice((c-1)*a.rowsPerPage,c*a.rowsPerPage):[],a.applyFilters()}),a.$watch("rowsPerPage",function(){var b=a.rowsPerPage;(1>b||""===b||isNaN(b)||null===b)&&(b=1),a.pageNumber=1,a.maxPageNumber=Math.ceil(a.filteredTotal.length/b),a.applyFilters()}),a.$watch("orderProp",function(){a.applyFilters()}),a.$watch("query",function(){a.applyFilters()}),a.$watch("ratingsFilter",function(){a.applyFilters()}),a.$on("$descModal",function(){}),a.doButtonOpen=function(){buttonOpen()},a.doButtonClose=function(){buttonClose()},a.toggleChecks=function(b){var c=!1,d=_.where(b,{checked:!0});c=isEmpty(d)?!0:d.length!==b.length?!0:!1,_.each(b,function(a){a.checked=c}),a.applyFilters()},a.updateDetails=function(b){a.showWatchButton=!_.where(a.watches,{id:b}).length,openClick||buttonOpen();var c=_.where(a.data,{id:b})[0];c&&(a.details=c),a.showDetails=!0,a.getEvaluationState()},a.addToWatches=function(b){var d=_.findWhere(a.watches,{id:b});(void 0===d||isEmpty(d))&&a.watches.push({id:b,watched:!0}),a.showWatchButton=!1,c.setWatches(a.watches)},a.saveTags=function(b,d){c.saveTags(b,d),a.applyFilters()},a.removeFromWatches=function(b){var d=_.findWhere(a.watches,{id:b});void 0===d||isEmpty(d)||a.watches.splice(_.indexOf(a.watches,d),1),a.showWatchButton=!0,c.setWatches(a.watches)},a.viewWatches=function(){f.path("/userprofile")},a.getEvaluationState=function(){if(a.details&&void 0!==a.details.conformanceState){var b=a.details.conformanceState[0].code,c=_.where(a.filters,{key:"conformanceState"})[0],d=_.where(c.collection,{code:b})[0];return d.type}return""},a.applyFilters=function(){var b=d("orderBy")(d("ratingFilter")(d("tagFilter")(d("componentFilter")(d("filter")(a.total,a.query),a.filters),a.tagsFilter),a.ratingsFilter),a.orderProp);a.filteredTotal=[""],a.filteredTotal=b,a.maxPageNumber=Math.ceil(a.filteredTotal.length/a.rowsPerPage),(a.pageNumber-1)*a.rowsPerPage>=a.filteredTotal.length&&(a.pageNumber=1),a.data=a.filteredTotal.slice((a.pageNumber-1)*a.rowsPerPage,a.pageNumber*a.rowsPerPage),e(function(){setupPopovers()},300)},i(),setupResults()}]),app.controller("NavCtrl",["$scope","$location","$rootScope","business","$route","$timeout",function(a,b,c,d){a._scopename="nav",a.searchkey=c.searchkey,a.typeahead=null,a.typeahead=c.typeahead?c.typeahead:d.typeahead(d.getData,"name"),a.$on("$typeahead.select",function(){a.goToSearch(),a.$apply()}),a.goToSearch=function(){c.searchkey=a.searchkey,d.search("search",a.searchKey,!0).then(function(){"/results"===b.path()?c.$broadcast("$callSearch"):b.path("/results")})},a.sendHome=function(){d.search("search",a.searchKey),b.path("/")},c.$watch("searchKey",function(){a.searchKey=c.searchKey}),a.$watch("searchKey",function(){c.searchKey=a.searchKey})}]),app.filter("componentFilter",function(){var a=function(a){var b=_.every(a,function(a){return a.checked===!1}),c=_.every(a,function(a){return a.checked===!0});return b||c};return function(b,c){var d=null;return d=_.filter(b,function(b){return _.every(c,function(c){var d=c.collection,e=c.key;return a(d)?!0:_.some(d,function(a){if(a.checked===!0){var c=_.pluck(b[e],"code");return _.contains(c,a.code)}return!1})})})}}),app.filter("partition",function(){var a={},b=function(b,c){if(b){for(var d=[],e=0;e<b.length;e+=c)d.push(b.slice(e,e+c));var f=JSON.stringify(b),g=a[f+c];return JSON.stringify(g)===JSON.stringify(d)?g:(a[f+c]=d,d)}};return b}),app.filter("tagFilter",function(){return function(a,b){if(isEmpty(b))return a;var c=null;return c=_.filter(a,function(a){return _.every(b,function(b){return _.some(a.assetTags,function(a){return b.text===a.text})})})}});var setupMain=function(){$(window).resize(function(){void 0!==$(".defaultSearch")&&setTimeout(function(){$(".defaultSearch").data("offset",$(".defaultSearch").offset().top+parseInt($(".defaultSearch").css("padding-top"),10)-52),floatBelowTop($(".defaultSearch"),768,$(window),$(".top").height())},10)}),$(window).scroll(function(){$(".defaultSearch")&&floatBelowTop($(".defaultSearch"),768,$(window),$(".top").height())}),$(document).ready(function(){$(".defaultSearch")&&setTimeout(function(){$(".defaultSearch").data("offset",$(".defaultSearch").offset().top+parseInt($(".defaultSearch").css("padding-top"),10)-52),floatBelowTop($(".defaultSearch"),768,$(window),$(".top").height())},10)})},setupResults=function(){$("#filtersButton").on("mouseenter",function(){filtClick||$(".filtersButton").stop(!0,!0).animate({"margin-left":"0px"},200,function(){})}),$("#filtersButton").on("mouseleave",function(){filtClick||$(".filtersButton").stop(!0,!0).animate({"margin-left":"-55px"},200,function(){})}),$(".pagination :input").on("blur",function(){(isNaN($(this).val())||""===$(this).val())&&($(this).val($(this).data("default")),$(this).trigger("input"))}),$(".pagination").on("mouseleave",function(){var a=$(".page1");a.css("overflow","auto")}),$(".pagination").on("mouseenter",function(){var a=$(".page1");a.css("overflow","hidden")}),$(".page1").scroll(function(){floatBelowTop($("#filtersButton"),3e3,$(".page1"),52),moveButtons($("#showPageRight"),this)}),$(".page2").scroll(function(){moveButtons($("#showPageLeft"),this)});var a=function(){var a=$(".page2"),b=$(".page1"),c=$(".filters"),d=$(window).height()-$(".top").height()-40;if($(window).width()<767?fullClick||(resetAnimations(a,b,c),resetAnimGlobals()):fullClick?setPageMargin(a,0):setPageMargin(a,-d),$(window).width()<=992&&openClick&&filtClick){var e=$(".pagination"),f=$(window).width();unStretchFilterbutton(),closeFilter(c,b,a,e,f),filtClick=0}setPageHeight($(".resultsContainer"),0),setRightOpenWidth(a),setLeftOpenWidth(b),setPageHeight(c,0),setPageHeight(b,40),setPageHeight(a,0),$("#filtersButton").data("offset","0"),floatBelowTop($("#filtersButton"),3e3,$(".page1"),52),moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2"))};$(document).ready(function(){a()}),$(window).resize(function(){a()})},openClick=0,fullClick=0,filtClick=0,resetStyles=function(a){a.attr("style","")},floatBelowTop=function(a,b,c,d){if(c.width()<=b){var e=a.data("offset"),f=c.scrollTop();f>e?a.css({position:"fixed",top:d+"px","z-index":"1010",padding:"0px",margin:"0px"}):resetStyles(a)}else resetStyles(a)},moveButtons=function(a,b){var c=$(b).scrollTop(),d=$(b).height()/2,e=c+d-45;a.css({top:e+"px"})},setRightOpenWidth=function(a){var b,c=400;1===filtClick&&(c=650),b=fullClick?$(window).width():$(window).width()-c,a.css({width:b+"px"})},setLeftOpenWidth=function(a){var b=$(window).width();1===filtClick?(1===openClick&&(b=650),b-=250):1===openClick&&(b=400),a.css({width:b+"px"})},setPageHeight=function(a,b){var c=$(window).height()-$(".top").height();a.css({height:c-b+"px"})},setPageMargin=function(a,b){a.css({"margin-top":b+"px"})},stretchFilterbutton=function(){var a=$(".filtersButton");a.stop(!0,!0).animate({width:"248px","margin-left":"-250px"},200,function(){})},unStretchFilterbutton=function(){var a=$(".filtersButton");a.stop(!0,!0).animate({width:"74px","margin-left":"-55px"},200,function(){})},openDetails=function(a,b,c){b.css({display:"inherit"});var d=$(window).height()-$(".top").height()-40;setPageMargin(b,-d);var e=400;1===filtClick&&(e=650);var f=c-e;a.stop(!0,!0).animate({width:"400px"},200,function(){}),b.stop(!0,!0).animate({"margin-left":"-="+f+"px",width:c-e+"px"},200,function(){})},closeDetails=function(a,b,c){a.css({display:"inherit"});var d=$(window).height()-$(".top").height()-40;setPageMargin(b,-d);var e=c;1===filtClick&&(e=c-250),a.stop(!0,!0).animate({width:e+"px"},200,function(){}),b.stop(!0,!0).animate({width:"0px","margin-left":"100%"},200,function(){b.css({width:"100%",display:"none"})})},openFullDetails=function(a,b,c){b.css({display:"inherit"}),a.stop(!0,!0).animate({width:"0px"},200,function(){a.css({display:"none"}),b.css({"margin-top":"0px"})}),b.stop(!0,!0).animate({width:c+"px","margin-left":"0px"},200,function(){})},closePartialDetails=function(a,b,c){var d=400;1===filtClick&&(d=650),a.css({display:"inherit"});var e=$(window).height()-$(".top").height()-40;setPageMargin(b,-e),a.stop(!0,!0).animate({width:d+"px"},200,function(){}),b.stop(!0,!0).animate({width:c-d+"px","margin-left":d+"px"},200,function(){})},openFilter=function(a,b,c,d,e){b.css({display:"inherit"}),a.css({display:"inherit"});var f=$(window).height()-$(".top").height()-40;setPageMargin(c,-f),1===openClick?(b.stop(!0,!0).animate({"margin-left":"250px"},200,function(){}),d.stop(!0,!0).animate({"margin-right":"-250px"},200,function(){}),a.stop(!0,!0).animate({width:"250px"},200,function(){}),c.stop(!0,!0).animate({"margin-left":"650px",width:e-650+"px"},200,function(){})):(b.stop(!0,!0).animate({"margin-left":"250px",width:e-250+"px"},200,function(){}),d.stop(!0,!0).animate({"margin-right":"-250px"},200,function(){}),a.stop(!0,!0).animate({width:"250px"},200,function(){}))},closeFilter=function(a,b,c,d,e){b.css({display:"inherit"});var f=$(window).height()-$(".top").height()-40;setPageMargin(c,-f),1===openClick?(b.stop(!0,!0).animate({"margin-left":"0px"},200,function(){}),d.stop(!0,!0).animate({"margin-right":"0px"},200,function(){}),a.stop(!0,!0).animate({width:"0px"},200,function(){a.css({display:"none"})}),c.stop(!0,!0).animate({"margin-left":"400px",width:e-400+"px"},200,function(){})):(b.stop(!0,!0).animate({"margin-left":"0px",width:"100%"},200,function(){}),d.stop(!0,!0).animate({"margin-right":"0px"},200,function(){}),a.stop(!0,!0).animate({width:"0px"},200,function(){a.css({display:"none"})}))},openWindowToggle=function(){moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2"));var a=$(window).width(),b=$(".page1"),c=$(".page2");setTimeout(function(){0===openClick?(992>=a&&filtClick&&openFiltersToggle(),openDetails(b,c,a),openClick=1):(closeDetails(b,c,a),openClick=0)},100)},fullDetailsToggle=function(){moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2"));var a=$(window).width(),b=$(".filters"),c=$(".page1"),d=$(".page2"),e=$(".pagination");setTimeout(function(){0===fullClick?(unStretchFilterbutton(),closeFilter(b,c,d,e,a),filtClick=0,openFullDetails(c,d,a),fullClick=1):1===fullClick&&(closePartialDetails(c,d,a),fullClick=0)},100)},closeDetailsFull=function(){moveButtons($("#showPageRight"),$(".page1")),moveButtons($("#showPageLeft"),$(".page2"));var a=$(window).width(),b=$(".page1"),c=$(".page2");setTimeout(function(){closeDetails(b,c,a),fullClick=0},100)},openFiltersToggle=function(){var a=$(window).width(),b=$(".page1"),c=$(".filters"),d=$(".page2"),e=$(".pagination");setTimeout(function(){0===filtClick?(992>=a&&openClick&&openWindowToggle(),stretchFilterbutton(),openFilter(c,b,d,e,a),filtClick=1):(unStretchFilterbutton(),closeFilter(c,b,d,e,a),filtClick=0)},100)},buttonOpen=function(){if($(window).width()>767)if(openClick){if(fullClick)return;fullDetailsToggle()}else openWindowToggle();else if(openClick){if(fullClick)return;fullDetailsToggle()}else openClick=1,fullDetailsToggle()},buttonClose=function(){if($(window).width()>767){if(!openClick)return;fullClick?fullDetailsToggle():openWindowToggle()}else{if(!openClick)return;fullClick?(fullClick=0,openWindowToggle()):openWindowToggle()}},resetAnimGlobals=function(){openClick=0,fullClick=0,filtClick=0},resetAnimations=function(a,b,c){unStretchFilterbutton(),resetStyles(a),resetStyles(b),resetStyles(c),resetAnimGlobals()},setupPopovers=function(){$("[data-toggle='popover']").length>2&&$(".lastPopover[data-toggle='popover']").last().popover({trigger:"hover",placement:"top",html:!0}),$("[data-toggle='popover']").popover({trigger:"hover",placement:"bottom",html:!0})},toggleclass=function(a,b){$("#"+a).toggleClass(b)},hasOwnProperty2=Object.prototype.hasOwnProperty;!function(){if(!window.localStorage){if(window.globalStorage){try{window.localStorage=window.globalStorage}catch(a){}return}var b=document.createElement("div"),c="localStorage";if(b.style.display="none",document.getElementsByTagName("head")[0].appendChild(b),b.addBehavior){b.addBehavior("#default#userdata");var d=window.localStorage={length:0,setItem:function(a,d){b.load(c),a=e(a),b.getAttribute(a)||this.length++,b.setAttribute(a,d),b.save(c)},getItem:function(a){return b.load(c),a=e(a),b.getAttribute(a)},removeItem:function(a){b.load(c),a=e(a),b.removeAttribute(a),b.save(c),this.length--,this.length<0&&(this.length=0)},clear:function(){b.load(c);for(var a=0;attr=b.XMLDocument.documentElement.attributes[a++];)b.removeAttribute(attr.name);b.save(c),this.length=0},key:function(a){return b.load(c),b.XMLDocument.documentElement.attributes[a]}},e=function(a){return a.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g,"-")};b.load(c),d.length=b.XMLDocument.documentElement.attributes.length}}if(!window.sessionStorage){if(window.globalStorage){try{window.sessionStorage=window.globalStorage}catch(a){}return}var b=document.createElement("div"),c="sessionStorage";if(b.style.display="none",document.getElementsByTagName("head")[0].appendChild(b),b.addBehavior){b.addBehavior("#default#userdata");var f=window.sessionStorage={length:0,setItem:function(a,d){b.load(c),a=e(a),b.getAttribute(a)||this.length++,b.setAttribute(a,d),b.save(c)},getItem:function(a){return b.load(c),a=e(a),b.getAttribute(a)},removeItem:function(a){b.load(c),a=e(a),b.removeAttribute(a),b.save(c),this.length--,this.length<0&&(this.length=0)},clear:function(){b.load(c);for(var a=0;attr=b.XMLDocument.documentElement.attributes[a++];)b.removeAttribute(attr.name);b.save(c),this.length=0},key:function(a){return b.load(c),b.XMLDocument.documentElement.attributes[a]}},e=function(a){return a.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g,"-")};b.load(c),f.length=b.XMLDocument.documentElement.attributes.length}}}(),app.directive("enterEvent",function(){return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.ngEnter,{event:b})}),b.preventDefault())})}}),app.filter("ratingFilter",function(){return function(a,b){if(!isNaN(b)&&b>=0&&5>=b){var c=null;return c=_.filter(a,function(a){return a.stats.averageRating>=b})}return a}});