import { createContext, useState, useEffect, useContext } from "react";
import { Rule, Comment, Category, ApiReturnMsg } from "lib/types";

interface ApiContextI {
  fetchAll: () => void;
  rules: Rule[];
  categories: Category[];
  addRule: (rule: Rule) => Promise<boolean>;
  editRule: (rule: Rule) => Promise<boolean>;
  editComment: (comment: Comment) => Promise<boolean>;
  addComment: (comment: Comment) => Promise<boolean>;
  deleteComment: (comment: Comment) => Promise<boolean>;
  setCommentOrder: (comment: Comment) => Promise<boolean>;
  apiResult: ApiReturnMsg;
}
const ApiContext = createContext<ApiContextI>(null as never);
export const useApi = () => useContext(ApiContext);

export function ApiProvider(props: { children: any }) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [apiResult, setApiResult] = useState<ApiReturnMsg>({
    status: 200,
    ok: false,
    msg: "",
  });
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
  const addRule = async (rule: Rule) => {
    const res = await fetch("/api/add_rule", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
    const retMsg = (await res.json()) as ApiReturnMsg;
    setApiResult(retMsg);
    return retMsg.ok;
  };
  const editRule = async (rule: Rule) => {
    const res = await fetch("/api/edit_rule", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
    const retMsg = (await res.json()) as ApiReturnMsg;
    setApiResult(retMsg);
    return retMsg.ok;
  };
  const editComment = async (comment: Comment) => {
    const res = await fetch("/api/edit_comment", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    const retMsg = (await res.json()) as ApiReturnMsg;
    setApiResult(retMsg);
    return retMsg.ok;
  };
  const deleteComment = async (comment: Comment) => {
    const res = await fetch("/api/delete_comment", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    const retMsg = (await res.json()) as ApiReturnMsg;
    setApiResult(retMsg);
    return retMsg.ok;
  };
  const addComment = async (comment: Comment) => {
    const res = await fetch("/api/add_comment", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    const retMsg = (await res.json()) as ApiReturnMsg;
    setApiResult(retMsg);
    return retMsg.ok;
  };
  const setCommentOrder = async (comment: Comment) => {
    const res = await fetch("/api/set_comment_order", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    const retMsg = (await res.json()) as ApiReturnMsg;
    setApiResult(retMsg);
    return retMsg.ok;
  };
  useEffect(fetchAll, []);

  return (
    <ApiContext.Provider
      value={{
        fetchAll,
        rules,
        categories,
        addRule,
        editRule,
        editComment,
        deleteComment,
        addComment,
        setCommentOrder,
        apiResult,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
}
