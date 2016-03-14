// This is a JavaScript file

var myApp = angular.module('myApp', ['onsen','onsen.directives','ngRoute','firebase']);

//FACTORY

myApp.factory('Users', function($firebaseArray, $firebaseObject, FirebaseUrl){
    var usersRef = new Firebase(FirebaseUrl+'User');
    var users = $firebaseArray(usersRef);

    var Users = {
      getProfile: function(uid){
        return $firebaseObject(usersRef.child(uid));
      },
      getDisplayName: function(uid){
        return users.$getRecord(uid).name;
      },
      all: users
    };

    return Users;
  });

myApp.factory('userService', function() {
 var savedData = {};
 function set(data) {
   savedData = data;
   console.log("userService saving user" + savedData);
 }
 function get() {
  return savedData;
 }

 return {
  set: set,
  get: get
 };

});

myApp.factory('userIDService', function() {
 var savedData = {};
 function set(data) {
   savedData = data;
   console.log("userIDService saving user" + savedData);
 }
 function get() {
  return savedData;
 }

 return {
  set: set,
  get: get
 };

});

myApp.factory('userPhotoService', function() {
 var savedData = {};
 function set(data) {
   savedData = data;
 }
 function get() {
  return savedData;
 }

 return {
  set: set,
  get: get
 };

});

myApp.factory('deviceIDService', function() {
 var savedDeviceID = {};
 function set(data) {
   savedDeviceID = data;
   console.log('Saved Device ID: '+ savedDeviceID);
 }
 function get() {
  return savedDeviceID;
 }

 return {
  set: set,
  get: get
 };

});

myApp.factory('groupService', function($q) {
 var savedGroup = {};
 function set(data) {
   savedGroup = data;
   console.log('Saved Group: '+ savedGroup);
 }
 function get() {
    return savedGroup;
 };

 return {
  set: set,
  get: get
 };

});

myApp.factory('roundService', function() {
    var savedGroup = {};
    function set(data) {
       savedGroup = data;
       console.log('Saved round: '+ savedGroup);
    }
    function get() {
        return savedGroup;
    };
    return {
      set: set,
      get: get
    };
});

myApp.factory('Groups', function($firebaseArray, $firebaseObject, FirebaseUrl){
    var groupsRef = new Firebase(FirebaseUrl+'group');
    var groups = $firebaseArray(groupsRef);

    var Groups = {
      getProfile: function(uid){
        return $firebaseObject(usersRef.child(uid));
      },
      getDisplayName: function(uid){
        return groups.$getRecord(uid).name;
      },
      getGroupName: function(uid){
        return groups.$getRecord(uid).deviceID;
      },
      all: groups
    };

    return Groups;
    
  });

myApp.factory('tipsFB', ["userService","roundService","FirebaseUrl" ,"$firebaseArray",
  function (userService,roundService,FirebaseUrl, $firebaseArray) {
  //create, retrieve, update, destroy data from angularfire 
  userName = userService.get();
  roundNumber = roundService.get();
  console.log("tips for "+ userName);
  var ref = new Firebase(FirebaseUrl+ 'tips' + '/' + userName+ '/' + 'round' + roundNumber);
  var tips = $firebaseArray(ref);

  return tips;  
  
 }]);
  
myApp.factory('resultsFB', ["roundService","FirebaseUrl" ,"$firebaseArray",
  function (roundService,FirebaseUrl, $firebaseArray) {
  //create, retrieve, update, destroy data from angularfire 
  roundNumber = roundService.get();
  console.log('results '+roundNumber);
  var ref = new Firebase(FirebaseUrl+ 'results' + '/' + 'Round' + roundNumber);
  var results = $firebaseArray(ref);

  return results;

  }]);


//CONTROLLERS

