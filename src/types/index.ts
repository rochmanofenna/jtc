import type {
  Product,
  Category,
  Company,
  ProductImage,
} from "@/generated/prisma/client";

export type ProductWithRelations = Product & {
  category: Category;
  supplier: Company;
  images: ProductImage[];
};

export type CategoryWithChildren = Category & {
  children: Category[];
  _count?: { products: number };
};

export type CategoryWithProducts = Category & {
  products: ProductWithRelations[];
  _count?: { products: number };
};

export type SupplierWithProducts = Company & {
  products: Product[];
  _count?: { products: number };
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiError = {
  error: string;
  details?: unknown;
};
