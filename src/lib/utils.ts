import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rupiahFormatter = (amount: number) => {
  const formatter = Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
  });

  return formatter.format(amount);
};
