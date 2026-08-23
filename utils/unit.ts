import { Unit } from "../models/Ingredients";

export type DisplayUnit = "g" | "kg" | "ml" | "L" | "unit";

export const DISPLAY_UNITS: { value: DisplayUnit; label: string }[] = [
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "unit", label: "unidade" },
];

export function toBaseUnit(
  quantity: number,
  displayUnit: DisplayUnit,
): { quantity: number; unit: Unit } {
  switch (displayUnit) {
    case "kg":
      return { quantity: quantity * 1000, unit: "g" };
    case "L":
      return { quantity: quantity * 1000, unit: "ml" };
    case "g":
    case "ml":
    case "unit":
      return { quantity, unit: displayUnit };
  }
}

export function toDisplayUnit(
  quantity: number,
  baseUnit: Unit,
): { quantity: number; unit: DisplayUnit } {
  if (baseUnit === "g" && quantity >= 1000 && quantity % 1000 === 0) {
    return { quantity: quantity / 1000, unit: "kg" };
  }
  if (baseUnit === "ml" && quantity >= 1000 && quantity % 1000 === 0) {
    return { quantity: quantity / 1000, unit: "L" };
  }
  return { quantity, unit: baseUnit };
}
