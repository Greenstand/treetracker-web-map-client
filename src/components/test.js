import { useAuth } from "react-oidc-context" 
// import { UserManager } from "oidc-client-ts";
import { Button } from "@mui/material";
import log from "loglevel"

export default function Test(){

    const auth = useAuth();
    // const mng = new UserManager({ popup_redirect_uri: "http://localhost:3000"});
    log.warn("AUTH", auth)
    // log.warn("MGN: ", mng)
    log.warn("USER", auth?.user)

    
    switch (auth.activeNavigator) {
        case "signinSilent":
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            return <div>Signing you out...</div>;
    }


    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        return (
        <>
            Hello {auth.user?.profile.preferred_username}
            <Button onClick={() => void auth.removeUser()}>Log out</Button>
        </>
        );
    }

    return( 
        <> 
        <Button onClick={() => void auth.signinRedirect()}>Log in</Button> 
        <Button 
            onClick={() => void auth.signinRedirect()}>Sign Up</Button> 
        </>
        
        )
}