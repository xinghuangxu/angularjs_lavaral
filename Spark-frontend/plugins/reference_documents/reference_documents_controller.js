(function(){
    'use strict';

    angular
        .module('referenceDocuments')
        .controller('referenceDocumentsController',referenceDocumentsController);


    referenceDocumentsController.$inject=['referenceDocumentsService'];


    function referenceDocumentsController(referenceDocumentsService){

        var RDCtrl = this;

        RDCtrl.config = {
            groupBy: referenceDocumentsService.getArrangeBy(),
            activeGroup: referenceDocumentsService.getArrangeBy().NONE
        };
        RDCtrl.tree = null;
        RDCtrl.loadTreeData = loadTreeData;

        function loadTreeData(){
            RDCtrl.tree = getTreeData;
        }

        function getTreeData(obj, cb){
            var node_id = obj.id;
            if (node_id == '#'){
                referenceDocumentsService.getReferenceDocs().then(function(response){
                    cb.call(this, referenceDocumentsService.getReferenceDocsTree(response));
                });
                return;
            }
            referenceDocumentsService.getTopicsData(node_id).then(function(response){
                cb.call(this, referenceDocumentsService.getTopicsDataTree(response));
            });
        }
    }
})();