myApp.controller('drawJson', ["$scope", "$http", "userService", "userIDService", "roundService", "FirebaseUrl", "$firebaseArray",
function($scope, $http, userService, userIDService, roundService, FirebaseUrl, $firebaseArray) {
    $scope.roundNumber = roundService.get();
    $http.get('draw2016.json', { cache: true}).then(function(res){
            $scope.draw = res.data;    
            //drawJSON=data;
            console.log("drawjson assigned!!!");  
    //return $scope.draw;
    }, 
    function errorCallback(response) {
        console.log("error - "+ response);
    });
    
    $scope.roundNumber = roundService.get();
    
    //$scope.roundNumber = function(){
    //    rNumber = 1;
        //console.log("rNumber = "+ rNumber);
    //    return rNumber;
    //};
    
    $scope.userName = function(){
        return userService.get();
    };
    
    $scope.roundLength = function(){
        var rNumber = 1;
        if ($scope.draw) {
            var drawJson = $scope.draw;
            var count = 0;
            for(var i = 0; i < drawJson.length; ++i){   
                if(drawJson[i].round === rNumber)
                    count++;
            }
            return count;
        }
    };
    
    
    $scope.roundNumberFull = function(){
        var currentTime = Date();
        //var currentTime = "2016-06-14 08:25:00";

        var cDate = Date.parse(currentTime);
        var gDate = Date.parse("1960-08-13 04:10:00");
        var rNumber = 0;
        var gameDate = 0;
        //var drawJson = $scope.draw;
        var i = 0;
        
        if ($scope.draw) {
            while (cDate > gDate) {
                if ( i < ($scope.draw.length)-1) {
                //console.log(i + " - " + drawJson[i].date);
                gameDate = $scope.draw[i].date;
                gDate = Date.parse(gameDate);
                i++;
                }
            }
            
            rNumber = $scope.draw[i].round;
            //console.log("rNumber = "+ rNumber);
            $scope.rNumber = rNumber;
            return rNumber;
        }
    };
    
    $scope.selections = [];
    $scope.activeIndex = 0;
    $scope.hideResults = true;
    $scope.mediaStatus = 4;
    
    $scope.next = function (team) {
        if ($scope.mediaStatus === 4) {
            //$scope.homeclass = "selected";
            // START PLAY AUDIO FUCNTION
            var src = team+".mp3";
            //Get Android path
            var path = window.location.pathname;
            path = path.substr( path, path.length - 10 );
            path = 'file://' + path;
            console.log(src);

            // Play the audio file at url
            var my_media = new Media(path+src,
            // success callback
            function () { console.log("playAudio():Audio Success"); },
            // error callback
            function (err) { console.log("playAudio():Audio Error: " + JSON.stringify(err)); },
            function (status) {
                $scope.mediaStatus = status;
                console.log("Currentmedia State - "+ status); }
            );
    
            // Play audio
            //var playTime = my_media.getDuration();
            //console.log(team+" audio duration - "+ playtime);
            my_media.play();
            
            // END PLAY AUDIO FUCNTION
                if ($scope.activeIndex === ($scope.roundLength() -1 ) ) {
                    $scope.activeIndex = $scope.activeIndex + 1;
                    $scope.hideResults = false;
                } else {
                    $scope.activeIndex = $scope.activeIndex + 1;
                    //$scope.homeclass = "";
                }
            var resultsDiv = angular.element(document.querySelector('#results'));
            $scope.selections.push(team);
        };
    };
    

    
    $scope.savetips = true;
    $scope.saveMessage = false;
    $scope.sendMessage = false;
    $scope.saveTips = function() {
        checkIfTipExists();
        $scope.savetips = false;
        $scope.saveMessage = true;
        newName = userService.get();
        userID = userIDService.get();
        roundNumber = roundService.get();
        console.log("savetips");
        console.log("tips for "+ newName);
        fbURL = FirebaseUrl+ 'tips' + '/' + userID + '/' + newName + '/' + 'round' + roundNumber;
        console.log("save tips to "+fbURL);
        var ref = new Firebase(fbURL);
        var tips = $firebaseArray(ref);
        $scope.tipArray = tips;
        var arrayLength = $scope.selections.length;
        for (var i = 0; i < arrayLength; i++) {
            $scope.tipArray.$add({team_id: $scope.selections[i]});
            //alert(myStringArray[i]);
            //Do something
        }
    };
    
    $scope.sendtips = true;
    $scope.sendMessage = false;
    $scope.sendTips = function() {
        $scope.snedtips = false;
        $scope.sendMessage = true;
        $scope.saveMessage = false;
        user = userService.get();
        var arrayLength = $scope.selections.length;
        tip_email = "";
        for (var i = 0; i < arrayLength; i++) {
            tip_email = tip_email.concat($scope.selections[i] + "\r\n");
        }
        ebody = encodeURIComponent(tip_email);
        window.location = "mailto:damon.fredrickson@gmail.com?subject=tips for " + user + " - Round " + $scope.roundNumber + "&body="+ ebody;
    };
    
    $scope.resetTips = function() {
        console.log("resettips");
        $scope.selections = [];
        $scope.activeIndex = 0;
        $scope.hideResults = true;
        $scope.mediaStatus = 4;
        app.slidingMenu.setMainPage("round.html", {closeMenu: true});
    };

    
}]);

