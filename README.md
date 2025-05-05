### Study Helper

### Team Members

- Andrei Kondrashov
- Kate Dingman
- Vachana Bangalore Krupashankar
- Aravind Shyamanapally
- Pablo Rodas

## Run locally

1. Install npm, pnpm, node.js and project dependencies

   ```bash
   chmod +x ./script.sh
   ```

   ```bash
   ./script.sh
   ```

2. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   GEMINI_API_KEY=[INSERT API KEY]
   GEMINI_MODEL=gemini-2.0-flash-lite
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

3. Run the project

   ```bash
   npm run dev
   ```

4. Access server `localhost:3000` in your browser

### Test Environemnt Setup

1. Create `.env.test` file to put connection information later on
2. Install [docker desktop](https://www.docker.com/get-started/) and make changes to its configuration according to this [link](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos&queryGroups=access-method&access-method=studio#running-supabase-locally). Choose macOS or Windows depending on your system.
3. Install the Supabase CLI
   ```
   pnpm add supabase --save-dev
   ```
   or
   ```
   npm install --save-dev
   ```
4. Link the project
   ```
   npx supabase link -p 'password-from-db'
   ```
5. Get the schema from supabase
   ```
   npx supabase db dump -f supabase/schema.sql
   ```
6. Run to pull schema from supabase
   ```
   npx supabase db pull --linked
   ```
7. Initialize the project using this command
   ```
   npx supabase init
   ```
8. Next steps is to start running local instance use this
   ```
   npx supabase start
   ```

- If all steps before were completed correctly
- You should see the set of configuration parameters, use them to fill `.env.test`
  - `NEXT_PUBLIC_SUPABASE_URL = API URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY = anon key`
  - `SUPABASE_SERVICE_ROLE_KEY = service_role key`
  - `SUPABASE_JWT_SECRET = JWT secret`
- Don't forget to add also
  - `GEMINI_API_KEY=[INSERT API KEY]`
  - `GEMINI_MODEL=gemini-2.0-flash-lite`

10. To stop supabase use

    ```
    npx supabase stop
    ```

    if you don't want to save changes you've made use

    ```
    npx supabase stop --no-backup
    ```

### Unit Tests (Jest)

1. Configure testing environemnt according to [test environment setup](#test-environemnt-setup)

2. Run local instance of supabase
   ```
   npx supabase start
   ```
3. Run jest
   ```
   npm run test
   ```

### End to end tests (Playwright)

1. Configure testing environemnt according to [test environment setup](#test-environemnt-setup)

2. Run local instance of supabase
   ```
   npx supabase start
   ```
3. Run next.js
   ```
   npm run e2e
   ```
4. Run tests
   ```
   npx playwright test --timeout=80000
   ```
