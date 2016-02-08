import Ember from 'ember';

export default Ember.Component.extend({
	attributeBindings: ['customId:id'],
	actions: {
    toggleExpand (plusId) {
        this.sendAction('toggleExpand', plusId);
    }
  }
});
