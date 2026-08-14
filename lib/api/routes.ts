import { apiFetch } from "@/lib/api/client";

export interface RouteStop {
  city: string;
  price: number;
}

export interface CompanyRoute {
  id: string;
  company_name: string;
  origin_city: string;
  origin_province: string;
  destination_city: string;
  destination_province: string;
  is_active: boolean;
  total_price: number;
  stops: RouteStop[];
}

export function getCompanyRoutes() {
  return apiFetch<CompanyRoute[]>("/routes/company");
}

export interface CreateRouteInput {
  origin_city_id: string;
  destination_city_id: string;
  price: number;
}

export function createRoute(input: CreateRouteInput) {
  return apiFetch<{ id: string; price: number }>("/routes/", { method: "POST", body: input });
}

export interface AddRouteStopInput {
  route_id: string;
  city_id: string;
  /** Preço acumulado até esta paragem — não o valor do troço. */
  price: number;
}

export function addRouteStop(input: AddRouteStopInput) {
  return apiFetch<{ id: string; order: number; price: number }>("/routes/stops", {
    method: "POST",
    body: input,
  });
}

export function setRouteActive(routeId: string, active: boolean) {
  return apiFetch<{ id: string; is_active: boolean }>(
    `/routes/${routeId}/${active ? "activate" : "deactivate"}`,
    { method: "PATCH" }
  );
}

export interface City {
  id: string;
  name: string;
  province: string;
}

export function getCities() {
  return apiFetch<City[]>("/cities/", { auth: false });
}
