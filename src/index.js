// redux-fries - Nicolas Delfino
// Redux middleware to handle subscriptions
const friesSingleton = (function friesSingleton() {
  let instance = null;
  const log = false;

  function createSubscriber() {
    const subscriptions = {};

    function getSubscriptions() {
      return subscriptions;
    }

    function getKey(key) {
      const keys = Object.values(subscriptions);
      const keyInList = Object.prototype.hasOwnProperty.call(
        subscriptions,
        `${key}_#0`,
      );

      if (keyInList) {
        let latest = 0;

        Object.keys(keys).forEach((keyIdent) => {
          const validIndex = Object.prototype.hasOwnProperty.call(
            subscriptions,
            keyIdent,
          );
          if (keys && validIndex) {
            latest += 1;
            return `${key}_#${(parseInt(keyIdent.split('_#')[1], 10) +
              latest).toString()}`;
          }
          return null;
        });
      }
      return `${key}_#0`;
    }

    function addSubscription(key, cb) {
      const uniqueKey = getKey(key);
      if (!uniqueKey) {
        return null;
      }
      // add key
      subscriptions[uniqueKey] = { callback: cb };
      if (log) {
        console.group(
          '%cSUBSCRIBE - ADD KEY',
          'background:black;color:white;padding:4px;font-size:10px',
        );
        console.log(`%c${uniqueKey}`, 'font-weight:bold;font-size:10px');
        console.groupEnd();
      }
      return uniqueKey;
    }

    function cancelSubscription(uniqueKey) {
      const uniqueKeyInList = Object.prototype.hasOwnProperty.call(
        subscriptions,
        uniqueKey,
      );
      if (uniqueKeyInList) {
        delete subscriptions[uniqueKey];
        if (log) {
          console.group(
            '%cSUBSCRIBE - REMOVE KEY',
            'background:black;color:white;padding:4px;font-size:10px',
          );
          console.log(`%c${uniqueKey}`, 'font-weight:bold;font-size:10px');
          console.groupEnd();
        }
      }
    }

    function handleSubscriptions(key) {
      const arrayOfCallbacks = [];

      Object.keys(subscriptions).forEach((keyIdent) => {
        if (keyIdent.indexOf(key) !== -1) {
          arrayOfCallbacks.push(subscriptions[keyIdent].callback);
        }
      });
      return arrayOfCallbacks;
    }

    function runCallback(callback, getState) {
      callback(getState());
    }

    return {
      getSubscriptions,
      addSubscription,
      cancelSubscription,
      handleSubscriptions,
      runCallback,
    };
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createSubscriber();
        if (log) {
          console.log(
            '%cSUBSCRIBE MIDDLEWARE',
            'background:black;color:white;padding:4px;font-weight:bold;font-size:10px',
          );
        }
      }
      return instance;
    },
  };
}());

export const fries = friesSingleton.getInstance();

export const subscribe = (action, callback) =>
  fries.addSubscription(action, callback);

export const unsubscribe = val => fries.cancelSubscription(val);

export const handleSubscriptions = val => fries.handleSubscriptions(val);

export const getSubscriptions = () => fries.getSubscriptions();

// middleware
function createFriesWare() {
  return ({ getState }) => next => (action) => {
    // eslint-disable-next-line no-console
    // console.log('dispatching ', action);
    handleSubscriptions(action.type).forEach((callback) => {
      // callback(getState());
      fries.runCallback(callback, getState);
    });
    next(action);
  };
}

// eslint-disable-next-line consistent-return
const defaultFriesWare = ({ dispatch, getState } = {}) => {
  if (typeof dispatch === 'function' || typeof getState === 'function') {
    return createFriesWare()({ dispatch, getState });
  }
};

export { defaultFriesWare as reduxFries };
