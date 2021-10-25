import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string,
    name: string,
    avatar_url: string,
    login: string
}

type AuthContextData = {
    user: User | null,
    signInUrl: string,
    signOut: () => void
}


export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode
}

type AuthResponse = {
    token: string,
    user: {
        id: string,
        name: string,
        avatar_url: string,
        login: string
    }
}

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null);

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=c077937fcb8495461aab`;

    /**
     * Integração com a API em Node
     */
    async function signIn(githubCode: string) {

        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        });

        const { token, user } = response.data;

        localStorage.setItem('@nlw:token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(user);
        // console.log(user);
    }

    /**
     * Verificar se user está logado ou não
     */
    useEffect(() => {
        const token = localStorage.getItem('@nlw:token');

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>('profile').then(response => {
                setUser(response.data);
            });
        }
    }, []);


    /**
     * Funcionalidade do botão de login
     */
    useEffect(() => {
        const url = window.location.href;

        if (url.includes('?code=')) {
            const [urlRoot, githubCode] = url.split('?code=');

            window.history.pushState({}, '', urlRoot);

            signIn(githubCode);
        }
    }, []);

    /**
     * Funcionalidade de logout
     */
    function signOut() {
        setUser(null);
        localStorage.removeItem('@nlw:token');
    }

    return (
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    );
}