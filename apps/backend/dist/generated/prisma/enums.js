"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.PaymentStatus = exports.OrderStatus = void 0;
exports.OrderStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
};
exports.PaymentStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REFUSED: 'REFUSED',
    CANCELLED: 'CANCELLED',
    CHARGEBACK: 'CHARGEBACK'
};
exports.PaymentMethod = {
    CREDIT_CARD: 'CREDIT_CARD',
    DEBIT_CARD: 'DEBIT_CARD',
    PIX: 'PIX',
    CASH: 'CASH'
};
//# sourceMappingURL=enums.js.map