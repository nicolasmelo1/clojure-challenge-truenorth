import React, { createElement, PropsWithChildren, ReactNode } from "react";

/**
 * This provides a way to create a global state that can be used in any component inside the application.
 *
 * It's a REALLY simple api that will work with any context api created. This way to define it as a global context
 * you need to register your context using `registerProviders` function here.
 *
 * For example:
 *
 * 1. First we have to create the context as well as the provider (creating the provider is EXTREMELY important)
 * IMPORTANT: In the provider look that we pass {props.children} in the render. This is important.
 * ```
 * const initialState = {
 *   state: {
 *       isAuthenticated: false,
 *   },
 *   setState() = {}
 * }
 * export const AuthenticationContext = createContext(initialState)
 *
 * function AuthenticationProvider(props) {
 *      const [state, setState] = useState(initialState.state)
 *
 *      return (
 *          <AuthenticationContext.Provider value={{
 *              state,
 *              setState,
 *          }}>
 *              {props.children}
 *          </AuthenticationContext.Provider>
 *      )
 * }
 * ```
 *
 * 2. Now we need to register the provider using the `registerProviders` function.
 * ```
 * GlobalProvider.registerProviders(AuthenticationProvider)
 * ```
 *
 * That's it, now you have this context registered as global.
 *
 * So how to use it?
 *
 * Above everything, in your App.ts or your custom next.js _app.ts file you need to import this GlobalProvider and define
 * it like this:
 * ```
 * function MyApp({ Component, pageProps } = {}) {
 *      return (
 *          <GlobalProvider.Provider>
 *              <Main>
 *                  <Component {...pageProps} />
 *              </Main>
 *          </GlobalProvider.Provider>
 *      )
 * }
 * ```
 *
 * Really simple, and an API without needing redux, we can also add persist functionality to persist the state without complicated
 * stuff like redux. I know this code seems kinda complicated at first, but trust me, it's simpler than redux. Redux is too bloated
 * and complex.
 */
function initializeGlobalProvider() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type CustomProviders = (props: PropsWithChildren<any>) => ReactNode;
  const providers: {
    after?: string;
    provider: CustomProviders;
  }[] = [];

  function registerProviders(provider: CustomProviders, after?: string) {
    const isAlreadyRegistered = providers.some(
      ({ provider: p }) => p.name === provider.name
    );
    if (isAlreadyRegistered) return;
    if (after) {
      const indexOfAfterProvider = providers.findIndex(
        ({ provider }) => provider.name === after
      );
      if (indexOfAfterProvider !== -1) {
        providers.splice(indexOfAfterProvider + 1, 0, { provider });
        return;
      }
    }
    const indexOfProvider = providers.findIndex(
      ({ after }) => after === provider.name
    );
    if (indexOfProvider !== -1) {
      providers.splice(indexOfProvider, 0, { provider, after });
    } else {
      providers.push({ provider, after });
    }
  }

  function Provider(props: PropsWithChildren<unknown>): JSX.Element {
    const getProviders = () => {
      let LastComponent = props.children;
      for (let i = providers.length - 1; i >= 0; i--) {
        LastComponent = createElement(
          providers[i].provider,
          null,
          LastComponent
        );
      }
      return LastComponent;
    };
    return <React.Fragment>{getProviders()}</React.Fragment>;
  }

  return {
    registerProviders,
    Provider,
  };
}

const GlobalProvider = initializeGlobalProvider();
export default GlobalProvider;
