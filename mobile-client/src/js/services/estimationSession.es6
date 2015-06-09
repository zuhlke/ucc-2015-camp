class EstimationSession {

  constructor(http, store, events, configuration) {
    this.store = store;
    this.http = http;
    this.events = events;
    this.configuration = configuration;
  }

  join(sessionId) {
    return this.http.get(this.configuration.api + '/sessions/'+sessionId).then((response) => {
      this.store.local.set('sessionId', sessionId);
      return response.data;
    }, (errorResponse) => {alert('catastrophic failure when joining session');});
  }

  clear() {
    this.store.local.remove('sessionId');
  }

  getId() {
    return this.store.memory.get('sessionId');
  }
}

export default EstimationSession;