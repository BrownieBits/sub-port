import { _NavSection } from "./types";

export const dashboard_nav_items: _NavSection[] = [
    {
        name: 'Main',
        items: [
            { name: 'Dashboard', url: '/dashboard', icon: 'fa-solid fa-table-columns', needs_user: true, required_plans: [] },
            { name: 'Products', url: '/dashboard/products', icon: 'fa-solid fa-shirt', needs_user: true, required_plans: [] },
            { name: 'Analytics', url: '/dashboard/analytics', icon: 'fa-solid fa-chart-line', needs_user: true, required_plans: [] },
            { name: 'Commissions', url: '/dashboard/commissions', icon: 'fa-solid fa-dollar-sign', needs_user: true, required_plans: [] },
            { name: 'Orders', url: '/dashboard/orders', icon: 'fa-solid fa-cart-shopping', needs_user: true, required_plans: [] },
            { name: 'Promotions', url: '/dashboard/promotions', icon: 'fa-solid fa-tags', needs_user: true, required_plans: [] },
            { name: 'Integrations', url: '/dashboard/integrations', icon: 'fa-solid fa-toolbox', needs_user: true, required_plans: [] },
            { name: 'Preferences', url: '/dashboard/preferences', icon: 'fa-solid fa-store', needs_user: true, required_plans: [] },
        ]
    },
    {
        name: 'Help',
        items: [
            { name: 'Settings', url: '/dashboard/settings', icon: 'fa-solid fa-gear', needs_user: true, required_plans: [] },
            { name: 'Help', url: '/help', icon: 'fa-solid fa-question', needs_user: false, required_plans: [] },
            { name: 'Send Feedback', url: '/send-feedback', icon: 'fa-solid fa-comment', needs_user: false, required_plans: [] },
        ]
    }
];