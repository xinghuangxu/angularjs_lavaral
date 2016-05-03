<?php

use \Spark\Utils\Elmo;

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('planner');
});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

// LDAP authentication routes
Route::post('ldapAuth', 'LdapAuthController@ldapAuth');
Route::get('ldapCheck', 'LdapAuthController@ldapCheck');
Route::post('ldapLogout', 'LdapAuthController@ldapLogout');

//Route Filters

 /* ELMO Logging */
Route::filter('elmolog', function()
{

    $sparkUser = "unknown_spark_user";
    if (Session::has('laravelUser')) {
        $sparkUser = Session::get('laravelUser')->Username;
    }

    $elmo = new Elmo();
    $data = $elmo -> getRestApiTrackingData($sparkUser);
    $content = json_encode($data);

    $elmo -> postToElmo($content);
});

// Define all /rest/* routes, which should all be for REST resources
Route::group(array('prefix' => 'rest', 'before' => 'elmolog'), function() {

    Route::resource('boxcarScopes','BoxcarScopesController',
                    ['only' => ['index', 'show', 'store']]);

    Route::group(array('prefix' => 'alm', 'namespace' => 'ALM'), function() {
        Route::resource('databases','DatabasesController',
                        ['only' => ['index']]);
        Route::resource('databases.testCases','TestCasesController',
                        ['only' => ['index', 'show']]);
        Route::resource('databases.folder','FolderController',
                        ['only' => ['index', 'show']]);
        Route::resource('databases.testsets','TestSetController',
                        ['only' => ['index', 'show']]);
        Route::resource('databases.testcaseinstances','TestCaseInstancesController',
                        ['only' => ['index', 'show']]);
        Route::resource('databases.testcasefolders','TestCaseFoldersController',
                        ['only' => ['index', 'show']]);
        Route::resource('databases.testcasesbyfolder','TestCasesByFolderController',
                        ['only' => ['index', 'show']]);
        Route::get('testCases', 'PolyTestCasesController@index');
    });

    Route::group(array('prefix' => 'planner', 'namespace' => 'Planner'), function() {
        Route::resource('stacks','StacksController',
                        ['only' => ['index', 'show']]);
        Route::resource('stacks.substacks','SubStacksController',
                        ['only' => ['index']]);
        Route::resource('testplans','TestplansController',
                        ['only' => ['index', 'show', 'store', 'update']]);
        Route::resource('testplans.teststrategies', 'TestplanStrategyController',
                        ['only' => ['index', 'store', 'destroy']]);
        Route::resource('testplans.scopes', 'TestplanScopesController',
                        ['only' => ['index', 'update']]);
        Route::get('tmptestplan/toplist', 'TmpTestPlanController@ListTopServices');
        Route::get('tmptestplan/tscategories', 'TmpTestPlanController@ListTestPlanCategories');
        Route::get('tmptestplan/tstestcases', 'TmpTestPlanController@ListTestCases');
        Route::get('tmptestplan/arrangeby', 'TmpTestPlanController@ListArrangeBy');
        Route::resource('tmptestplan', 'TmpTestPlanController', ['only' => ['index']]);

        //The scopestrategymappings end points will help facilitate the high level scoping currently being performed in Legacy
        //
        // Route::resource('testplans.scopestrategymappings','TestplanScopeStrategyMappingsController',
        //                 ['only' => ['index', 'show', 'store', 'destroy']]);
        // Route::resource('testplans.scopestrategymappings.alm','TestplanScopeAlmController',
        //                 ['only' => ['index', 'store', 'destroy']]);
        // Route::resource('testplans.scopestrategymappings.rally','TestplanScopeRallyController',
        //                 ['only' => ['index', 'store', 'destroy']]);
    });

    Route::group(array('prefix' => 'cq', 'namespace' => 'CQ'), function() {
        Route::resource('boxcars','BoxcarsController',
                        ['only' => ['index', 'show']]);
        Route::resource('boxcars.prs','PRsController',
                        ['only' => ['index', 'show']]);
        Route::resource('boxcars.enhreqs','EnhReqsController',
                        ['only' => ['index', 'show']]);
        Route::resource('boxcars.reqxs','ReqxsController',
                        ['only' => ['index', 'show']]);
        Route::resource('boxcars.devrequests','DevRequestsController',
                        ['only' => ['index', 'show']]);

        Route::resource('devrequests','DevRequestsController',
                        ['only' => ['index', 'show']]);
        Route::resource('devrequests.implrequests','ImplRequestsController',
                        ['only' => ['index', 'show']]);

        Route::resource('prs','PRsController',
                        ['only' => ['index', 'show']]);
        Route::resource('enhreqs','EnhReqsController',
                        ['only' => ['index', 'show']]);
        Route::resource('reqxs','ReqxsController',
                        ['only' => ['index', 'show']]);
        Route::resource('implrequests','ImplRequestsController',
                        ['only' => ['index', 'show']]);
        Route::resource('tasks','TasksController',
                        ['only' => ['index', 'show']]);

        Route::resource('releases','ReleasesController',
                        ['only' => ['index', 'show']]);
        Route::resource('defects','DefectsController',
                        ['only' => ['index', 'show']]);
        Route::resource('rccas','RCCAsController',
                        ['only' => ['index', 'show']]);

    });

    Route::post('strategies/{strategyId}/rev', 'TestStrategysController@revision')->name('rest.strategies.rev');
    Route::post('strategies/{strategyId}/vary', 'TestStrategysController@variation')->name('rest.strategies.vary');
    Route::post('strategies/{strategyId}/approve', 'TestStrategysController@approve')->name('rest.strategies.approve');
    Route::post('strategies/{strategyId}/promote', 'TestStrategysController@promote')->name('rest.strategies.promote');
    Route::post('strategies/{strategyId}/demote', 'TestStrategysController@demote')->name('rest.strategies.demote');
    Route::post('strategies/{strategyId}/obsolete', 'TestStrategysController@obsolete')->name('rest.strategies.obsolete');

    Route::resource('strategies/{strategyId}/associations', 'TestStrategyAssociationsController',
                        ['only' => ['index','show']]);

    Route::resource('strategies','TestStrategysController',
                    ['only' => ['index', 'show', 'store', 'update']]);
    Route::resource('strategies.testcases', 'TestStrategyTestCaseController',
                    ['only' => ['index', 'store', 'destroy']]);



    Route::group(array('prefix' => 'requirements'), function() {
        Route::resource('adhocs', 'AdhocsController',
                ['only' => ['index', 'show', 'store', 'update']]);

        Route::resource('archdocs','ArchdocsController',
                ['only' => ['index', 'show']]);

        Route::resource('doctypes','DocTypesController',
                ['only'=>['index']]);

    });

    Route::resource('scopes','ScopesController',
                    ['only' => ['index', 'show']]);

    Route::resource('users','UsersController',
                    ['only' => ['index', 'show']]);

    Route::resource('testrepositories','TestRepositoriesController',
                    ['only' => ['index']]);

    Route::get('tags/qual-areas', 'TagsController@getQualAreas');
    Route::get('tags/impact-areas', 'TagsController@getImpactAreas');
    Route::get('tags/test-approaches', 'TagsController@getTestStrategyApproaches');
    Route::resource('tags','TagsController',
                    ['only' => ['index']]);


    Route::group(array('prefix' => 'rally', 'namespace' => 'Rally'), function(){
        Route::resource('projects', 'ProjectController',
                        ['only' => ['index']]);
        Route::resource('projects.iterations','IterationController',
                        ['only' => ['index']]);
        Route::resource('projects.releases','ReleaseController',
                        ['only' => ['index']]);
        Route::resource('projects.owners','MemberController',
                        ['only' => ['index', 'show']]);
        Route::resource('userstories', 'UserStoryController',
                        ['only' => ['index', 'show', 'destroy', 'create', 'edit']]);
        Route::resource('tasks', 'TaskController',
                        ['only' => ['index', 'show', 'destroy', 'create', 'edit']]);
    });

    Route::group(array('prefix' => 'ci'), function() {
        Route::resource('runchecktests', 'RunCheckTestsController',
                ['only' => ['index', 'show']]);

        Route::resource('products','ProductsController',
                ['only' => ['index', 'show']]);

    });


    //Version-2 APIs
    Route::group(array('prefix' => 'v2', 'namespace' => 'v2'), function() {

        Route::group(array('prefix' => 'requirements'), function() {
            Route::resource('archdocs','ArchDocsController',
                            ['only'=>['index', 'show']]);
            Route::resource('archdocs.topics','ArchDocsTopicsController',
                            ['only'=>['index', 'show']]);
        });

        Route::resource('tags/{tagGroupId}/{tagId?}','TagsController',
                        ['only'=>['index']]);

    });

    Route::group(array('prefix'=>'SIS', 'namespace' => 'SIS'), function(){
        Route::resource('ts','tsController', ['only'=>['index']]);
        Route::resource('pr','prController', ['only'=>['index']]);
        Route::resource('rcca','rccaController', ['only'=>['index']]);
    });

});

Route::group(array('prefix' => 'api'), function() {
    Route::resource('help', 'RoutesController',
                    ['only' => ['index']]);
    Route::resource('list', 'RoutesListController',
                    ['only' => ['index']]);
});

Route::any('{path?}', function() {
    return view('planner');
});
