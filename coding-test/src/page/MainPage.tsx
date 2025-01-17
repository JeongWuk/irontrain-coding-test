import { useCallback, useState } from "react";
import Table from "../components/Table";
import { ApiResponse, QueryProps } from "../types/type";
import Loading from "../components/Loading";
import { getUserData } from "../api/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const MainPage = () => {
  const [count, setCount] = useState<number>(100);
  const [gender, setGender] = useState<string>('male');
  const [birthday, setBirthday] = useState<string | Date>('2015-01-01');
  const [page, setPage] = useState<number>(1);
  const queryParams: QueryProps = { count: count * page, gender, birthday };
  const { data, error, isLoading, isFetching } = useQuery<ApiResponse>({
    queryKey: ['users', queryParams],
    queryFn: () => getUserData(queryParams),
    placeholderData: keepPreviousData,
  });

  const loadMoreData = useCallback(() => {
    if (isFetching || !data) return;
    setPage((prev) => prev + 1);
  }, [data, isFetching]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full h-full flex justify-center items-center relative">
      {data && <Table data={data.data} loadMoreData={loadMoreData} />}
    </div>
  )
}

export default MainPage;