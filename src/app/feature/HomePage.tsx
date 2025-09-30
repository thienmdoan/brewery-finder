import {
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react";
import BreweryList from "../components/BreweryList";
import DetailsModal from "../components/DetailsModal";
import Pagination from "../components/Pagination";
import {
  PER_PAGE,
  TYPES,
  useQueryState,
  type Brewery,
  type QueryState,
} from "../shared/utils";

const API_URL = "https://api.openbrewerydb.org/v1/breweries";

type FetchStatus = "idle" | "loading" | "success" | "error";

type BreweryDataState = {
  items: Brewery[];
  hasNext: boolean;
};

const HomePage = () => {
  const [query, setQuery] = useQueryState();
  const [data, setData] = useState<BreweryDataState>({
    items: [],
    hasNext: false,
  });
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Brewery | null>(null);
  const searchFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBreweries(currentQuery: QueryState) {
      setStatus("loading");
      setError(null);

      try {
        const params = new URLSearchParams();
        if (currentQuery.name) params.set("by_name", currentQuery.name);
        if (currentQuery.city) params.set("by_city", currentQuery.city);
        if (currentQuery.type) params.set("by_type", currentQuery.type);
        params.set("per_page", String(PER_PAGE));
        params.set("page", String(currentQuery.page));

        const response = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const breweries = (await response.json()) as Brewery[];
        const linkHeader =
          typeof response.headers?.get === "function"
            ? response.headers.get("link") ?? ""
            : "";
        const hasNextLink = /rel="?next"?/i.test(linkHeader);
        const hasNextHeuristic = breweries.length === PER_PAGE;

        setData({
          items: breweries,
          hasNext:
            hasNextLink ||
            hasNextHeuristic ||
            (currentQuery.page === 1 && breweries.length > 0),
        });
        setStatus("success");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message ?? String(err));
        setStatus("error");
      }
    }

    fetchBreweries(query);

    return () => controller.abort();
  }, [query.name, query.city, query.type, query.page]);

  const applyFormData = (formData: FormData) => {
    const asString = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value : "";
    };

    setQuery({
      name: asString("name"),
      city: asString("city"),
      type: asString("type"),
      page: 1,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    applyFormData(new FormData(event.currentTarget));
  };

  const handleTypeChange: ChangeEventHandler<HTMLSelectElement> = () => {
    const form = searchFormRef.current;
    if (!form) return;
    applyFormData(new FormData(form));
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Brew Finder</h1>
      </header>

      <section className="card">
        <form
          ref={searchFormRef}
          id="brewerySearchForm"
          className="row"
          onSubmit={handleSubmit}
        >
          <input
            className="input"
            name="name"
            placeholder="Search by name…"
            defaultValue={query.name}
          />
          <input
            className="input"
            name="city"
            placeholder="Filter by city…"
            defaultValue={query.city}
          />
          <select
            name="type"
            defaultValue={query.type}
            onChange={handleTypeChange}
          >
            <option value="">All types</option>
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button className="button" type="submit">
            Search
          </button>
        </form>
      </section>

      {status === "loading" && (
        <div className="loading">Loading breweries…</div>
      )}
      {status === "error" && (
        <div className="error">Something went wrong: {error}</div>
      )}
      {status === "success" && data.items.length === 0 && (
        <div className="empty">No breweries found.</div>
      )}

      {status === "success" && data.items.length > 0 && (
        <>
          <BreweryList items={data.items} onSelect={setSelected} />
          <Pagination
            page={query.page}
            hasNext={data.hasNext}
            onPage={(page) => setQuery({ page })}
          />
        </>
      )}

      {selected && (
        <DetailsModal brewery={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default HomePage;
