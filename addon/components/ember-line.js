import Ember from 'ember';

export default Ember.Component.extend({
	attributeBindings: ['customId:id'],
	actions: {
    toggleExpand (plusId) {
        Ember.Logger.info("Child toggleExpand was clicked!", plusId);
        console.log("Child plusId=", plusId);
        this.sendAction('toggleExpand', plusId);
    }
  }
});