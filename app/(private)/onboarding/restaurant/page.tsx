import { redirect } from "next/navigation";

import { CreateRestaurantForm } from "@/src/features/restaurants/components/create-restaurant-form";
import { restaurantService } from "@/src/features/restaurants/services/restaurant.service";
import { Heading } from "@/src/shared/components/ui/Heading";

export default async function CreateRestaurantPage() {
  const member = await restaurantService.getCurrentUserRestaurantMember();

  if (member) {
    redirect("/dashboard");
  }

  return (
    <>
      <Heading className="pb-10">Configurá tu restaurante</Heading>

      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
        <CreateRestaurantForm />
      </div>
    </>
  );
}
