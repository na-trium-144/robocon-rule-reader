import { createContext, useState, useEffect, useContext } from "react";
import { Rule, Category, ApiReturnMsg } from "lib/types";
interface ApiContextI {
  fetchAll: () => void;
  rules: Rule[];
  categories: Category[];
  addRule: () => void;
  apiResult: ApiReturnMsg;
}
const ApiContext = createContext<ApiContextI>();
export const useApi = () => (useContext(ApiContext));

export function ApiProvider(props: { children: any }) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [apiResult, setApiResult] = useState<ApiReturnMsg>();
  const fetchAll = () => {
    void (async () => {
      const res = await fetch("/api/fetch_rule");
      const resData = (await res.json()) as Rule[];
      setRules(resData);
    })();
    void (async () => {
      const res = await fetch("/api/fetch_category");
      const resData = (await res.json()) as Category[];
      setCategories(resData);
    })();
  };
  const addRule = (rule: Rule) => {
    void (async () => {
      const res = await fetch("/api/add_rule", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rule),
      });
      setApiResult((await res.json()) as ApiReturnMsg);
    })();
  };
  useEffect(fetchAll, []);

  return (
    <ApiContext.Provider
      value={{
        fetchAll,
        rules,
        categories,
        addRule,
        apiResult,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
}
