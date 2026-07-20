export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

export class InsufficientStockError extends AppError {
  constructor(produtoId: string) {
    super(`Estoque insuficiente para o produto ${produtoId}.`, 409);
  }
}

export class ProductAlreadySoldError extends AppError {
  constructor(produtoId: string) {
    super(`Produto ${produtoId} já foi vendido e não pode ser excluído.`, 409);
  }
}
