import { IconSymbolName } from '@/components/ui/icon-symbol';

export interface Problem {
    id: string;
    title: string;
    description: string;
    icon: IconSymbolName;
}

export interface Solution {
    id: string;
    title: string;
    description: string;
    icon: IconSymbolName;
    gradient: [string, string];
}

export const PROBLEMS: Problem[] = [
    {
        id: 'trust',
        title: 'Sin Confianza',
        description: 'Todo depende de recomendaciones informales. Los clientes no saben a quién confiar.',
        icon: 'exclamationmark.triangle.fill',
    },
    {
        id: 'visibility',
        title: 'Sin Visibilidad',
        description: 'El talento no tiene dónde ofrecer su servicio de forma profesional.',
        icon: 'eye.slash.fill',
    },
    {
        id: 'history',
        title: 'Sin Historial',
        description: 'Los profesionales no pueden construir trayectoria ni reputación verificable.',
        icon: 'doc.text.fill',
    },
];

export const SOLUTIONS: Solution[] = [
    {
        id: 'professional',
        title: 'Oferta Profesional',
        description: 'Convierte la oferta informal en una presencia profesional, visible y confiable.',
        icon: 'person.crop.circle.badge.checkmark',
        gradient: ['#0F172A', '#1E3A8A'],
    },
    {
        id: 'trust',
        title: 'Confianza Real',
        description: 'Sistema de reseñas y verificaciones para eliminar la dependencia de "conocer a alguien".',
        icon: 'checkmark.shield.fill',
        gradient: ['#059669', '#10B981'],
    },
    {
        id: 'reputation',
        title: 'Historial Verificado',
        description: 'Los profesionales construyen su trayectoria y reputación con cada servicio.',
        icon: 'star.fill',
        gradient: ['#F59E0B', '#FBBF24'],
    },
];

export const LANDING_STATS = [
    {
        value: '100%',
        label: 'Verificado',
    },
    {
        value: '0',
        label: 'Intermediarios',
    },
    {
        value: '∞',
        label: 'Oportunidades',
    },
];
