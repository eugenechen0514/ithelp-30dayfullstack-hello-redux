/**
 * 
 * @callback Dispatch
 * @param {Action} action
 * @returns {any}
 */

/**
 * 
 * @param {Dispatch} next 
 * @returns {Dispatch}
 */
function F(next) {
  return function dispatchF(action) {
    console.log('dispatchF');
    action = action + ` -> F`;
    next(action); // next = dispatchG = G(baseDispatch)
  };
}

/**
 * 
 * @param {Dispatch} next 
 * @returns {Dispatch}
 */
function G(next) {
  return function dispatchG(action) {
    console.log('dispatchG');
    // action
    action = action + ` -> G`;
    next(action); // next = baseDispatch
  };
}

/**
 * 
 * @type {Dispatch} 
 */
function baseDispatch(action) {
  console.log(action);
}

/**
 * 合成 middleware F, G
 * @type {Dispatch} 
 */
const dispatchFG = F(G(baseDispatch));

dispatchFG('action');
console.log('done');