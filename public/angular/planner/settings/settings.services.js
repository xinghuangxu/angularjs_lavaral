/**
 *  Module service definition for Spark test planner settings module
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-08-03
 *
 */

(function () {
    'use strict';

    angular
        .module('spark.planner.settings')
        .factory('testplanSettingsService', testplanSettingsService)
        .factory('testplanSettingsModalService', testplanSettingsModalService);

    testplanSettingsService.$inject = ['$resource'];

    /**
     * Service for fetching data about the settings for test plans
     */
    function testplanSettingsService($resource) {
        return {
            data: {},
            service: $resource('/rest/planner/testplans/:plan',
                {plan: '@id'},
                {
                    save: {
                        method: 'PUT',
                        transformResponse: fixPlanFieldsSubmit,
                        transformRequest: fixPlanStacks
                    },
                    "new": {
                        method: 'POST',
                        transformResponse: fixPlanFieldsSubmit,
                        transformRequest: fixPlanStacks
                    },
                    query: {
                        method: 'GET',
                        isArray: true,
                        transformResponse: fixPlanFieldsSubmit
                    }
                }
            )
        };
    }

    testplanSettingsModalService.$inject = ['$modal', 'testplanSettingsService', 'errorService'];

    /**
     * Service for handling interactions with the modal dialog for editing settings.
     *
     * This service provides a singleton instance of a modal for the various
     * controllers to interact with and make updates to the settings.
     */
    function testplanSettingsModalService($modal, settings, errorService) {
        var modal = {
            modal: {}
        }

        modal.modal = create();
        return modal;

        /**
         * Create a new modal instance from the ngStrap service
         *
         * We overwrite the hide handler to ensure the data is saved when the
         * dialog closes
         *
         * @return {object} New modal instance
         */
        function create() {
            var newModal = $modal({
                title: "Edit Settings",
                animation: "am-fade-and-slide-top",
                contentTemplate: "angular/planner/settings/modal.tpl.html",
                controller: "SettingsModal",
                controllerAs: "modal",
                show: false
            });

            var oldHide = newModal.hide
            newModal.hide = hide;

            return newModal;

            /** Hide the modal and save the settings if needed */
            function hide() {
                if (!settings.data.release_id) {
                    oldHide();
                    return;
                }

                if (settings.data.id != null) {
                    settings.service.save({plan: settings.data.id}, settings.data)
                        .$promise.then(function(data){
                            settings.data = data;
                        }).catch(function(error){
                            errorService.error("Error saving plan settings");
                        });
                } else {
                    settings.service.new(settings.data)
                        .$promise.then(function(data){
                            settings.data = data;
                        }).catch(function(error){
                            errorService.error("Error saving plan settings");
                        });
                }

                oldHide();
            }
        }
    }

    /**
     * Modifiy the structure of the settings object from the server to work on the client
     *
     * @param  {string} data    Incoming data in JSON fomat
     * @param  {object} headers HTTP Headers for the request (not used)
     *
     * @return {object}         Modified object, ready for use on the client
     */
    function fixPlanFieldsSubmit(data, headers) {
        data = angular.fromJson(data);
        if (Array.isArray(data)) {
            $.each(data, function (key, value) {
                if (value.project_completion_date && value.project_start_date) {
                    value.project_completion_date = new Date(value.project_completion_date);
                    value.project_start_date = new Date(value.project_start_date);
                }

                if (value.hasOwnProperty('stack') && value.stack) {
                    value.testplan_stack_id = value.stack.id;
                    value.stack_name = value.stack.name;
                }

                if (value.hasOwnProperty('boxcar') && value.boxcar) {
                    value.testplan_stack_id = value.boxcar.id;
                    value.stack_name = value.boxcar.Name;
                }

                if (value.hasOwnProperty('substack') && value.substack) {
                    value.testplan_substack_id = value.substack.id;
                    value.substack_name = value.substack.name;
                }
            });
        } else if (data.project_completion_date && data.project_start_date) {
            data.project_completion_date = new Date(data.project_completion_date);
            data.project_start_date = new Date(data.project_start_date);

            if (data.hasOwnProperty('stack') && data.stack) {
                data.testplan_stack_id = data.stack.id;
                data.stack_name = data.stack.name;
            }

            if (data.hasOwnProperty('boxcar') && data.boxcar) {
                data.testplan_stack_id = data.boxcar.id;
                data.stack_name = data.boxcar.Name;
            }

            if (data.hasOwnProperty('substack') && data.substack) {
                data.testplan_substack_id = data.substack.id;
                data.substack_name = data.substack.name;
            }
        }

        return data;
    }

    /**
     * Tweak the local settings object to populate stack IDs appropriately on the server
     * @param  {object} data    Data to send to the server
     * @param  {object} headers HTTP Headers for the request (not used)
     *
     * @return {string}         JSON equivalent of the modified object to send to the server
     */
    function fixPlanStacks(data, headers) {
        if (data.hasOwnProperty('testplan_stack_id') && data.testplan_stack_id.match(/LSIP2/)) {
            data.testplan_boxcar_id = data.testplan_stack_id;
            delete(data.testplan_stack_id);
        }

        return angular.toJson(data);
    }
})();
