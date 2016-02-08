import Ember from 'ember';

var plusId = 0;

var _addBrace = function(element, numberSpaces, hasPlus, braceColor, braceHighlight){
    var jsonLine = {
            elements: [],
            lines: []
        },
        jsonObj = {};

    for(var counter = 0; counter < numberSpaces; counter = counter +1){
        jsonLine.elements.push(_addBlank());
    }

    jsonObj.hasPlus = hasPlus;
    jsonObj.plusId = 'plus_' + plusId;
    jsonObj.isBlank = false;
    jsonObj.element = element;
    jsonObj.class = 'json-brace';

    jsonLine.elements.push(jsonObj);

    return jsonLine;
};

var _addBlank = function(){
    var jsonObj = {};

    jsonObj.hasPlus = false;
    jsonObj.plusId = null;
    jsonObj.element = '';
    jsonObj.isBlank = true;
    jsonObj.class = 'json-blank';

    return jsonObj;
};

var _addKey = function(key, numberSpaces, keyColor, keyHighlight){
    var jsonObj = {};

    jsonObj.hasPlus = false;
    jsonObj.plusId = null;
    jsonObj.isBlank = false;
    jsonObj.element = key;
    jsonObj.class = 'json-key';

    return jsonObj;
};

var _addTwoPoints = function(){
    var jsonObj = {};

    jsonObj.hasPlus = false;
    jsonObj.plusId = null;
    jsonObj.isBlank = false;
    jsonObj.element = ':';
    jsonObj.class = 'json-two-points';

    return jsonObj;
};

var _addValue = function(value, numberSpaces, hasComma, options){
    var jsonObj = {};

    if(value){
        if(typeof value === 'string'){
            jsonObj = _addStringValue(value, options['stringColor'], options['stringHighlight']);
        }
        else if(Array.isArray(value)){
            if(typeof value[0] === 'object'){

                jsonObj = _createJSONTree(value, numberSpaces, options, hasComma);
            }
            else{
                jsonObj = _createJSONTree(value, numberSpaces, options, hasComma);
            }
        }
        else if(value && typeof value === 'object'){
            jsonObj = _addObjectValue(value, numberSpaces, options);
        }
        else{
            jsonObj = _addStandardValue(value, options['valueColor'], options['valueHighlight']);
        }
    }
    else{
        jsonObj = _addStringValue('null', options['stringColor'], options['stringHighlight']);
    }

    return jsonObj;
};

var _addStringValue = function(value, stringColor, stringHighlight){
    var jsonObj = {};

    jsonObj.hasPlus = false;
    jsonObj.plusId = null;
    jsonObj.isBlank = false;
    jsonObj.element = value;
    jsonObj.class = 'json-string';

    return jsonObj;
};

var _addObjectValue = function(value, numberSpacesInitial, options){
    return _createObject(value, numberSpacesInitial, options);
};

var _addStandardValue = function(value, valueColor, valueHighlight){
    var jsonObj = {};

    jsonObj.hasPlus = false;
    jsonObj.plusId = null;
    jsonObj.isBlank = false;
    jsonObj.element = value;
    jsonObj.class = 'json-value';

    return jsonObj;
};

var _addComma = function(){
    var jsonObj = {};

    jsonObj.hasPlus = false;
    jsonObj.plusId = null;
    jsonObj.isBlank = false;
    jsonObj.element = ',';
    jsonObj.class = '';

    return jsonObj;
};

