export type _SetCartProps = {
    user_id: string
    user_email: string;
    user_name: string;
    user_role: string;
    user_plan: string;
    user_country: string;
    user_currency: string;
    user_store: string;
}
export type _CartStore = {
    user_id: string;
    user_email: string;
    user_name: string;
    user_role: string;
    user_plan: string;
    user_country: string;
    user_currency: string;
    user_store: string;
    setUser: (props: _SetCartProps) => void;
    clearUser: () => void;
}