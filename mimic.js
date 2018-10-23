const f = (api) => next => action => {
  console.log('dispatchF');
  action = action + ` -> F`;
  next(action); // next = g(api)(baseDispatch)
};
const g = (api) => next => action => {
  console.log('dispatchG');
  action = action + ` -> G`;
  next(action); // next = baseDispatch
};
const baseDispatch = (action) => console.log(action);

function applayMiddleware(f, g) {
  const api = {};
  const G =  g(api);
  const F = f(api);

  const dispatchG = G(baseDispatch);
  const dispatchFG = F(dispatchG);
  return dispatchFG; // F(G(baseDispatch)) = f(api)(g(api)(baseDispatch))
}

const dispatchFG = applayMiddleware(f, g);

dispatchFG('action');
console.log('done');