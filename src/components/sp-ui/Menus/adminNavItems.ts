import { _NavSection } from "./types";

export const admin_nav_items: _NavSection[] = [
    {
        name: 'Main',
        items: [
            { name: 'Admin', url: '/admin', icon: 'fa-solid fa-toolbox', needs_user: true, required_plans: [] },
            { name: 'Products', url: '/dashboard/products', icon: 'fa-solid fa-shirt', needs_user: true, required_plans: [] },
        ]
    },
];