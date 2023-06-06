export interface CheckAvailabilityPort {
  execute(productId: number, quantity: number): Promise<boolean>;
}