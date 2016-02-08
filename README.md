# Ember-json-pretty

This component should be use to print the JSON object or JSON text in pretty way. With this component is possible to change the color in each type of element within of JSON object and expand and retract objects and arrays.
Forked from
(https://github.com/rodrigo-morais/ember-json-pretty/)

## Installation

No NPM installation at the moment

## Example

To use this component is need call it in a template to passing a JSON object that should exist in a route, controller or another stuff of project where component was installed.

```sh
------- route -------
Ember.Route.extend({
    model: function () {
        return {"key1":"value1", "key2":"value2"};
    }
});

------ template ------
{{ ember-json-pretty jsonObj=this.model }}


------ template with options ------
{{ ember-json-pretty
    jsonObj=this.model
}}
```
