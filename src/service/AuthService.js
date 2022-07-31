export const reauthenticate = async () => {
    return (await fetch(`http://localhost:3000/auth/refresh`, {method: 'GET', credentials: "include"})).json()
}
