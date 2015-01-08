---
layout: post
title: Angular的AMD使用方式
categories: [javascript]
tags: [angular, amd]
---

在使用__angular__的时候，有个比较蛋疼的情况，就是__angular__采用的是先注册，后使用的策略。
例如下面这个例子：

HTML

{% highlight html %}

    <div ng-controller="helloController">
        hello {{ user.name }}
    </div>

{% endhighlight %}

JS

{% highlight javascript %}

    function helloController($scope) {
        $scope.user = {
            name : 'world'
        }
    }

{% endhighlight %}

在__angular__启动，扫描dom结构去找指令前，你的__helloController__必须先注册。这样使得__angular__在结合__require__这样的amd模块管理器时，十分的麻烦，先来看个例子。

HTML

{% highlight html %}

    <div ng-controller="helloController">
        hello {{ user.name }}
    </div>

{% endhighlight %}

JS:main.js

{% highlight javascript %}

    require.config({
        paths : {
            'app' : 'app'
            'angular' : 'angular'
        },
        shim : {
            'angular' : {exports : 'angular'}
        }
    });
    require(['app']);

{% endhighlight %}

JS:app.js

{% highlight javascript %}

    define(['angular'], function(angular) {
        var app = angular.module('app', []);
        app.controller('helloController', function($scope) {
            $scope.user = {
                name : 'world'
            };
        });
    });

{% endhighlight %}

<br />
这时你会发现__angular__居然报错了，错了，了...

其实这是由于在__require__加载__angular__的时候，dom已经ready了，__angular__加载成功后会马上执行dom扫描，这时__app__模块，以及__app__模块里的__helloController__还没来得及注册，所以就只能悲催的报错了。

为了解决这个问题，__angular__提供了一个叫 __NG DEFER BOOTSTRAP!__ 的机制。首先，你需要在__angular__进行dom扫描前，设置

{% highlight javascript %}

    window.name = 'NG_DEFER_BOOTSTRAP!'

{% endhighlight %}

然后在注册完__app__模块，以及__helloController__后，手动调用

{% highlight javascript %}

    angular.resumeBootstrap(['app']);

{% endhighlight %}

这样，__angular__就会正常的执行dom扫描，一切妥妥的。

<br>
然后问题这样就解决了吗，其实还没有，在调用

{% highlight javascript %}

    angular.resumeBootstrap(['app']);

{% endhighlight %}

前，你还是必须要把所有的__controller__都注册好，包括使用__ngRoute__来调用的__controller__。这时问题就来了，如果你的应用比较大，不可能一次就加载全部的__controller__，那肿么办呢？

这时你可以借助__ngRoute__的__resolve__机制，即在路由对应的__controller__启动前，动态加入外部依赖：

JS:app.js

{% highlight javascript %}

    define(['angular', 'ngRoute'], function(angular) {
        var app = angular.module('app', ['ngRoute']);
        app.config(['$controllerProvider', function($controllerProvider) {
            angular.extend(app, {
                controller : function(name, constructor) {
                    $controllerProvider.register(name, constructor);
                    return this;
                }
            });
        }]);
        app.config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl : './tmpl/index.html',
                controller  : 'helloController',
                resolve     {
                    'amdHelloController' : ['$q', '$rootScope', function($q, $rootScope) {
                        var defer = $q.defer();

                        require(['helloController'], function (amdHelloController) {
                            defer.resolve(amdHelloController);
                            $rootScope.$apply();
                        });

                        return defer.promise;
                    }];
                }
            });
        }]);
        return app;
    });

{% endhighlight %}

JS:helloController.js

{% highlight javascript %}

    define(['app'], function(app) {
        app.controller('helloController', ['$scope', function($scope) {
            $scope.user = {
                name : 'world'
            };
        }]);
    });

{% endhighlight %}

这样，所有问题就已经解决啦，我们就可以愉快的玩耍__angular__与__require__了。

<br>
最后给个彩蛋，上面写的解决方案虽然不错，但每次都要写一个长长的resolve毕竟还是比较麻烦的。所以，我把这些都封装好丢到github上了，有兴趣的小伙伴，可以去看看，也十分欢迎大家fork我的repo（[https://github.com/lizzz0523/angular-amd-seed/tree/master][1]）。

[1]: https://github.com/lizzz0523/angular-amd-seed/tree/master