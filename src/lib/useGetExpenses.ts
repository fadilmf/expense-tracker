import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebaseClient";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expenseTotal, setExpenseTotal] = useState(0);

  const expenseCollectionRef = collection(db, "expenses");
  const { userID } = useGetUserInfo();

  const getExpenses = async () => {
    let unsubscribe: any;

    try {
      const queryExpenses = query(
        expenseCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      );

      unsubscribe = onSnapshot(queryExpenses, (snapshot) => {
        let docs: any[] = [];
        let totalExpense = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;

          docs.push({ ...data, id });

          totalExpense += data.expenseAmount;
        });

        setExpenses(docs);
        setExpenseTotal(Number(totalExpense));
      });
    } catch (error) {
      console.error(error);
    }

    return () => unsubscribe();
  };

  useEffect(() => {
    getExpenses();
  }, []);

  return { expenses, expenseTotal };
};
