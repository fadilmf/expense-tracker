"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/firebaseClient";
import { useGetUserInfo } from "@/lib/useGetUserInfo";
import { rupiahFormatter } from "@/lib/utils";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expenseTotal, setExpenseTotal] = useState(0);

  const expenseCollectionRef = collection(db, "expenses");
  const { userID } = useGetUserInfo();

  const date = new Date();

  const [month, setMonth] = useState((date.getMonth() + 1).toString());
  const [year, setYear] = useState(date.getFullYear().toString());

  const getExpenses = async (selectedMonth: any, selectedYear: any) => {
    let unsubscribe: any;

    try {
      const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const endOfMonth = new Date(
        selectedYear,
        selectedMonth,
        0,
        23,
        59,
        59,
        999
      );

      const queryExpenses = query(
        expenseCollectionRef,
        where("userID", "==", userID),
        where("createdAt", ">=", Timestamp.fromDate(startOfMonth)),
        where("createdAt", "<=", Timestamp.fromDate(endOfMonth)),
        orderBy("createdAt", "desc")
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

  const deleteExpense = async (id: string) => {
    const deleteConfirmation = window.confirm("Ingin menghapus?");
    if (deleteConfirmation) {
      await deleteDoc(doc(db, "expenses", id));
    }
  };

  useEffect(() => {
    getExpenses(month, year);
  }, [month, year]);

  console.log(month);

  return (
    <>
      <div className="container">
        <div className="flex justify-center gap-2 mt-5">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue defaultValue={month} />
            </SelectTrigger>
            <SelectContent>
              {[...Array(12)].map((_, index) => {
                return (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {new Date(Number(year), index).toLocaleString("default", {
                      month: "long",
                    })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue defaultValue={year} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <h1 className="font-bold text-2xl">
          {new Date(Number(year) + "/" + Number(month)).toLocaleString(
            "default",
            {
              month: "long",
            }
          ) +
            " " +
            year}
        </h1>
        <div className="mb-4">
          <ul>
            {expenses.map((expense, index) => {
              const { description, expenseAmount, createdAt } = expense;
              return (
                <li key={index} className="mb-1">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold w-32 sm:w-52">
                          {description}
                        </h4>
                        <p>{rupiahFormatter(expenseAmount)}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {new Date(createdAt?.seconds * 1000).toDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="destructive"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Hapus
                      </Button>
                      {/* <Button>Edit</Button> */}
                    </CardFooter>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
