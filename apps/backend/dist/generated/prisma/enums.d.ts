export declare const OrderStatus: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly PREPARING: "PREPARING";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REFUSED: "REFUSED";
    readonly CANCELLED: "CANCELLED";
    readonly CHARGEBACK: "CHARGEBACK";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const PaymentMethod: {
    readonly CREDIT_CARD: "CREDIT_CARD";
    readonly DEBIT_CARD: "DEBIT_CARD";
    readonly PIX: "PIX";
    readonly CASH: "CASH";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