myApp.controller("startUP", function($scope, $http, Groups, Users, roundService, userService, userIDService, groupService, deviceIDService, userPhotoService) {
    //roundService.set(1);
    $scope.userName = userService.get();
    $scope.userPhoto = userPhotoService.get();
    $scope.loading = true;
    monaca.getDeviceId(function(id){
       deviceIDService.set(id);
    });
    
    $http.get('draw2016.json', { cache: true}).then(function(res){
            $scope.draw = res.data;    
            console.log("drawjson assigned!!!");
            roundNumberFull = function(){
                var currentTime = Date();
                console.log("Getting roundNumberFull for "+ currentTime);
                //var currentTime = "2016-06-14 08:25:00";
        
                var cDate = Date.parse(currentTime);
                var gDate = Date.parse("1960-08-13 04:10:00");
                var rNumber = 0;
                var gameDate = 0;
                //var drawJson = $scope.draw;
                var i = 0;
                
                if ($scope.draw) {
                    while (cDate > gDate) {
                        if ( i < ($scope.draw.length)-1) {
                        //console.log(i + " - " + drawJson[i].date);
                        gameDate = $scope.draw[i].date;
                        gDate = Date.parse(gameDate);
                        i++;
                        }
                    }
                    
                    rNumber = $scope.draw[i].round;
                    console.log("rNumber = "+ rNumber);
                    $scope.rNumber = rNumber;
                    roundService.set(rNumber);
                    return rNumber;
                }
                else {
                    console.log("Round not save" + $scope.draw.length);
                }
            };
            $scope.roundNumber = roundNumberFull();
    },
    //return $scope.draw;
    function errorCallback(response) {
        console.log("error - "+ response);
    });
    
    
    //Check for group membership
    $scope.groups = Groups.all;
    $scope.groups.$loaded().then(function() {
        deviceID = deviceIDService.get();
        angular.forEach($scope.groups, function(key, value) {
            if (deviceID === key.deviceID) {
                groupService.set(key.name);
                $scope.groupName = (key.name);
                //$scope.groupName = "Test"
                if ($scope.groupName){
                    console.log("getting users... filter "+ $scope.groupName);
                    $scope.users = Users.all;
                    $scope.users.$loaded().then(function() {
                        $scope.loading = false;
                    });
                }
            }
        });
        if(typeof $scope.groupName === 'undefined'){
                app.slidingMenu.setMainPage("form_group.html", {closeMenu: true});
        }
        else {
            //Check for current user
            usobj = userService.get();
            if(Object.keys(usobj).length === 0 && JSON.stringify(usobj) === JSON.stringify({})){
                console.log('userService empty');
                app.slidingMenu.setMainPage("users.html", {closeMenu: true});
        }
    }
});
    
    $scope.setUser = function(uName, uID, uPhoto) {
        console.log("setUser clicked");
        userService.set(uName);
        userIDService.set(uID);
        userPhotoService.set(uPhoto);
        };
        
   
    $scope.checkTips = function() {
        console.log("check Tips clicked");
        userID = userIDService.get();
        userName = userService.get();
        roundNumber = roundService.get();
        var TIPS_LOCATION = 'https://flickering-fire-9394.firebaseio.com/tips/' + userID + '/' + userName + '/' + 'round' + roundNumber;
        var tipsRef = new Firebase(TIPS_LOCATION);
        tipsRef.once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        console.log("checkIfTipExists  - " + exists);
        //tipExistsCallback(tipId, exists);
      });
    };
    
});

