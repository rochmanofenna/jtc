import { z } from "zod";

// ─── Product ────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  nameCn: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  descriptionCn: z.string().optional(),
  material: z.string().optional(),
  materialCn: z.string().optional(),
  specifications: z.string().optional(),
  packaging: z.string().optional(),
  moq: z.number().int().positive().optional(),
  unit: z.string().optional(),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  brandName: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  supplierId: z.string().min(1, "Supplier is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ─── Category ───────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  nameCn: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().optional(),
  sortOrder: z.number().int().default(0),
  parentId: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// ─── Supplier (Company) ────────────────────────────────────────────────────

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  type: z.enum(["buyer", "supplier"]).default("supplier"),
  country: z.enum(["ID", "CN"]).default("CN"),
  city: z.string().optional(),
  address: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

// ─── Product Query (search / filter / pagination) ──────────────────────────

export const productQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
  supplierId: z.string().optional(),
  material: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(24),
  sort: z
    .enum(["name", "createdAt", "sortOrder", "moq"])
    .default("sortOrder"),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

// ─── Quote Inquiry ──────────────────────────────────────────────────────────

export const createQuoteInquirySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  address: z.string().min(10, "Full address with postal code is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  npwp: z.string().optional().or(z.literal("")),
  ktpSim: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Please describe what you need"),
  productSlug: z.string().optional(),
  source: z.string().default("website_form"),
});

export type CreateQuoteInquiryInput = z.infer<typeof createQuoteInquirySchema>;
