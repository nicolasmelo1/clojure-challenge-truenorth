# TrueNorth Coding Challenge LoanPro (Backend)

Author: Nicolas Melo

## Description

UI views:

- Login (and “sign out” button anywhere available for all session-required screens)

  - A simple username and password input form

- New Operation

  - An input form providing all fields to request a new operation on behalf of the current user

- User Records
  - Datatable of all operation records from the current user
  - Datatable should have pagination (page number and per-page option) and sorting
  - Datatable should have a filter/search input field for partial matches
  - Delete button to delete records

## Solution

**LIVE DEMO**: (Live Demo Link)[https://truenorth-challenge-fe.vercel.app/]

**IMPORTANT**: You don't need credentials to login because you can just register a new user.

This is the frontend solution for the coding challenge, it is a React application, created with Vite and deployed to Vercel.

#### Technologies used

- [Storybook](https://storybook.js.org/)
- [PNPM](https://pnpm.io/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tanstack Table](https://tanstack.com/table/v8)
- [Tanstack Query](https://tanstack.com/query/latest)
- [Tanstack Router](https://tanstack.com/router/v1)
- [Typescript](https://www.typescriptlang.org/)
- [Vercel](https://vercel.com/)
- [SWC](https://swc.rs/)
- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/docs/intro)

#### How to run the project in your local machine

1. Guarantee that you have Node.js installed.
2. Clone the repository.
3. Run `pnpm install` to install all the dependencies.
4. Start the backend server.
5. Run `pnpm run dev` to start the development server.
6. Open your browser and go to `http://localhost:5173/`.

#### How to run storybook

1. Guarantee that you have Node.js installed.
2. Clone the repository.
3. Run `pnpm install` to install all the dependencies.
4. Run `pnpm run storybook` to start the development server.
5. Open your browser and go to `http://localhost:6006/`.

#### How to run the project in Vercel or any other platform

For Vercel you need to configure it in vercel. It will create a .vercel folder with the configuration files.

For other platforms, refer to [this documentation](https://vitejs.dev/guide/static-deploy.html)

#### How is the project structure and my though process

I have used Vite to create this project because i have used it before so it's straight forward for me. I have used React because it's the framework i have the most experience with and i really trust Tanner Linsley as you can see so i have used a lot of his libraries.

Similar to the backend i like to structure my frontend projects in a way that it is easy to navigate and understand. So i also choose Domain Driven Design for that reason. All of the application code, the routes, the components, hooks etc are under `features` folder. The `core` folder contains the core of the application, the `login` folder contains the authentication logic to either register a new user or log an existing user in, the `operations` folder contains the logic for the operations, and last but not least the `records` folder contains the logic for displaying the records and deleting them on a data format.

#### How i handle authentication.

When the page is first loaded you will see on the routes that we have an `useAppReady`, the core idea is to check if the user is logged in or not. If the user is not logged in we will redirect him to the login page. If the user is logged in we will redirect him to the calculator page. The `useAppReady` hook is a custom hook that i have created to handle this logic. It pretty much is used to wait for this process to be complete and then render the application.

##### What about the api?

All api calls are done using the `api` on the `core/utils`. You will see there is 3 files on it. The most important one is the index, the second is the observers. It's simple:

An Api call is made: `api.get('/v1/records')`, let's say the access token got expired. We refresh the token and make the api call again using the same parameters. Easy right?

You as a programmer don't have to configure it, it's all done automatically. If the user is not logged in, it will redirect him to the login page.

**BUT WHAT ABOUT THE OBSERVERS?** yes, we have used observers for that, let's say you want to catch another type of error, you can configure it anywhere. On our use case we are configuring it in the `core/contexts/AuthenticationContext.tsx`. So a request comes in, an error happens, we call all the observers, if any of them call `makeRequestsAgain` function we will make the request again, otherwise we just safely fail.

One thing to notice is the Storage. To store the values we are using localstorage. It's not the very BEST approach but we are using it because it's simple and it works. For configuring the storage we are using the `Adapter Pattern`. **What?** Yes, we define a structure that the storage should follow. So during runtime we just pass the storage implementation. So in other words, want to use this code in react native? Fine. Want to use it in the backend, also fine. Just need to follow the structure.

##### How each domain is structured?

- Contexts: The contexts used by that domain. Or data that you want to share between multiple pages of this domain.
- Components: Each component is a folder structured in the following way:
  - MYCOMPONENT.component.tsx: This can have any sort of logic in it.
  - MYCOMPONENT.layout.tsx: The layout of the component. **Should not contain any I/O operation or route redirection, so we can mock it**
  - MYCOMPONENT.stories.tsx: The stories of the component.
  - MYCOMPONENT.styles.tsx: The styles specific for the component.
- Pages: Similar to `components`, but the key difference here is that this is a page, so it's the entrypoint of the router. So every route should be mapped to a specific page.
- Hooks: The hooks specific to the domain.
- routes.tsx: The routes that the domain defines.
