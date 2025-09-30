import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export type Brewery = {
  id?: string;
  name: string;
  brewery_type?: string;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  website_url?: string;
};

export type QueryState = {
  name: string;
  city: string;
  type: string;
  page: number;
};

type QueryStatePatch = Partial<QueryState>;

export const TYPES = [
  "micro",
  "nano",
  "regional",
  "brewpub",
  "large",
  "planning",
  "bar",
  "contract",
  "proprietor",
  "closed",
] as const;

export const PER_PAGE = 10;

export const useQueryState = (): [
  QueryState,
  (patch: QueryStatePatch) => void
] => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const state = useMemo<QueryState>(
    () => ({
      name: searchParams.get("name") ?? "",
      city: searchParams.get("city") ?? "",
      type: searchParams.get("type") ?? "",
      page: Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10)),
    }),
    [searchParams]
  );

  const update = (patch: QueryStatePatch) => {
    const next = new URLSearchParams(searchParams);
    (Object.keys(patch) as (keyof QueryState)[]).forEach((key) => {
      const value = patch[key];
      if (value === "" || value == null) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    navigate({ search: `?${next.toString()}` }, { replace: false });
  };

  return [state, update];
};
