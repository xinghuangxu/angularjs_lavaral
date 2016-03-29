/**
 * Represents a node of a JStree for special render handling
 *
 * @author Randall Crock
 * @copyright 2015 NetApp, Inc.
 * @date 2015-09-01
 */

    'use strict';

    var iconBasePath = "/images/";

    /**
     * Enum representing different node types which can be rendered.
     * The format function should take an object, and return it with any
     * special properties the specific type needs to have on nodes of
     * that type. Otherwise, it should just return the object as-is.
     */
    window.NodeType = {
        DEFAULT: {
            value: 0,
            name: null,
            icon: null,
            format: function(item) {
                return item;
            }
        },
        TEST_STRATEGY: {
            value: 1,
            name: 'Test Strategy',
            icon: '',
            format: function(item) {
                item.data.text = item.data.StrategyHeadline;
                item.popover = true;
                this.icon = iconBasePath + "strategy" + item.data.Type + ".svg";
                return item;
            }
        },
        TEST_CASE: {
            value: 2,
            name: 'Test Case',
            icon: '',
            format: function(item) {
                return item;
            }
        },
        GROUP: {
            value: 3,
            name: 'Group',
            icon: 'glyphicon glyphicon-folder-open',
            format: function(item) {
                return item;
            }
        },
        ATTRIBUTE: {
            value: 4,
            name: 'Attribute',
            icon: iconBasePath + 'strategyAttribute.png',
            format: function(item) {
                return item;
            }
        },
        REQUIREMENT: {
            value: 5,
            name: 'Requirement',
            icon: '',
            format: function(item) {
                item.data.text = item.data.ReqxType + ': ' + item.data.ReqxID + ': ' + item.data.ReqxTitle;
                this.icon = item.data.icon;	
                return item;
            }
        }
    };

    /**
     * Check the given type against the type enum for validity
     *
     * @param {object} type Object to compare
     *
     * @returns True if the given object is in the types list, false otherwise
     */
    function checkType(type) {
        for(var baseType in NodeType) {
            if(NodeType[baseType] === type) {
                return true;
            }
        }

        return false;
    };

    /**
     * Class representing a node in a JSTree
     *
     * @param {object} data Data to include in the node, if any
     * @param {object} type Node type to display
     *
     * @returns {Node} New Node object to add to an array of objects to render
     */
    function Node(data, type) {
        // Set the default if one isn't given
        if(!type) {
            type = NodeType.DEFAULT;
        }

        // Check to make sure we were given a valid type
        if(!checkType(type)) {
            throw "Invalid NodeType";
        }

        this.data = data;
        this.type = type;

        this.children = [];
        this.attrs = {};

        type.format(this);

        this.icon = type.icon;
        this.text = data.text;
    };

    /**
     * Create a copy of the current node
     *
     * @return {Node} A copy of the current node
     */
    Node.prototype.copy = function() {
        return angular.copy(this);
    };

    /**
     * Add a node as a child of the current node
     *
     * @param {Node}    child  The node to add as a child
     * @param {boolean} copy   (Optional, default false) If true, create a copy of the child and add the copy
     */
    Node.prototype.add = function(child, copy) {
        var newChild;
        if(copy) {
            newChild = child.copy();
        }
        else {
            newChild = child;
        }

        newChild.parent = this.id;
        this.children.push(newChild);
    };
