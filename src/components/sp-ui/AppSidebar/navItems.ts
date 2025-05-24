import { _FooterNavItem, _NavSection } from "@/lib/types";

export const marketNavSections: _NavSection[] = [
    {
        name: 'Main',
        items: [
            { name: 'Home', url: '/', icon: 'fa-solid fa-house', needs_user: false, required_plans: [], sub_menu: [] },
            { name: 'Subscriptions', url: '/subscriptions', icon: 'fa-solid fa-heart-circle-plus', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'My Likes', url: '/my-likes', icon: 'fa-solid fa-thumbs-up', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'My Products', url: '/dashboard/products', icon: 'fa-solid fa-shirt', needs_user: true, required_plans: [], sub_menu: [] },
        ]
    },
    {
        name: 'Marketplace',
        items: []
    },
    {
        name: 'Help',
        items: [
            { name: 'Settings', url: '/dashboard/settings', icon: 'fa-solid fa-gear', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Help', url: '/help', icon: 'fa-solid fa-question', needs_user: false, required_plans: [], sub_menu: [] },
            { name: 'Send Feedback', url: '/send-feedback', icon: 'fa-solid fa-comment', needs_user: false, required_plans: [], sub_menu: [] },
        ]
    }
];
export const dashboardNavSections: _NavSection[] = [
    {
        name: 'Main',
        items: [
            { name: 'Dashboard', url: '/dashboard', icon: 'fa-solid fa-table-columns', needs_user: true, required_plans: [], sub_menu: [] },
            {
                name: 'Products', url: '/dashboard/products', icon: 'fa-solid fa-shirt', needs_user: true, required_plans: [], sub_menu: [
                    { name: 'Products', url: '/dashboard/products', needs_user: true, required_plans: [] },
                    { name: 'Collections', url: '/dashboard/products/collections', needs_user: true, required_plans: [] },
                ]
            },
            { name: 'Analytics', url: '/dashboard/analytics', icon: 'fa-solid fa-chart-line', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Payouts', url: '/dashboard/payouts', icon: 'fa-solid fa-dollar-sign', needs_user: true, required_plans: [], sub_menu: [] },
            {
                name: 'Orders', url: '/dashboard/orders', icon: 'fa-solid fa-cart-shopping', needs_user: true, required_plans: [], sub_menu: [
                    { name: 'Store Orders', url: '/dashboard/orders', needs_user: true, required_plans: [] },
                    { name: 'My Orders', url: '/dashboard/orders/my-orders', needs_user: true, required_plans: [] },
                ]
            },
            { name: 'Promotions', url: '/dashboard/promotions', icon: 'fa-solid fa-tags', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Integrations', url: '/dashboard/integrations', icon: 'fa-solid fa-toolbox', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Preferences', url: '/dashboard/preferences', icon: 'fa-solid fa-store', needs_user: true, required_plans: [], sub_menu: [] },
        ]
    },
    {
        name: 'Help',
        items: [
            { name: 'Settings', url: '/dashboard/settings', icon: 'fa-solid fa-gear', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Help Center', url: '/help', icon: 'fa-solid fa-question', needs_user: false, required_plans: [], sub_menu: [] },
            { name: 'Send Feedback', url: '/send-feedback', icon: 'fa-solid fa-comment', needs_user: false, required_plans: [], sub_menu: [] },
        ]
    }
];
export const adminNavSections: _NavSection[] = [
    {
        name: 'Main',
        items: [
            { name: 'Admin', url: '/admin', icon: 'fa-solid fa-toolbox', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Blog', url: '/admin/blog', icon: 'fa-solid fa-square-rss', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Whats New', url: '/admin/whats-new', icon: 'fa-solid fa-square-rss', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Help Center', url: '/admin/help=center', icon: 'fa-solid fa-square-rss', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Market Categories', url: '/admin/market-categories', icon: 'fa-solid fa-square-rss', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Users', url: '/admin/users', icon: 'fa-solid fa-square-rss', needs_user: true, required_plans: [], sub_menu: [] },
            { name: 'Analytics', url: '/admin/analytics', icon: 'fa-solid fa-chart-line', needs_user: true, required_plans: [], sub_menu: [] },
        ]
    },
];
export const footerNavItems: _FooterNavItem[] = [
    { name: 'About', url: '/about' },
    // { name: 'Press', url: '/press' },
    { name: 'Blog', url: '/blog' },
    { name: 'Contact', url: '/send-feedback' },
    { name: 'Terms of Service', url: '/terms-of-service' },
    { name: 'Privacy Policy', url: '/privacy-policy' },
    { name: 'Refund Policy', url: '/refund-policy' },
];