/*
 * xinghuangxu@gmail.com
 * highly configurable : being used in almost all the jstree instances.
 * 
 */
(function () {
    angular
            .module('spark.ui')
            .directive('multiArrangeJtree', multiArrangeJtree)
            .directive('multiArrangeTree', multiArrangeTree);


    multiArrangeJtree.inject = ['$templateCache', '$compile'];

    function multiArrangeJtree($templateCache, $compile)
    {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                scope.load = true;
                //When this flag is true, the move_node event is skipped
                scope.$on('ShowTree', function (event, data)
                {
                    //listen to tree search event to update the local filter
                    scope.$on('treeSearchEvent', function (event, data) {
                        if (data.length < 1 || data.length > 2)
                            element.jstree(true).search(data);
                    });
                    //Destroys last instance of jstree so a new one can be created. Ideally jstree refresh should be used, but functionality of refresh has not worked
                    element.jstree("destroy");
                    var popoverContent = $templateCache.get("TreePopoverHtml");
                    var optionElm = $(popoverContent);
                    //add in icons
                    optionElm.css("width", scope.treeConfig.popoverButtons.length * 27);
                    //select node event, append icons to the node
                    element.bind("select_node.jstree", function (event, data) {
                        if (data.node.original.popover) {
                            optionElm.empty();
                            for (var i in scope.treeConfig.popoverButtons) {
                                var btnConfig = scope.treeConfig.popoverButtons[i];
                                var icon = $("<i ></i>").addClass(btnConfig.icon);
                                var btnElm = $('<button type="button" class="btn-p btn-xs btn-p-default"></button>');
                                btnElm.append(icon);
                                btnElm.prop("title", btnConfig.title);
                                btnElm.click(btnConfig.action);
                                optionElm.append(btnElm);
                            }
                            var target = $($(event.currentTarget).find('.jstree-clicked')[0]);
                            target.after(optionElm);
                        }
                        scope.treeConfig.selectedInfo = data.node.original;
                    });

                    //jstree format setup
                    element.jstree(
                            {
                                //"state" plugin currently disabled since it does not work alongside our select node function
                                plugins: ["themes", "search", "dnd", "crrm", "ui"],
                                search: {
                                    "case_sensitive": false,
                                    //only displays matches found in search bar
                                    "show_only_matches": true,
                                    //fuzzy set to false so search looks for exact matches
                                    "fuzzy": false
                                },
                                core: {
                                    multiple: false,
                                    themes: {
                                        "theme": "default",
                                        "icons": true,
                                        "dots": false
                                    },
                                    data: data
                                }
                            }
                    );
                    scope.load = false;//finish loading the tree
                }, true);

            }
        };
    }
    ;
    function multiArrangeTree($injector) {
        /*
         * Configuration Example:
         * 
         * button information which includes the actions
         var btns = [
         {
         title: "show detailed info",
         action: function () {
         //TODO
         },
         icon: "fa fa-info fa-fw"
         },
         {
         title: "export",
         action: function () {
         $scope.ExportData = [
         {id: 0,
         text: "Test Plan",
         treeData: $scope.TestPlan.treeData,
         type: "Test Strategy"
         },
         {id: 1,
         text: "Rally",
         treeData: $scope.Rally.treeData,
         type: "User Story"
         },
         {id: 2,
         text: "ALM",
         treeData: $scope.Boxcar.treeData,
         type: "Test Case"
         }
         ];
         $scope.selectedExportLocation = $scope.ExportData[1];
         if (!exportModal) {
         exportModal = $modal({
         contentTemplate: 'components/tplanner/partial/_exporter.html',
         scope: $scope,
         show: false
         });
         }
         exportModal.$promise.then(exportModal.show);
         },
         icon: "fa fa-sign-out"
         }
         ];
         
         $scope.tplannerTreeConfig = {  //in this example tplannerTreeConfig would be the config attribute value set in the directive
         id: 1,
         parser: "testStrategyDataParserService",
         class: "boxcarPanelTree",
         jsTreeContainer: $scope.TestPlan,
         headerButtons: headerBtns,
         popoverButtons: btns,  //btns information from above
         classifiers: [
         {"value": 'QualificationArea', "text": "Qualification Tag"},
         {"value": 'ImpactArea', "text": "Impact Area Tag"},
         {"value": 'Approach', "text": "Approach Tag"},
         {"value": 'CreatedDate', "text": "Creation Date"},
         {"value": 'CreatedBy', "text": "Created By"},
         {"value": 'ModifiedDate', "text": "Last Modification Date"},
         {"value": 'ModifiedBy', "text": "Last Modified By"},
         {"value": 'Owner', "text": "Owner"},
         {"value": 'State', "text": "State"},
         {"value": '', "text": "None"}
         ],
         attributes: {
         StrategyHeadline: "Strategy Title",
         QualificationArea: "Qualification Area Tag",
         ImpactArea: "Impact Area Tag",
         Approach: "Approach",
         CreatedDate: "Creation Date",
         CreatedBy: "Created By",
         ModifiedDate: "Last Modification Date",
         ModifiedBy: "Last Modified By",
         Owner: "Owner",
         State: "State",
         Type: "Strategy Type",
         TopicID: "TPID"
         }
         };
         */
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                //Important!!!
                //Config inforamtion is pass in as an object form the parent. The field name is specified in the directive attributes
                var treeConfig = scope[attrs.controller][attrs.config]; //config object
                if (treeConfig.class) {
                    element.addClass(treeConfig.class);
                }
                scope.id = treeConfig.id;
                scope.treeConfig = treeConfig;
                var dataParser = $injector.get(treeConfig.parser);
                function updateTree(classifier) {
                    scope.tree = dataParser.toTreeFormat(classifier);
                    if (scope.tree.length > 0) {
                        if (treeConfig.jsTreeContainer) {
                            treeConfig.jsTreeContainer.treeData = scope.tree;
                        }
                        scope.$broadcast("ShowTree", scope.tree);
                    }
                }
                scope.$on('LoadTreeData', function (event, data) {
                    if (data.id === scope.id) {
                        dataParser.setSource(data.source, treeConfig.attributes);
                        updateTree(scope.selectedClassifier.value);
                    }
                });
                scope.$watch('treeSearchKey', function (newValue, oldValue) {
                    scope.$broadcast('treeSearchEvent', newValue);
                });
                //should be part of the configuration files
                scope.classifiers = treeConfig.classifiers;
                scope.selectedClassifier = scope.classifiers[0];
                scope.$watch('selectedClassifier', function (newValue, oldValue) {
                    updateTree(newValue.value);
                });

                //initialize the header buttons
                var headerButtons = treeConfig.headerButtons;
                var headerButtonContainer = element.find(".header-btn-container");
                for (var i in headerButtons) {
                    var btnConfig = headerButtons[i];
                    var btn = $('<button type="button" class="btn btn-default btn-sm" title="' + btnConfig.title + '" </button>');
                    btn.append($('<span class="' + btnConfig.icon + '" aria-hidden="true"></span>'));
                    btn.click(btnConfig.action);
                    headerButtonContainer.append(btn);
                }
            },
            templateUrl: 'angular/ui/partial/_multiArrangeTree.html?v=0'
        };
    }
    ;

})();
