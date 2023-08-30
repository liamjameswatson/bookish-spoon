import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";

// GET the values from the search params

export function useBookings() {
  const [searchParams] = useSearchParams();

  //FILTER

  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  // :{ field: "totalPrice", value: 5000, method: 'gte' };

  // SORT

  const sortByParam = searchParams.get("sortBy") || "startDate-desc"; // 'startDate-desc by default
  const [field, direction] = sortByParam.split("-");

  const sortBy = { field, direction };

  //PAGINATION

  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {
    isLoading,
    // data is undefineded at first, so set to {}, then data will be destructured from the empty object
    data: { data: bookings, count } = {}, 
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  return { isLoading, bookings, error, count };
}