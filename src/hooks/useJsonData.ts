import useRunOnWindowFocus from "@/hooks/useRunOnWindowFocus";
import env from "@/lib/env";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useJsonData = <T>(key: string) => {
  const [value, setValue] = useState<T>();
  const refetch = useCallback(async () => {
    const response = await axios.get(`${env.SKARTNER_SERVER}/jsonData/${key}`);
    setValue(response.data?.value);
  }, [key]);
  useEffect(() => {
    refetch();
  }, [refetch]);
  useRunOnWindowFocus(refetch);

  const update = useCallback(
    async (newValue: T) => {
      const response = await axios.post(
        `${env.SKARTNER_SERVER}/jsonData/${key}`,
        newValue
      );
      refetch();
    },
    [key, refetch]
  );
  return [value, update, refetch] as const;
};
export default useJsonData;
