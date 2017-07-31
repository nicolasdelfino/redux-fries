import sinon from 'sinon';
import { expect } from 'chai';
import { applyMiddleware, createStore } from 'redux';
import { reduxFries, subscribe, unsubscribe, getSubscriptions } from '../src';

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

    it('should return a unique id matching the action name and iterator', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const uniqueId = subscribe(ACTION, () => { });

      store.dispatch({ type: ACTION });
      expect(uniqueId).to.equal('SOME_ACTION_#0');
    });

    it('should return a matching id regardless of the action name', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const uniqueId = subscribe('asdiojsadad989asd8922323', () => { });

      store.dispatch({ type: 'asdiojsadad989asd8922323' });
      expect(uniqueId).to.equal('asdiojsadad989asd8922323_#0');
    });

    it('should contain two ids matching action and iterator', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const firstUniqueId = subscribe({ type: ACTION }, () => {});
      const firstUniqueKeyInList = Object.prototype.hasOwnProperty.call(
        getSubscriptions(),
        firstUniqueId,
      );

      const secondUniqueId = subscribe({ type: ACTION }, () => {});
      const secondUniqueKeyInList = Object.prototype.hasOwnProperty.call(
        getSubscriptions(),
        secondUniqueId,
      );

      store.dispatch({ type: ACTION });

      expect(firstUniqueKeyInList && secondUniqueKeyInList).equal(true);
    });

    it('should execute callback', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const spy = sinon.spy();

      subscribe({ type: ACTION }, spy());

      store.dispatch({ type: ACTION });
      sinon.assert.calledOnce(spy);
    });

    it('should contain the unique id after subscribe', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const uniqueId = subscribe({ type: ACTION }, () => {});
      store.dispatch({ type: ACTION });
      const uniqueKeyInList = Object.prototype.hasOwnProperty.call(
        getSubscriptions(),
        uniqueId,
      );

      expect(uniqueKeyInList).equal(true);
    });

    it('should not contain the unique id after unsubscibe', () => {
      const store = createStore(() => ({}), applyMiddleware(reduxFries));
      const uniqueId = subscribe({ type: ACTION }, () => {});
      unsubscribe(uniqueId);
      store.dispatch({ type: ACTION });
      const uniqueKeyInList = Object.prototype.hasOwnProperty.call(
        getSubscriptions(),
        uniqueId,
      );

      expect(uniqueKeyInList).equal(false);
    });
  });
});