myApp.controller("getUsers", function($scope, Users, userService, groupService) {
    $scope.loading = true;
    //$scope.groupName = groupService.get();
        $scope.groupName = groupService.get();
        console.log("get group "+$scope.groupName);
    

    $scope.users = Users.all;
    var userID = x.$getRecord(postId);
    $scope.users.$loaded().then(function() {
        $scope.loading = false;
    });
        
    $scope.setUser = function(uName) {
            console.log("setUser clicked");
            userService.set(uName);
        };
    });

myApp.controller("userDB", ["$scope", "groupService", "$firebaseArray", 
    function($scope,groupService, $firebaseArray) {
        $scope.loading = false;
        $scope.submit = true;
        var ref = new Firebase("https://flickering-fire-9394.firebaseio.com/User");
        var obj = $firebaseArray(ref);
        //$scope.users = $firebaseArray(ref);
        obj.$loaded().then(function() {
            $scope.users = obj;
            console.log("getting users...");
        });    
        //ADD MESSAGE METHOD
        $scope.submitUser = function() {
            $scope.loading = true;
            $scope.submit = false;
            console.log("clicked submit");
            var name = $scope.name;
            var group = groupService.get();
            $scope.photo = angular.element(document).find('img').attr('src');
            //console.log($scope.photo);
            if ($scope.photo) {
                $scope.users.$add({ name: name, photo: $scope.photo, group: group})
                    .then(function(p){
                        // do something on success
                        $scope.message = "New User Added";
                        window.location = 'index.html';
                    });
            }
        };
        
    }
]);

myApp.controller("getGroup", function($scope, groupService) {
    $scope.groupName = groupService.get();  
});

//TO BE DELETED
myApp.controller("checkGroup", function($scope, Groups, groupService, deviceIDService) {
    $scope.loading = true;
    monaca.getDeviceId(function(id){
       deviceIDService.set(id);
    });

    $scope.groups = Groups.all;
    $scope.groups.$loaded().then(function() {
        deviceID = deviceIDService.get();
        angular.forEach($scope.groups, function(key, value) {
            if (deviceID === key.deviceID) {
                groupService.set(key.name);
            }
        });
    });
    
    $scope.groupName = function(){
        return groupService.get();
    };
    console.log("Group Name "+ $scope.groupName);
});

myApp.controller("groupDB", ["$scope", "$firebaseArray", 
    function($scope, $firebaseArray) {
        $scope.loading = false;
        $scope.submit = true;
        var ref = new Firebase("https://flickering-fire-9394.firebaseio.com/group");
        var obj = $firebaseArray(ref);
        //$scope.users = $firebaseArray(ref);
        obj.$loaded().then(function() {
            $scope.group = obj;
        });
    
        //ADD MESSAGE METHOD
        $scope.submitGroup = function() {
            console.log("clicked submit");
            $scope.loading = true;
            $scope.submit = false;
            var name = $scope.name.toLowerCase();
            monaca.getDeviceId(function(id){
                $scope.group.$add({ name: name, deviceID: id})
                    .then(function(p){
                        // do something on success
                        $scope.message = "Group Added";
                        window.location = 'index.html';
                    });
                }
            )};
        }
]);

