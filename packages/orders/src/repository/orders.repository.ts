import type { Transaction } from "@techmart/db";

export interface OrderRecord {
  id: string;
  customerId: string;
  totalAmount: string;
  createdAt: Date;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
}

export interface OrderWithItems extends OrderRecord {
  items: OrderItemRecord[];
}

export interface ProductSalesSummary {
  productId: string;
  quantitySold: number;
  revenue: string;
}

export interface OrdersRepository {
  createOrder(
    tx: Transaction,
    data: { customerId: string; totalAmount: string },
  ): Promise<OrderRecord>;
  createOrderItems(
    tx: Transaction,
    items: { orderId: string; productId: string; quantity: number; unitPrice: string }[],
  ): Promise<void>;
  findByCustomer(customerId: string): Promise<OrderWithItems[]>;
  findAll(): Promise<OrderWithItems[]>;
  getProductSalesSummary(productId: string): Promise<ProductSalesSummary>;
}
