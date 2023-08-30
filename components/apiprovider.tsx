import { createContext, useState, useEffect, useContext } from "react";
import {
  Book,
  BookInfo,
  Rule,
  Comment,
  Category,
  ApiReturnMsg,
} from "lib/types";
import { useRouter } from "next/router";

interface ApiContextI {
  fetchAll: () => void;
  books: BookInfo[];
  currentBook: Book;
  rules: Rule[];
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

const emptyBook = () => ({
  id: -1,
  name: "",
  rules: [],
});
export function ApiProvider(props: { children: any }) {
  const { query } = useRouter();
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [currentBook, setCurrentBook] = useState<Book>(emptyBook());
  const [rules, setRules] = useState<Rule[]>([]);
  useEffect(() => {
    const qbook =
      typeof query.book === "string"
        ? query.book
        : books.sort((a, b) => a.name > b.name)[0]?.name || "";
    const book = books.find((b) => b.name === qbook);
    if (book != undefined) {
      setCurrentBook(book);
    }
  }, [books, query]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [apiResult, setApiResult] = useState<ApiReturnMsg>({
    status: 200,
    ok: false,
    msg: "",
  });
  useEffect(() => {
    if (currentBook.name !== "") {
      void (async () => {
        const res = await fetch(`/api/fetch_rule?book=${currentBook.name}`);
        const resData = (await res.json()) as Rule[];
        setRules(resData);
      })();
      void (async () => {
        const res = await fetch(`/api/fetch_category?book=${currentBook.name}`);
        const resData = (await res.json()) as Category[];
        setCategories(resData);
      })();
    }
  }, [currentBook]);
  const fetchAll = () => {
    void (async () => {
      const res = await fetch("/api/fetch_book");
      const resData = (await res.json()) as BookInfo[];
      setBooks(resData);
    })();
  };
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
  const addBook = (book: Book) => api("add_book", book);
  const editBook = (book: Book) => api("edit_book", book);
  const deleteBook = (book: Book) => api("delete_book", book);
  const addRule = (rule: Rule) => api("add_rule", rule);
  const editRule = (rule: Rule) => api("edit_rule", rule);
  const deleteRule = (rule: Rule) => api("delete_rule", rule);
  const addComment = (comment: Comment) =>
    api("add_comment", { ...comment, bookId: currentBook.id });
  const editComment = (comment: Comment) => api("edit_comment", comment);
  const deleteComment = (comment: Comment) => api("delete_comment", comment);
  const setCommentOrder = (comment: Comment) =>
    api("set_comment_order", comment);
  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        fetchAll,
        books,
        currentBook,
        rules,
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
