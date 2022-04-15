// import { useState, useEffect } from 'react';

// enum State {
//   Pending,
//   Loading,
//   Error,
//   Success,
// }

// export const useWrapPromiseToSuspense = <T>() => {
//   const [state, setState] = useState<State>(State.Pending);
//   const [data, setData] = useState<T | null>(null);
//   const [promiseFn, setPromiseFn] = useState<(() => Promise<T>) | null>(null);
//   const [promise, setPromise] = useState<Promise<T> | null>(null);

//   useEffect(() => {
//     setState(State.Loading);
//     setData(null);
//     setPromise(promiseFn());
//   }, [promiseFn]);

//   switch (state) {
//     case State.Loading:
//       // eslint-disable-next-line @typescript-eslint/no-throw-literal
//       throw promise;
//     case State.Error:
//       throw data;
//     case State.Success:
//       return data;
//   }

//   return [setPromiseFn];
// };

export const a = '';
