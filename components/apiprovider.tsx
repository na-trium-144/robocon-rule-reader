import { createContext, useState, useEffect, useContext } from "react";
import { Book, Rule, Comment, Category, ApiReturnMsg } from "lib/types";

interface ApiContextI {
  fetchAll: () => void;
  books: Book[];
  categories: Category[];
  addBook: (book: Book) => Promise<boolean>;
  editBook: (book: Book) => Promise<boolean>;
  deleteBook: (book: Book) => Promise<boolean>;
  addRule: (rule: Rule) => Promise<boolean>;
  editRule: (rule: Rule) => Promise<boolean>;
  deleteRule: (rule: Rule) => Promise<boolean>;
  editComment: (comment: Comment) => Promise<boolean>;
  addComment: (comment: Comment) => Promise<boolean>;
  deleteComment: (comment: Comment) => Promise<boolean>;
  setCommentOrder: (comment: Comment) => Promise<boolean>;
  apiResult: ApiReturnMsg;
}
const ApiContext = createContext<ApiContextI>(null as never);
export const useApi = () => useContext(ApiContext);

export function ApiProvider(props: { children: any }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [apiResult, setApiResult] = useState<ApiReturnMsg>({
    status: 200,
    ok: false,
    msg: "",
  });
  const api = async (pathName: string, data: any) => {
    const res = await fetch("/api/" + pathName, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const retMsg = (await res.json()) as ApiReturnMsg;
    setApiResult(retMsg);
    return retMsg.ok;
  };
  const fetchAll = () => {
    void (async () => {
      const res = await fetch("/api/fetch_book");
      const resData = (await res.json()) as Book[];
      setBooks(resData);
    })();
    void (async () => {
      const res = await fetch("/api/fetch_category");
      const resData = (await res.json()) as Category[];
      setCategories(resData);
    })();
  };
  const addBook = (book: Book) => api("add_book", book);
  const editBook = (book: Book) => api("edit_book", book);
  const deleteBook = (book: Book) => api("delete_book", book);
  const addRule = (rule: Rule) => api("add_rule", rule);
  const editRule = (rule: Rule) => api("edit_rule", rule);
  const deleteRule = (rule: Rule) => api("delete_rule", rule);
  const addComment = (comment: Comment) => api("add_comment", comment);
  const editComment = (comment: Comment) => api("edit_comment", comment);
  const deleteComment = (comment: Comment) => api("delete_comment", comment);
  const setCommentOrder = (comment: Comment) =>
    api("set_comment_order", comment);
  useEffect(fetchAll, []);

  return (
    <ApiContext.Provider
      value={{
        fetchAll,
        books,
        categories,
        addBook,
        editBook,
        deleteBook,
        addRule,
        editRule,
        deleteRule,
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