var _createObject = function(obj, numberSpacesInitial, options) {
    var jsonLines = [],
        jsonLine = {
            elements: [],
            lines: []
        },
        numberSpaces = numberSpacesInitial;

    jsonLine = _addBrace('{', numberSpacesInitial, true, options['braceColor'], options['braceHighlight']);

    numberSpaces = numberSpaces + 1;
    if (!!obj){
        Object.keys(obj).forEach(function(key, index){
        var hasComma = false,
            internalJsonLine = {
                elements: [],
                lines: []
            },
            newValue;

        plusId = plusId + 1;

        for(var counter = 0; counter < numberSpaces; counter = counter +1){
            internalJsonLine.elements.push(_addBlank());
        }

        internalJsonLine
            .elements
            .push(_addKey(key, numberSpaces, options['keyColor'], options['keyHighlight']));
        internalJsonLine
            .elements
            .push(_addTwoPoints());

        hasComma = index < (Object.keys(obj).length -1);

        newValue = _addValue(obj[key], numberSpaces, hasComma, options);

        if(Array.isArray(newValue) && newValue[0].elements[newValue[0].elements.length - 1].class === 'json-brace'){
            var openBrace = newValue[0].elements[newValue[0].elements.length - 1];

            internalJsonLine
                .elements
                .push(openBrace);

            internalJsonLine.lines = internalJsonLine
                                        .lines
                                        .concat(newValue[0].lines);

            jsonLine.lines.push(internalJsonLine);

            internalJsonLine = {
                elements: [],
                lines: []
            };

            newValue[1].elements.forEach(function (element) {
                internalJsonLine
                    .elements
                    .push(element);
            });
        }
        else{
            internalJsonLine
                .elements
                .push(newValue);
        }

        jsonLine.lines.push(internalJsonLine);

        if(Array.isArray(internalJsonLine.elements[internalJsonLine.elements.length - 1])){

            var internalArray = internalJsonLine
                                    .elements[internalJsonLine
                                                .elements.length - 1];
            internalJsonLine.elements.pop();

            internalJsonLine.elements.push(internalArray[0].elements[0]);

            internalJsonLine.lines = internalArray[0].lines;

            jsonLine.lines.push(internalArray[internalArray.length - 1]);
        }
        else{
            if(hasComma && internalJsonLine.elements[internalJsonLine.elements.length - 1].element !== ','){
                internalJsonLine.elements.push(_addComma());
            }
        }
    });

    }

    jsonLines.push(jsonLine);
    jsonLines.push(_addBrace('}', numberSpacesInitial, false, options['braceColor'], options['braceHighlight']));

    return jsonLines;
};

var _adjustLinePlusId = function(jsonLines){
    jsonLines.forEach(function(_line){
        var plusId = '';

        if(_line.elements){
            _line.elements.forEach(function(_element){
                if(_element.plusId){
                    plusId = _element.plusId;
                }
            });
        }

        if(_line.lines){
            _line.lines.forEach(function(_internalLine){
                _internalLine.plusId = plusId;
            });

            if(_line.lines.length > 0){
                _line.lines = _adjustLinePlusId(_line.lines);
            }
        }
    });
    return jsonLines;
};

var _createJSONTree = function(obj, numberSpaces, options, hasComma) {
    var jsonLines = [],
        jsonLine = {
            elements: [],
            lines: []
        },
        jsonObj = {
            'hasPlus': false,
            'newLine': false,
            'endLine': false
        },
        numberSpacesInitial = numberSpaces;

    if(Array.isArray(obj)){
        numberSpaces = numberSpaces + 1;
        var numberElements = obj.length;
        jsonObj.hasPlus = true;
        jsonObj.plusId = 'plus_' + plusId;
        jsonObj.element = numberElements +' items [';
        jsonObj.isBlank = false;
        jsonObj.class = 'json-bracket';

        jsonLine.elements.push(jsonObj);

        obj.forEach(function(newObj, index){
            var newObject;

            if(typeof newObj === 'string' || typeof newObj === 'number')
            {
                var internalJsonLine = {
                    elements: [],
                    lines: []
                },
                internaljsonObj = {},
                internalBlanks = numberSpacesInitial + 1;

                internaljsonObj.hasPlus = false;
                internaljsonObj.plusId = '';
                internaljsonObj.element = newObj;
                internaljsonObj.isBlank = false;
                internaljsonObj.class = 'json-string';

                for(var counter = 0; counter < internalBlanks; counter = counter +1){
                    internalJsonLine.elements.push(_addBlank());
                }

                internalJsonLine.elements.push(internaljsonObj);
                if(index < obj.length - 1){
                    internalJsonLine.elements.push(_addComma());
                }

                jsonLine.lines.push(internalJsonLine);
            }
            else{
                plusId = plusId + 1;

                newObject = _createObject(newObj, numberSpaces, options);

                newObject.forEach(function(objectLine){
                    jsonLine.lines.push(objectLine);
                });

                if(index < (obj.length -1)){
                    jsonLine
                        .lines[jsonLine.lines.length - 1]
                            .elements.push(_addComma());
                }

                newObject.forEach(function(line){
                    plusId = plusId + line.lines.length + 1;
                });
            }
        });

        jsonLines.push(jsonLine);

        jsonObj = {
            'hasPlus': false,
            'newLine': false,
            'endLine': false
        };
        jsonLine = {
            elements: [],
            lines: []
        };

        for(var counter = 0; counter < numberSpacesInitial; counter = counter +1){
            jsonLine.elements.push(_addBlank());
        }

        jsonObj.hasPlus = false;
        jsonObj.plusId = null;
        jsonObj.element = ']';
        jsonObj.isBlank = false;
        jsonObj.class = 'json-bracket';

        jsonLine.elements.push(jsonObj);

        if(hasComma){
            jsonLine.elements.push(_addComma());
        }

        jsonLines.push(jsonLine);
    }
    else{
        jsonLines = _createObject(obj, numberSpaces, options);
    }

    return _adjustLinePlusId(jsonLines);
};

