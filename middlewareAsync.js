const { createStore, applyMiddleware } = require('redux');

const trigger = id => `${id}_TRIGGER`;
const success = id => `${id}_SUCCESS`;
const fail = id => `${id}_FAIL`;

function logger({ getState }) {
  return next => action => {
    console.log('========== action dispatching(start) ===============');
    console.log('will dispatch: ' + JSON.stringify(action));
    const returnValue = next(action);
    console.log('state after dispatch: ' + JSON.stringify(getState()));
    console.log('========== action dispatching(end) ===============');
    return returnValue;
  }
}

// PromiseMiddleware
function PromiseMiddleware(action) {
  return next => {
    return function dispatchAsync(action) {
      if (action.promise instanceof Promise) {
        console.log('Promise action');
        const { type, promise, ...others } = action;
        promise
          .then(data => {
            next({
              type: success(type),
              payload: data,
              promise,
              ...others
            });
          })
          .catch(error => {
            next({
              type: fail(type),
              error: error,
              promise,
              ...others
            });
          });
        return next({
          type: trigger(type),
          promise,
          ...others
        });
      } else {
        console.log('Not promise action');
        return next(action);
      }
    }
  }
}

// 定義 action type
const identityChangeMessage = 'CHANGE_MESSAGE';

// 建立一個 Reducer
const initState = {
  message: 'init message',
};
const reducer = (state = initState, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case identityChangeMessage: {
      const { message } = payload;
      return Object.assign({}, { message });
    }
    case trigger(identityChangeMessage): {
      return Object.assign({}, { message: 'identityChangeMessage trigger' });
    }
    case success(identityChangeMessage): {
      const { message } = payload;
      return Object.assign({}, { message });
    }
    case fail(identityChangeMessage): {
      return Object.assign({}, { message: error.message });
    }
    default:
      return state;
  }
};

// 建立一個 Store
const store = createStore(reducer, initState, applyMiddleware(PromiseMiddleware, logger)); // 順序不能換，因為 promise action 要先進到　PromiseMiddleware　的 dispatch function（dispatchAsync） 作用

// 印出初始的 state
console.log('state = ' + JSON.stringify(store.getState()));

// Case 1: 建立一個 resolve action
const resolvePromiseAction = {
  type: identityChangeMessage,
  promise: Promise.resolve({
    message: 'changed',
  })
};

// // Case 2: 建立一個 reject action
// const rejectPromiseAction = {
//   type: identityChangeMessage,
//   promise: Promise.reject(new Error('~~ error ~~'))
// };

// // Case 3: normal action
// const normalAction = {
//   type: identityChangeMessage,
//   payload: {
//     message: 'normal action message',
//   }
// };

console.log('store.dispatch(promiseAction)');
store.dispatch(resolvePromiseAction);
// store.dispatch(rejectPromiseAction);
// store.dispatch(normalAction);

// 等一秒後，Promise 應該已經 resolve，再印一次
console.log('waiting...');
setTimeout(() => {
  console.log('done! state = ' + JSON.stringify(store.getState()));
}, 1000)
