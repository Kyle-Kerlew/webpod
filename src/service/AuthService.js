export const reauthenticate = async () => {
    return (await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {method: 'GET', credentials: "include"})).json();
}
