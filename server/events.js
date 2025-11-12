const EventEmitter = require('events');

class ModelEvents extends EventEmitter {}

module.exports = new ModelEvents();
