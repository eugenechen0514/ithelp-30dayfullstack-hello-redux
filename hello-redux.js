const {createStore} = require('redux');

// 定義 action type
const identityChangeMessage = 'CHANGE_MESSAGE';

// 建立一個 Reducer
const initState = {
  message: 'init message',
};
const reducer = (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
      case identityChangeMessage: {
        const {message} = payload;
        return Object.assign({}, {message});
      }
      default:
          return state;
  }
};

// 建立一個 Store
const store = createStore(reducer);

// 印出初始的 state
console.log(store.getState());

// 建立一個 action
const action = {
    type: identityChangeMessage,
    payload: {
        message: 'change',
    },
}

// 分派(dispatch) action
store.dispatch(action);

// 印出收到 action 後，被 reducer 修改的 state
console.log(store.getState());
