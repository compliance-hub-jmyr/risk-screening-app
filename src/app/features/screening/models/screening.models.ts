export type ListSource = 'OFAC' | 'WORLD_BANK' | 'ICIJ';

export interface ScreeningEntry {
  listSource: ListSource;
  name: string;
  address: string | null;

  // OFAC-specific
  type: string | null;
  list: string | null;
  programs: string[] | null;
  score: number | null;

  // World Bank-specific
  country: string | null;
  fromDate: string | null;
  toDate: string | null;
  grounds: string | null;

  // ICIJ-specific
  jurisdiction: string | null;
  linkedTo: string | null;
  dataFrom: string | null;
}

export interface ScreeningResponse {
  hits: number;
  entries: ScreeningEntry[];
}

export interface ScreeningRequest {
  q: string;
  sources?: ListSource[];
}
