import * as bcrypt from 'bcrypt';

interface SeedUser {
    email:    string;
    userName: string;
    password: string;
    roles:    string;
}

interface SeedPaymentMethod {
    method: string;
    name: string;
    description: string;
    status: string;
}

interface SeedSystemConfig {
    key: string;
    value: string;
    description?: string;
}

interface SeedPaymentMethodDisplay {
    name: string;
    type: 'image' | 'text';
    imageUrl?: string;
    imageSize?: string;
    textContent?: string;
    textColor?: string;
    backgroundColor?: string;
    order: number;
    isActive: boolean;
}

interface SeedData {
    users: SeedUser[];
    paymentMethods: SeedPaymentMethod[];
    paymentMethodsDisplay: SeedPaymentMethodDisplay[];
    systemConfig: SeedSystemConfig[];
}

export const initialData: SeedData = {
    paymentMethodsDisplay: [
        {
            name: 'Paypal',
            type: 'image',
            imageUrl: 'https://res.cloudinary.com/dc629i0tc/image/upload/v1762102793/xwfuetwgwusuicvvycs9.png',
            imageSize: 'xlarge',
            textContent: '',
            textColor: '#ffffff',
            backgroundColor: '#10b981',
            order: 1,
            isActive: true
        },
        {
            name: 'QR BOLIVIANO',
            type: 'text',
            imageUrl: '',
            imageSize: 'medium',
            textContent: 'QR BOLIVIANO',
            textColor: '#ffffff',
            backgroundColor: '#10b981',
            order: 2,
            isActive: true
        },
        {
            name: 'Binance',
            type: 'image',
            imageUrl: 'https://res.cloudinary.com/dc629i0tc/image/upload/v1762102752/pqxhxvbxtazamvnv8ioa.png',
            imageSize: 'xlarge',
            textContent: '',
            textColor: '#ffffff',
            backgroundColor: '#10b981',
            order: 3,
            isActive: true
        }
    ],
    paymentMethods: [
        {
            method: 'binance',
            name: 'Binance Pay',
            description: 'Pago con criptomonedas | Rápido y seguro | Mundial',
            status: 'allowed'
        },
        {
            method: 'paypal',
            name: 'PayPal',
            description: 'Paga con tu cuenta PayPal | Protección del comprador | Mundial',
            status: 'allowed'
        },
        {
            method: 'veripagos',
            name: 'QR Boliviano',
            description: 'Pago con QR desde tu banco | Todos los bancos de Bolivia | Solo Bolivia',
            status: 'allowed'
        }
    ],
    users: [
        {
            email: 'usuario@gmail.com',
            userName: 'Usuario',
            password: '123456',
            roles: 'user'
        },
        {
            email: 'admin@gmail.com',
            userName: 'Admin',
            password: '123456',
            roles: 'admin'
        }
    ],
    systemConfig: [
        {
            key: 'exchange_rate_usd_bs',
            value: '15',
            description: 'Tasa de cambio de USD a Bolivianos (Bs)'
        },
        {
            key: 'rechargeNotificationEmail',
            value: 'virtumall25@gmail.com',
            description: 'Email donde se envían las notificaciones de órdenes de recarga'
        }
    ]
}