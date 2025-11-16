import * as bcrypt from 'bcrypt';

interface SeedUser {
    email:    string;
    userName: string;
    password: string;
    roles:    string;
    rubroName?: string;
    moduleName?: string;
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

interface SeedTopic { name: string; }
interface SeedModule { name: string; }
interface SeedRubro { name: string; }

interface SeedData {
    users: SeedUser[];
    topics: SeedTopic[];
    modules: SeedModule[];
    rubros: SeedRubro[];
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
    rubros: [
        { name: 'Tecnologia' },
        { name: 'Pasteleria' },
        { name: 'Cafeteria' },
        { name: 'Libreria' },
        { name: 'Marketing' }
    ],
    topics: [
        { name: 'Marketing Digital' },
        { name: 'Finanzas' },
        { name: 'Emprendimiento' },
        { name: 'Ventas' },
        { name: 'Atencion al Cliente' },
        { name: 'Gestion de Proyectos' }
    ],
    modules: [
        { name: 'Modulo1' },
        { name: 'Modulo2' },
        { name: 'Modulo3' }
    ],
    users: [
        { email: 'usuario1@gmail.com', userName: 'Usuario1', password: '123456', roles: 'user', rubroName: 'Tecnologia', moduleName: 'Modulo1' },
        { email: 'usuario2@gmail.com', userName: 'Usuario2', password: '123456', roles: 'user', rubroName: 'Pasteleria', moduleName: 'Modulo2' },
        { email: 'usuario3@gmail.com', userName: 'Usuario3', password: '123456', roles: 'user', rubroName: 'Cafeteria', moduleName: 'Modulo3' },
        { email: 'usuario4@gmail.com', userName: 'Usuario4', password: '123456', roles: 'user', rubroName: 'Libreria', moduleName: 'Modulo1' },
        { email: 'usuario5@gmail.com', userName: 'Usuario5', password: '123456', roles: 'user', rubroName: 'Marketing', moduleName: 'Modulo2' },
        { email: 'usuario6@gmail.com', userName: 'Usuario6', password: '123456', roles: 'user', rubroName: 'Tecnologia', moduleName: 'Modulo3' },
        { email: 'usuario7@gmail.com', userName: 'Usuario7', password: '123456', roles: 'user', rubroName: 'Pasteleria', moduleName: 'Modulo1' },
        { email: 'usuario8@gmail.com', userName: 'Usuario8', password: '123456', roles: 'user', rubroName: 'Cafeteria', moduleName: 'Modulo2' },
        { email: 'usuario9@gmail.com', userName: 'Usuario9', password: '123456', roles: 'user', rubroName: 'Libreria', moduleName: 'Modulo3' },
        { email: 'admin@gmail.com', userName: 'Admin', password: '123456', roles: 'admin', rubroName: 'Tecnologia', moduleName: 'Modulo1' }
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