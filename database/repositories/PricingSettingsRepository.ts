import { PricingSettings } from "../../models/PricingSettings";
import { db } from "../database";

export const PricingSettingsRepository = {
  get(): PricingSettings {
    const row = db.getFirstSync<any>(
      `SELECT multiplier, labor_cost_cents, packaging_cost_cents, additional_cost_cents
        FROM pricing_settings
        WHERE id = 1;`,
    );

    return {
      multiplier: row.multiplier,
      laborCostCents: row.labor_cost_cents,
      packagingCostCents: row.packaging_cost_cents,
      additionalCostCents: row.additional_cost_cents,
    };
  },

  update(settings: PricingSettings): void {
    db.runSync(
      `UPDATE pricing_settings
        SET multiplier = ?, labor_cost_cents = ?, packaging_cost_cents = ?, additional_cost_cents = ?
        WHERE id = 1;`,
      [
        settings.multiplier,
        settings.laborCostCents,
        settings.packagingCostCents,
        settings.additionalCostCents,
      ],
    );
  },
};
