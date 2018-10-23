const { createStore, applyMiddleware } = require('redux');

function logger({ getState }) {
  return next => action => {
    console.log('will dispatch: ' + JSON.stringify(action));

    // 送 action 到內層 dispatch function
    const returnValue = next(action);

    console.log('state after dispatch: ' + JSON.stringify( getState()));

    // 在同步的 middleware 才有用  
    return returnValue;
  }
}

// 定義 action type
const identityChangeMessage = 'CHANGE_MESSAGE';

// 建立一個 Reducer
const initState = {
  message: 'init message',
};
const reducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case identityChangeMessage: {
      const { message } = payload;
      return Object.assign({}, { message });
    }
    default:
      return state;
  }
};

// 建立一個 Store
const store = createStore(reducer, initState, applyMiddleware(logger));

// 建立一個 action
const action = {
  type: identityChangeMessage,
  payload: {
    message: 'change',
  },
}

// 分派(dispatch) action
const dispatchReutrnValue = store.dispatch(action)
console.log('dispatchReutrnValue = ' + JSON.stringify(dispatchReutrnValue));

// 印出收到 action 後，被 reducer 修改的 state
console.log('state = ' + JSON.stringify(store.getState()));
