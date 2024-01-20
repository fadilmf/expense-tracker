import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseClient";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddExpense = () => {
  const expenseCollectionRef = collection(db, "expenses");
  const { userID } = useGetUserInfo();

  const addExpense = async ({
    description,
    expenseAmount,
  }: {
    description: string;
    expenseAmount: number;
  }) => {
    await addDoc(expenseCollectionRef, {
      userID,
      description,
      expenseAmount,
      createdAt: serverTimestamp(),
    });
  };

  return { addExpense };
};