myApp.controller("ladderDB", ["$scope", "roundService", "$firebaseArray", 
  function($scope, roundService, $firebaseArray) {
    $scope.roundNumber= roundService.get();
    var ref = new Firebase("https://flickering-fire-9394.firebaseio.com/ladder");
    $scope.ladder = $firebaseArray(ref);
    
  }
]);

myApp.controller("tipsDB", ["$scope", "$route", "$timeout", "tipsFB", "resultsFB", "userService", "userIDService", "roundService","FirebaseUrl" ,"$firebaseArray",
    function($scope, $route, $timeout, tipsFB, resultsFB, userService, userIDService, roundService, FirebaseUrl , $firebaseArray) {
    $scope.loading = true;
    $scope.userName = userService.get();
    $scope.uID = userIDService.get();
    $scope.roundNumber= roundService.get();
    
    //set initial tips to show
    $scope.pRound = false;
    $scope.tRound = true;
    
    getWinners = function(obj, tips) {
        results = obj;
        winners = [];
        console.log("getting results...");
        console.log("getting results tip length " + tips.length);
        console.log("getting results results length " + results.length);
        if (tips.length === 0) {
            return winners;
        }
        if (results.length === 0) {
            for(var i = 0; i < tips.length; i++){   
                    winners.push({team: tips[i].team_id});
            }
        }
        else {
            for(var i = 0; i < results.length; i++){   
                var s = results[i];
                var n = s.match.indexOf(' ');
                winteam = s.match.substring(0, n != -1 ? n : s.length);
                if (winteam === tips[i].team_id) {
                    winners.push({team: tips[i].team_id, result: 'check'});
                }
                else {
                    winners.push({team: tips[i].team_id, result: 'times'});
                }
            }
        }
        return winners;
    };
    
    var fburl = FirebaseUrl+ 'tips' + '/' + $scope.uID + '/' + userName + '/' + 'round' + roundNumber;
    var ref = new Firebase(fburl);
    var FBtips = $firebaseArray(ref);
    $scope.tips = [];
    $scope.tips = FBtips;
    var obj = resultsFB;
    $scope.winners = [];
    
    obj.$loaded().then(function() {
        $scope.winners = getWinners(obj, $scope.tips);
        var rNumber = roundNumber - 1;
        var prevFBurl = FirebaseUrl+ 'tips' + '/' + $scope.uID + '/' + userName + '/' + 'round' + rNumber;
        var prevRef = new Firebase(prevFBurl);
        var prevFBtips = $firebaseArray(prevRef);
        prevTips = [];
        prevTips = prevFBtips;
        var resultRef = new Firebase(FirebaseUrl+ 'results' + '/' + 'Round' + rNumber);
        var prevResults = $firebaseArray(resultRef);
        var prevObj = prevResults;
        $scope.previousWinners = [];
        prevObj.$loaded().then(function() {
            $scope.previousWinners = getWinners(prevObj, prevTips);
        });
        $scope.loading = false;
    });
    
    console.log('$scope.userName - '+ $scope.userName);
    var name = $scope.userName;
    var resultUrl = fburl.split("/");
    
    //waatch for user change and refresh winners array with corect user
    $scope.$watch(
        // This function returns the value being watched. It is called for each turn of the $digest loop
        function() { return $scope.userName; },
        // This is the change listener, called when the value returned from the above function changes
        function(newValue, oldValue) {
            console.log("watch values "+newValue +" "+ resultUrl[4]);
            if ( newValue !== resultUrl[4] ) {
                console.log("Watch triggered");
                $timeout(function () {
                // 0 ms delay to reload the page.
                    console.log("Reload triggered");
                    $scope.$apply(function(){
                        console.log("Apply scope reload");
                        //$scope.$apply;
                        //$route.reload();
                        $scope.loading = true;    
                        var fburl = FirebaseUrl+ 'tips' + '/' + $scope.uID + '/' + $scope.userName + '/' + 'round' + roundNumber;
                        console.log("getting tips form "+ fburl);
                        var ref = new Firebase(fburl);
                        var FBtips = $firebaseArray(ref);
                        $scope.tips = [];
                        tipsObj = FBtips;
                        var obj = resultsFB;
                        $scope.winners = [];
                        tipsObj.$loaded().then(function() {
                            $scope.tips = tipsObj;
                            obj.$loaded().then(function() {
                                $scope.winners = getWinners(obj, $scope.tips);
                                //get previous round
                                var rNumber = roundNumber - 1;
                                var prevFBurl = FirebaseUrl+ 'tips' + '/' + $scope.uID + '/' + $scope.userName + '/' + 'round' + rNumber;
                                console.log("getting tips form "+ prevFBurl);
                                var prevRef = new Firebase(prevFBurl);
                                var prevFBtips = $firebaseArray(prevRef);
                                prevTips = [];
                                prevTipsObj = prevFBtips;
                                var resultRef = new Firebase(FirebaseUrl+ 'results' + '/' + 'Round' + rNumber);
                                var prevResults = $firebaseArray(resultRef);
                                var prevObj = prevResults;
                                $scope.previousWinners = [];
                                prevTipsObj.$loaded().then(function() {
                                    prevTips = prevTipsObj;
                                    prevObj.$loaded().then(function() {
                                        $scope.previousWinners = getWinners(prevObj, prevTips);
                                    });
                                });
                                $scope.loading = false;
                            });
                        });
                    });
                },0);
            }
        }
    );
    
    $scope.thisRound = function() {
        $scope.roundNumber = roundService.get();
        console.log("Round number "+$scope.roundNumber);
        $scope.pRound = false;
        $scope.tRound = true;
    };
    $scope.previousRound = function() {
        var rNumber = roundService.get();
        $scope.roundNumber = parseInt(rNumber, 8) - 1;
        $scope.pRound = true;
        $scope.tRound = false;
    };
    }
]);

