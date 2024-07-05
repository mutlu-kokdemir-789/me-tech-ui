export interface QueryParamsForBookListRequest {
  filter: {
    priceMin: number;
    priceMax: number;
    rateMin: number;
    rateMax: number;
  };
  pageNumber: number;
  sort: string;
}