var _prettyPrint = function(obj, options) {
    var jsonTree = _createJSONTree( obj, 0, options, false);
    return jsonTree;
};

export default Ember.Component.extend({
    tagName: 'code',
    optionsDefault: {
        /*keyColor: '#333',
        keyHighlight: '#FFFFFF',
        valueColor: '#000080',
        valueHighlight: '#FFFFFF',
        stringColor: '#0B75F5',
        stringHighlight: '#FFFFFF',
        braceColor: '#000000',
        braceHighlight: '#FFFFFF',
        bracketColor: '#000000',
        bracketHighlight: '#FFFFFF'**/
    },
    options: {},
    id: '',
    attributeBindings: ['customId:id'],
    customId: '',
    pretty: function () {
        var jsonObj = this.get('jsonObj'),
            options,
            json_pretty,
            randomId = Math.floor(Math.random() * 60000) + 1;

        this.set('customId', randomId);

        if(typeof jsonObj === 'string'){
            jsonObj = JSON.parse(jsonObj);
        }

        if(this.options){
            if(typeof this.options === 'object'){
                options = Ember.$.extend({}, this.optionsDefault, this.options);
            }
            else{
                options = Ember.$.extend({}, this.optionsDefault, JSON.parse(this.options));
            }
        }
        else{
            options = this.optionsDefault;
        }

        this.set('options', options);

        json_pretty = _prettyPrint( jsonObj,
                                    options);
        return json_pretty;
    }.property('jsonObj'),
    expand: function(handler, tree){
        handler.removeClass('fa-plus-square-o');
        handler.addClass('fa-minus-square-o');
        tree.show();
    },
    contract: function(handler, tree){
        handler.removeClass('fa-minus-square-o');
        handler.addClass('fa-plus-square-o');
        tree.hide();
    },
    collectFirstLevelSubtrees: function(){
        var subTrees = Ember.$('.jsonTreeView').find('.new-line').find('[data-id]');
        var subHandlers = [];
        if (subTrees.length > 0){
            Ember.$.each( subTrees, function( index, subTree ) {
                var plusId = Ember.$(subTree).data('id');
                var handler = Ember.$('#' + plusId);
                subHandlers.push(handler);
            });
            return {
                'subTrees':subTrees,
                'subHandlers':subHandlers
            }
        }
        else return false;
    },
    contractFirstLevel: function(){
        var firstLevelSubTrees = this.collectFirstLevelSubtrees();
        var contracter = this.contract;
        if (firstLevelSubTrees){
            $(firstLevelSubTrees.subTrees).each(function(idx, subTree) {
                var $handler = Ember.$(firstLevelSubTrees.subHandlers[idx]);
                var $tree    = Ember.$(subTree);
                contracter($handler, $tree);
            });
        }
    },

    actions: {
        toggleExpand: function(plusId){
            var id = this.get('customId');
            var parentElement = Ember.$('#' + id);
            var treeHandler = parentElement.find('#' + plusId);
            var treeChild = parentElement.find('.jsonTreeView').find('[data-id="' + plusId + '"]');
            if (treeHandler.hasClass('fa-plus-square-o')){
                this.expand(treeHandler, treeChild);
            } else {
                this.contract(treeHandler, treeChild);
            }
        }
    },
    didInsertElement(){
        this._super(...arguments);
        this.contractFirstLevel();
    }

});
