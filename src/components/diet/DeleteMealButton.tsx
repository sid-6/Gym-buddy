"use client";

import { useRouter } from "next/navigation";
import { deleteMealAction } from "@/app/actions/nutrition";

export function DeleteMealButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="mt-4 text-[14px] font-medium text-red-600"
      onClick={async () => {
        await deleteMealAction(id);
        router.push("/diet");
        router.refresh();
      }}
    >
      Delete meal
    </button>
  );
}
