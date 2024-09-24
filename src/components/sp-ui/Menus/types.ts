export type _FooterNavItem = {
    name: string;
    url: string;
}

export type _NavItem = {
    name: string;
    url: string;
    icon: string;
    needs_user: boolean;
    required_plans: string[];
}
export type _NavSection = {
    name: string;
    items: _NavItem[]
}
