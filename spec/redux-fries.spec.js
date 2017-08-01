import sinon from 'sinon';
import { expect } from 'chai';
import { applyMiddleware, createStore } from 'redux';
import { reduxFries, subscribe, unsubscribe, getSubscriptions, removeAllSubscriptions } from '../src';

context('default fries', () => {
  describe('init', () => {
    const ACTION = 'SOME_ACTION';

    beforeEach(() => {
      sinon.spy(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('should apply the middleware', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      store.dispatch({ type: ACTION });
      sinon.assert.notCalled(console.error);
    });
  });

  describe('Internals', () => {
    const ACTION = 'SOME_ACTION';

    function mockFunction() {}

    it('should return a unique id matching the action name and iterator', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const uniqueId = subscribe(ACTION, mockFunction);
      store.dispatch({ type: ACTION });
      expect(uniqueId).to.equal('SOME_ACTION_#0');
    });

    it('should fail if no key could be provided', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const uniqueId = subscribe(null, mockFunction);
      store.dispatch({ type: ACTION });
      expect(uniqueId).to.equal(null);
    });

    it('should return a matching id regardless of the action name', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const uniqueId = subscribe('asdiojsadad989asd8922323', mockFunction);
      store.dispatch({ type: 'asdiojsadad989asd8922323' });
      expect(uniqueId).to.equal('asdiojsadad989asd8922323_#0');
    });

    it('should contain two ids matching action and iterator', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const firstUniqueId = subscribe(ACTION, mockFunction);
      const firstUniqueKeyInList = Object.prototype.hasOwnProperty.call(
        getSubscriptions(),
        firstUniqueId,
      );

      const secondUniqueId = subscribe(ACTION, mockFunction);
      const secondUniqueKeyInList = Object.prototype.hasOwnProperty.call(
        getSubscriptions(),
        secondUniqueId,
      );
      store.dispatch({ type: ACTION });
      expect(firstUniqueKeyInList && secondUniqueKeyInList).equal(true);
      removeAllSubscriptions();
    });

    it('should contain the unique id after subscribe', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const uniqueId = subscribe(ACTION, mockFunction);
      store.dispatch({ type: ACTION });
      const uniqueKeyInList = Object.prototype.hasOwnProperty.call(
        getSubscriptions(),
        uniqueId,
      );
      expect(uniqueKeyInList).equal(true);
      removeAllSubscriptions();
    });

    it('should not contain the unique id after unsubscibe', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const uniqueId = subscribe(ACTION, mockFunction);
      unsubscribe(uniqueId);
      store.dispatch({ type: ACTION });
      const uniqueKeyInList = Object.prototype.hasOwnProperty.call(
        getSubscriptions(),
        uniqueId,
      );
      expect(uniqueKeyInList).equal(false);
      removeAllSubscriptions();
    });

    it('should execute callback and return the state', (done) => {
      const reducer = (state = { fries: false }, action) => {
        switch (action.type) {
          case ACTION:
            return { ...state, fries: true };
          default:
            return state;
        }
      };
      const store = createStore(reducer, applyMiddleware(reduxFries));

      function callback(state) {
        expect(state).to.deep.equal(store.getState());
        return done();
      }

      subscribe(ACTION, callback);
      store.dispatch({ type: ACTION });
    });
  });
});

