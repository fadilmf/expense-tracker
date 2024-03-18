"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth, db } from "@/lib/firebaseClient";
import { useAddExpense } from "@/lib/useAddExpense";
import { useGetUserInfo } from "@/lib/useGetUserInfo";

import { rupiahFormatter } from "@/lib/utils";
import { signOut } from "firebase/auth";
import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { CalendarIcon, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuth } = useGetUserInfo();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [expenseTotal, setExpenseTotal] = useState(0);

  const expenseCollectionRef = collection(db, "expenses");
  const { userID } = useGetUserInfo();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { addExpense } = useAddExpense();

  const [description, setDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { name, profilePhoto } = useGetUserInfo();

  const getExpenses = async (selectedMonth: any, selectedYear: any) => {
    let unsubscribe: any;

    try {
      const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      // startOfMonth.setDate(1);
      // startOfMonth.setHours(0, 0, 0, 0);
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({ description, expenseAmount });
    setIsDialogOpen(false);
    getExpenses(currentMonth, currentYear);
  };

  useEffect(() => {
    if (!isAuth) {
      router.push("/auth");
    }
    getExpenses(currentMonth, currentYear);
  });
  return (
    <>
      <div className="container">
        <div className="fixed bottom-5 right-5">
          <Dialog open={isDialogOpen} onOpenChange={(o) => setIsDialogOpen(o)}>
            <DialogTrigger asChild>
              <Button className="py-7 rounded-full">
                <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah pengeluaran</DialogTitle>
                <DialogDescription>Jangan boros-boros ya</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Buat apa
                  </label>
                  <Input
                    id="description"
                    placeholder="apa"
                    className="col-span-3"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="amount" className="text-right">
                    Jumlah
                  </label>
                  <Input
                    id="expenseAmount"
                    type="number"
                    placeholder="berapa"
                    className="col-span-3"
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={onSubmit}
                  disabled={
                    description.trim().length <= 0 || expenseAmount === 0
                  }
                >
                  Tambah
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="my-4">
          <h1 className="text-xl">
            Hi! <span className="font-bold">{name}</span>
          </h1>
        </div>

        <div className="mb-4">
          <Card>
            <CardHeader>
              <h1 className="font-semibold">Total Pengeluaran Bulan Ini:</h1>
            </CardHeader>
            <CardContent>
              <p className="font-extrabold text-4xl">
                {/* {rupiahFormatter(500000)} */}
                {rupiahFormatter(expenseTotal)}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-4">
            <h1 className="font-semibold">Recent Transactions</h1>
            <h1 className="text-blue-500 hover:underline">
              <Link href="/expenses">View all</Link>
            </h1>
          </div>
          <ul>
            {expenses.slice(0, 5).map((expense, index) => {
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
                    <CardFooter>
                      <p>
                        {new Date(createdAt?.seconds * 1000).toDateString()}
                      </p>
                    </CardFooter>
                  </Card>
                </li>
              );
            })}
          </ul>

          {/* <Card>
            <CardContent>
              <ul>
                {expenses.slice(0, 5).map((expense, index) => {
                  const { description, expenseAmount } = expense;
                  return (
                    <li key={index} className="py-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold w-32 sm:w-52">
                          {description}
                        </h4>
                        <p>{rupiahFormatter(expenseAmount)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {expenses.length > 5 && (
                <div className="text-blue-500 hover:underline">
                  <Link href="/expenses">...Pengeluaran yang lain</Link>
                </div>
              )}
            </CardContent>
          </Card> */}
        </div>
      </div>
    </>
  );
}
