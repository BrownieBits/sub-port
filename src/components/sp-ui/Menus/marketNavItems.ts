import { _NavSection } from "./types";

export const market_nav_items: _NavSection[] = [
    {
        name: 'Main',
        items: [
            { name: 'Home', url: '/', icon: 'fa-solid fa-house', needs_user: false, required_plans: [] },
            { name: 'Subscriptions', url: '/subscriptions', icon: 'fa-solid fa-heart-circle-plus', needs_user: true, required_plans: [] },
            { name: 'My Likes', url: '/my-likes', icon: 'fa-solid fa-thumbs-up', needs_user: true, required_plans: [] },
            { name: 'My Products', url: '/dashboard/products', icon: 'fa-solid fa-shirt', needs_user: true, required_plans: [] },
        ]
    },
    {
        name: 'Marketplace',
        items: [
            { name: 'Trending', url: '/market/trending', icon: 'fa-solid fa-fire', needs_user: false, required_plans: [] },
            { name: 'New', url: '/market/new', icon: 'fa-solid fa-bolt', needs_user: false, required_plans: [] },
            { name: 'Holiday', url: '/market/holiday', icon: 'fa-solid fa-gift', needs_user: false, required_plans: [] },
            { name: 'Staff Picks', url: '/market/staff-picks', icon: 'fa-solid fa-user-tag', needs_user: false, required_plans: [] },
            { name: 'Pop Culture', url: '/market/pop-culture', icon: 'fa-solid fa-film', needs_user: false, required_plans: [] },
            { name: 'T-Shirts', url: '/market/t-shirts', icon: 'fa-solid fa-shirt', needs_user: false, required_plans: [] },
            { name: 'Outerwear', url: '/market/outerwear', icon: 'fa-solid fa-shirt', needs_user: false, required_plans: [] },
            { name: 'Accessories', url: '/market/accessories', icon: 'fa-solid fa-mug-saucer', needs_user: false, required_plans: [] },
            { name: 'Homegoods', url: '/market/homegoods', icon: 'fa-solid fa-couch', needs_user: false, required_plans: [] },
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