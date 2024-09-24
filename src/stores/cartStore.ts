
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { _SetUserProps, _UserStore } from './userStore.types';

const cartStore = create<_UserStore>(set => ({
    user_id: '',
    user_email: '',
    user_name: '',
    user_role: '',
    user_plan: '',
    user_country: '',
    user_currency: '',
    user_store: '',
    setUser: (props: _SetUserProps) => set(() => ({
        user_id: props.user_id,
        user_email: props.user_email,
        user_name: props.user_name,
        user_role: props.user_role,
        user_plan: props.user_plan,
        user_country: props.user_country,
        user_currency: props.user_currency,
        user_store: props.user_store,
    })),
    clearUser: () => set(() => ({
        user_id: '',
        user_email: '',
        user_name: '',
        user_role: '',
        user_plan: '',
        user_country: '',
        user_currency: '',
        user_store: '',
        user_store_avatart: '',
        user_store_name: '',
    }))
}))

export default cartStore;

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('Cart Store', cartStore);
}