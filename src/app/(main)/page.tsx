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
import { auth } from "@/lib/firebaseClient";
import { useAddExpense } from "@/lib/useAddExpense";
import { useGetExpenses } from "@/lib/useGetExpenses";
import { useGetUserInfo } from "@/lib/useGetUserInfo";

import { rupiahFormatter } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { CalendarIcon, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuth } = useGetUserInfo();

  const { addExpense } = useAddExpense();
  const { expenses, expenseTotal } = useGetExpenses();

  const [description, setDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { name, profilePhoto } = useGetUserInfo();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({ description, expenseAmount });
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (!isAuth) {
      router.push("/auth");
    }
  });
  return (
    <>
      <div className="container">
        <div className="fixed bottom-5 right-5">
          <Dialog>
            <DialogTrigger>
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
                    placeholder="berapa"
                    className="col-span-3"
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={onSubmit}>
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
        {/* <div className="mb-4">
          <Card>
            <CardHeader>
              <h1 className="font-semibold">Kategori Pengeluaran Terbesar</h1>
            </CardHeader>
            <CardContent>
              <ul>
                <li>Nabung</li>
                <li>Nabung</li>
                <li>Nabung</li>
              </ul>
            </CardContent>
          </Card>
        </div> */}
        <div className="mb-4">
          <Card>
            <CardHeader>
              <h1 className="font-semibold">History</h1>
            </CardHeader>
            <CardContent>
              <ul>
                {expenses.map((expense, index) => {
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
