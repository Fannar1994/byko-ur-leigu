
import { searchByKennitala, offHireItem } from "./api";
import { RentalItem } from "@/types/contract";

export async function fetchContractData(kennitala: string) {
  try {
    const data = await searchByKennitala(kennitala);
    return data;
  } catch (error) {
    console.error("Error fetching contract data:", error);
    throw error;
  }
}

export async function performOffHire(itemId: string, noCharge: boolean) {
  try {
    const response = await offHireItem(itemId, noCharge);
    return response;
  } catch (error) {
    console.error("Error performing off-hire:", error);
    throw error;
  }
}

export function filterActiveItems(items: RentalItem[]) {
  return items.filter(item => 
    item.status === "Í leigu" || item.status === "On Rent"
  );
}

export function filterReadyForPickItems(items: RentalItem[]) {
  return items.filter(item => 
    item.status !== "Tiltekt" && 
    item.status !== "Úr leiga" && 
    item.status !== "Off-Hired" &&
    item.status !== "Í leigu" &&
    item.status !== "On Rent" &&
    item.status !== "Tilbúið til afhendingar"
  );
}

export function filterTiltektItems(items: RentalItem[]) {
  return items.filter(item => 
    item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar"
  );
}

export function filterOffHiredItems(items: RentalItem[]) {
  return items.filter(item => 
    item.status === "Úr leiga" || item.status === "Off-Hired"
  );
}
