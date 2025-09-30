# Brew Finder

A small React app built with Vite that searches breweries by name, city, or type of brewery using the **OpenBreweryDB** API.

## File Structue

```
src/
  components/        # Reusable, isolated UI units
  shared/            # Functions, hooks, types, and shared values(kept everything in utils file for now)
  App.tsx            # Page composition + query <-> state sync
  main.tsx           # Router + app bootstrap
  styles.css         # Small, global utility styles
```

- **Routing & URL = state**: I used `react-router` search params instead of global state. This keeps the app shareable and restorable via the URL and avoids state duplication.
- **Data flow**: The page (`App.tsx`) owns fetching based on the URL query. Children are stateless and fire events up.
- **Pagination**: Looks like OpenBreweryDB doesn't return a total count. I am guessing there’s a next page by `items.length === per_page`. This avoids a second request.
- **Component boundaries**: `BreweryList` renders a list of `BreweryListItem`. The details view is a modal (`DetailsModal`) so we don't navigate away.
- **Testing**: A focused test validates that each page renders the right bits and handles clicks. Any UI change will effect tests going forward.

## Getting started

```bash
pnpm install
pnpm run dev
```

## Scripts

- `pnpm run dev` – Start Vite dev server
- `pnpm run build` – Production build
- `pnpm run test` – Run unit tests (Vitest + RTL)

## What I'd improve with more time

- Add accessibility improvements to the modal (focus trap, ESC key).
- Start creating folders to start separating by features if more features are added
- Add E2E coverage (Cypress or Playwright) for query-param behavior and pagination.
- Extract an API layer with caching (e.g., React Query) and request cancelation by key.
- Make `type` and `city` filter options **discoverable** by querying popular value or add something like fuzzy search/auto complete.
- Add skeleton loaders and a more built out table layout option along with design overhaul.
- Split CSS to modules instead of having a global file
- Add sorting to the search as well as random brewery by area/city/zipcode/coordinates
