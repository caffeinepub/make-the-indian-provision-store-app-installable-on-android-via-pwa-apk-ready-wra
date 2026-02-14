import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BuyerProfile {
    name: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    name: string;
    category: ProductCategory;
    price: bigint;
}
export enum ProductCategory {
    groceries = "groceries",
    snacks = "snacks",
    householdToiletries = "householdToiletries",
    fruits = "fruits",
    spices = "spices",
    beverages = "beverages",
    vegetables = "vegetables"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(id: bigint, name: string, price: bigint, category: ProductCategory): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignVendor(user: Principal): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getBuyerProfile(buyer: Principal): Promise<BuyerProfile | null>;
    getCallerBuyerProfile(): Promise<BuyerProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: bigint): Promise<Product | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeVendor(user: Principal): Promise<void>;
    saveCallerBuyerProfile(profile: BuyerProfile): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProductPrice(id: bigint, newPrice: bigint): Promise<void>;
}
