/**
 * Unit test definition for Spark test planner settings controllers
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-10
 *
 */

describe("Test spark.planner.settings controllers", function() {
    var $rootScope, $controller, $q, settingsSevice, testplanSettingsModalService, almFolderService;

    beforeEach(function() {
        angular.mock.module('spark');
        angular.mock.module('spark.test.templates');
        angular.mock.module('spark.planner');
        angular.mock.module('spark.planner.settings');
        
        angular.mock.inject(injector);

        injector.inject = [ '$rootScope', '$controller', '$q', 'testplanSettingsService', 'testplanSettingsModalService', 'almFolderService' ];
        function injector(_$rootScope_, _$controller_, _$q_, _testplanSettingsService_, _testplanSettingsModalService_, _almFolderService_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $q = _$q_;
            testplanSettingsService = _testplanSettingsService_;
            testplanSettingsModalService = _testplanSettingsModalService_;
            almFolderService = _almFolderService_;
        }
    });

    describe("Test SettingsPopover", function() {
        var controller, scope;

        beforeEach(function() {
            scope = $rootScope.$new();

            controller = $controller('SettingsPopover', {$scope: scope});
        });

        it('should be created', function() {
            expect(controller).toBeDefined();
        });

        it('should call functions', function() {
            expect(typeof(controller.edit)).toEqual('function');

            scope.$hide = sinon.stub();
            sinon.stub(controller.modal, 'show');

            controller.edit();
            expect(controller.modal.show.called).toBeTruthy();
            expect(scope.$hide.called).toBeTruthy();
        });

        it('should have empty data', function() {
            expect(controller.data).toEqual(testplanSettingsService.data);
            expect(controller.modal).toEqual(testplanSettingsModalService.modal);
        });
    });

    describe("Test SettingsModal", function() {
        var controller;

        beforeEach(function() {
            controller = $controller('SettingsModal', {$scope: $rootScope.$new()});
        });

        it('should be created', function() {
            expect(controller).toBeDefined();
        });

        it('should have empty data', function() {
            expect(controller.data).toEqual(testplanSettingsService.data);
            expect(controller.modal).toEqual(testplanSettingsModalService.modal);
            expect(controller.tabs.length).toEqual(2);
            expect(controller.tabs.activeTab).toEqual(0);
        });
    });

    describe("Test SettingsALM", function() {
        var controller;

        var databases = [{"name":"autodev_producttest_db","description":"Autodev Product Test"},{"name":"autodev_interop_db","description":"Autodev IOP"}];
        var root = [{ "id" : "3", "text" : "_HarborLight Internal Testing", "children" : true },{ "id" : "1551", "text" : "Legacy", "children" : true }];
        var folders = [{ "id" : "1552", "text" : "_Completed", "children" : true },{ "id" : "1553", "text" : "2015", "children" : true }];

        beforeEach(function() {
            sinon.stub(almFolderService, 'query', function() {
                var deferred = $q.defer();
                deferred.resolve(databases);
                return { $promise: deferred.promise };
            });

            sinon.stub(almFolderService, 'root', function() {
                var deferred = $q.defer();
                deferred.resolve(root);
                return { $promise: deferred.promise };
            });

            sinon.stub(almFolderService, 'folder', function() {
                var deferred = $q.defer();
                deferred.resolve(folders);
                return { $promise: deferred.promise };
            });

            controller = $controller('SettingsALM', {$scope: $rootScope.$new()});

            $rootScope.$apply();
        });

        it('should be created', function() {
            expect(controller).toBeDefined();
        });

        it('should have data', function() {
            expect(controller.data).toEqual(testplanSettingsService.data);
            expect(controller.almDomains).toEqual(databases);
        });

        it('should load ALM data when new database is selected', function() {
            controller.data.alm_db_name = databases[0].name;
            $rootScope.$apply();

            expect(controller.almDomains).toEqual(databases);
        });

        it('should have a working load function', function() {
            controller.data.alm_db_name = databases[0].name;
            $rootScope.$apply();

            expect(typeof(controller.loadNode)).toEqual('function');
            controller.loadNode({
                event: {},
                node: {
                    id: '3'
                },
                instance: {
                    get_path: function() {
                        return ["Legacy"];
                    }
                }
            });
            $rootScope.$apply();

            expect(almFolderService.folder.called).toBeTruthy();

            expect(controller.loading).toBeFalsy();
            expect(controller.treeData[0].children).toEqual(folders);
        });
    });
});
