export type _SetUserProps = {
    user_id: string
    user_email: string;
    user_name: string;
    user_role: string;
    user_plan: string;
    user_country: string;
    user_currency: string;
    user_store: string;
}
export type _UserStore = {
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
    setUser: (props: _SetUserProps) => void;
    clearUser: () => void;
    setUserLoaded: (loaded: boolean) => void;
    setProductLikes: (likes: string[]) => void;
    setStoreSubscribes: (subscribes: string[]) => void;
    setCommentLikes: (likes: string[]) => void;
}