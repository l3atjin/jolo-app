export interface SearchParams {
  departure: string,
  destination: string,
  date: Date
}

export interface SearchFormProps {
  onSearchSubmit: (params: SearchParams) => void;
}