
import { _SetUserProps, _UserStore } from '@/lib/types';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

const userStore = create<_UserStore>(set => ({
    user_id: '',
    user_email: '',
    user_name: '',
    user_role: '',
    user_plan: '',
    user_country: '',
    user_currency: '',
    user_store: '',
    user_loaded: false,
    product_likes: [],
    store_subscribes: [],
    comment_likes: [],
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
    })),
    setUserLoaded: () => set(() => ({
        user_loaded: true,
    })),
    setProductLikes: (likes: string[]) => set(() => ({
        product_likes: likes,
    })),
    setStoreSubscribes: (subscribes: string[]) => set(() => ({
        store_subscribes: subscribes,
    })),
    setCommentLikes: (likes: string[]) => set(() => ({
        comment_likes: likes,
    }))
}))

export default userStore;

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('User Store', userStore);
}