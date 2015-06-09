import Ractive from 'ractive';
import html from './welcome.ract';
import navbar from '../navbar/navbar.ract';
import storage from '../services/storage.es6';

class Welcome {

  constructor(auth, events, estimationSessions) {
    this.events = events;
    this.auth = auth;
    this.estimationSessions = estimationSessions;
  }

  render() {
    let loggedInUser = storage.memory.get('user');
    this.ractive = new Ractive({
      el: 'view',
      template: html,
      partials: {navbar: navbar},
      data: function() {
        return {
          user: loggedInUser,
          sms: [],
          sessionStarted: false
        };
      }
    });

    this.ractive.on('logout', () => this.logout());
    this.ractive.on('startEstimationSession', () => this.startEstimationSession(this.ractive.get('estimationSessionName')));
  }

  logout() {
    this.auth.clearLogin();
    this.events.routing.transitionTo.dispatch('home', this);
  }

  isProtected() {
    return true;
  }

  unrender() {
    return this.ractive.teardown();
  }

  startEstimationSession(name) {
    this.estimationSession = this.estimationSessions.create(name);
    this.ractive.set('sessionStarted', true);
  }
}

export default Welcome;
