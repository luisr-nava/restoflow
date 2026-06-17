import { RestaurantSettingsForm } from "./restaurant-settings-form";

export function RestaurantSettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Configuración
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestioná la información principal del restaurante.
        </p>
      </div>

      <RestaurantSettingsForm />
    </div>
  );
}