myApp.controller("resultsDB", ["roundService","$scope", "$firebaseArray", 
  function(roundService,$scope, $firebaseArray) {
    $scope.loading = true;
    $scope.pRound = true;
    $scope.tRound = false;
    var rNumber = roundService.get();
    $scope.roundNumber = parseInt(rNumber, 8) - 1;
    var ref = new Firebase("https://flickering-fire-9394.firebaseio.com/results/Round"+rNumber);
    var obj = $firebaseArray(ref);
        //$scope.users = $firebaseArray(ref);
        obj.$loaded().then(function() {
            $scope.results = obj;
            $scope.loading = false;
            console.log("getting results...");
        });
    
    //GET previous round resuslts
    var previousref = new Firebase("https://flickering-fire-9394.firebaseio.com/results/Round"+$scope.roundNumber);
    var previousObj = $firebaseArray(previousref);
        //$scope.users = $firebaseArray(ref);
        previousObj.$loaded().then(function() {
            $scope.previousResults = previousObj;
            $scope.loading = false;
            console.log("getting previous results...");
        });
    
    //$scope.results = $firebaseArray(ref);  
     $scope.curRound = function() {
        $scope.roundNumber = roundService.get();
        console.log("Round number "+$scope.roundNumber);
        $scope.pRound = false;
        $scope.tRound = true;
    };
    $scope.lastRound = function() {
        var rNumber = roundService.get();
        $scope.roundNumber = parseInt(rNumber, 8) - 1;
        console.log("Round number "+$scope.roundNumber);
        $scope.pRound = true;
        $scope.tRound = false;
    };
  }
]);

myApp.controller("setting", function($scope, Users, userService, groupService) {
    $scope.loading = true;
    //$scope.groupName = groupService.get();
        $scope.groupName = groupService.get();
        $scope.userName = userService.get();
        $scope.users = Users.all;
});

//CONFIG
myApp.constant('FirebaseUrl', 'https://flickering-fire-9394.firebaseio.com/');
