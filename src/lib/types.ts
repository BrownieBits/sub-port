
type _ProductImage = {
    id: number;
    image: string;
};
type _Option = {
    name: string;
    options: string[];
    id?: string;
};
type _GridProduct = {
    name: string;
    images: string[];
    product_type: string;
    price: number;
    compare_at: number;
    currency: string;
    like_count: number;
    store_id: string;
    created_at: Date;
    id: string;
    revenue?: number;
    view_count?: number;
    status?: string;
};
type _Item = {
    cart_item_id: string;
    id: string;
    options: string[];
    order_options?: string[];
    digital_download?: string;
    quantity: number;
    store_id: string;
    compare_at: number;
    price: number;
    currency: string;
    images: string[];
    inventory: number;
    track_inventory: boolean;
    product_type: string;
    service_percent: number;
    name: string;
    vendor: string;
    vendor_id: string;
    ship_from: string | null;
    weight?: {
        units: string,
        value: number
    },
    dimensions?: {
        height: number,
        length: number,
        units: string,
        width: number
    }
};
type _Promotion = {
    promo_id: string;
    amount: number;
    minimum_order_value: number;
    expiration_date: Date | null;
    name: string;
    status: string;
    type: string;
};
type _RemovedProduct = {
    image_url: string;
    name: string;
    reason: string;
};
type _Address = {
    id?: string;
    address_line1: string;
    address_line2: string;
    address_line3: string | null;
    address_residential_indicator: string;
    city_locality: string;
    company_name: string | null;
    country_code: string;
    email: string | null;
    name: string;
    phone: string | null;
    postal_code: string;
    state_province: string;
    owner_id?: string;
    created_at?: Date;
};
type _Shipment = {
    items: _Item[];
    store_name?: string;
    store_avatar?: string;
    rate: _Rate | null;
    error: string | null;
    name: string | null;
    ship_from: _Address | string | null;
    ship_to: _Address | string | null;
    store_id: string;
    tracking_number: string | null;
    status: string;
};
type _ShippingCarrier = {
    name: string;
    carrier_id: string;
};
type _Rate = {
    carrier_id: string;
    carrier_name: string;
    delivery_days: number;
    estimated_delivery_date: Date | null;
    rate: number;
    service_code: string;
    service_type: string;
    package_type: string | null;
};
type _SetUserProps = {
    user_id: string
    user_email: string;
    user_name: string;
    user_role: string;
    user_plan: string;
    user_country: string;
    user_currency: string;
    user_store: string;
    tos_agreed: string;
}
type _UserStore = {
    user_id: string;
    user_email: string;
    user_name: string;
    user_role: string;
    user_plan: string;
    user_country: string;
    user_currency: string;
    user_store: string;
    user_loaded: boolean;
    product_likes: string[];
    store_subscribes: string[];
    comment_likes: string[];
    tos_agreed: string;
    setUser: (props: _SetUserProps) => void;
    clearUser: () => void;
    setUserLoaded: (loaded: boolean) => void;
    setProductLikes: (likes: string[]) => void;
    setStoreSubscribes: (subscribes: string[]) => void;
    setCommentLikes: (likes: string[]) => void;
}
type _SettingsStore = {
    language: string;
    currency: string;
    setLanguage: (language: string) => void;
    setCurrency: (currency: string) => void;
}
type _CartItem = {
    options: string[];
    quantity: number;
    store_id: string;
    cart_item_id: string;
    id: string;
}
type _RemovedItem = {
    image_url: string;
    name: string;
    reason: string;
}
type _Items = Map<string, _Item[]>;
type _Shipments = Map<string, _Shipment>;
type _Promotions = Map<string, _Promotion>;
type _Cart = {
    cart_id: string;
    address: _Address | null;
    billing_address: _Address | null;
    email: string;
    item_count: number;
    items: _Items;
    cart_items: _CartItem[];
    owner_email: string | null;
    owner_id: string | null;
    payment_intent: string | null;
    removed_items: _RemovedItem[];
    promotions: _Promotions;
    shipments: _Shipments;
    cart_loaded: boolean;
    shipments_ready: boolean;
    order_complete: boolean;
}
type _SetCartProps = {
    cart_id: string;
    address: _Address | null;
    billing_address: _Address | null;
    email: string;
    owner_email: string | null;
    owner_id: string | null;
    payment_intent: string | null;
    shipments: _Shipments | null;
    shipments_ready: boolean;
}
type _SetItemsProps = {
    cart_items: _CartItem[];
    item_count: number;
}
type _CartActions = {
    setCart: (props: _SetCartProps) => void;
    setCartItems: (props: _SetItemsProps) => void;
    setItems: (props: _Items) => void;
    setCartID: (props: string) => void;
    setCartLoaded: (props: boolean) => void;
    clearCart: () => void;
    setRemovedItems: (props: _RemovedItem[]) => void;
    setPromotions: (props: _Promotions) => void;
    updateShipments: (shipments: _Shipments) => void;
    setShipmentsReady: (ready: boolean) => void;
    setOrderComplete: (complete: boolean) => void;
}
type _FooterNavItem = {
    name: string;
    url: string;
}
type _SubNavItem = {
    name: string;
    url: string;
    needs_user: boolean;
    required_plans: string[];
}
type _NavItem = {
    name: string;
    url: string;
    icon: string;
    needs_user: boolean;
    required_plans: string[];
    sub_menu: _SubNavItem[];
}
type _NavSection = {
    name: string;
    items: _NavItem[]
}

export type { _Address, _Cart, _CartActions, _CartItem, _FooterNavItem, _GridProduct, _Item, _Items, _NavItem, _NavSection, _Option, _ProductImage, _Promotion, _Promotions, _Rate, _RemovedItem, _RemovedProduct, _SetCartProps, _SetItemsProps, _SettingsStore, _SetUserProps, _Shipment, _Shipments, _ShippingCarrier, _SubNavItem, _UserStore };

