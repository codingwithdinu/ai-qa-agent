import {
    Navigate
} from "react-router-dom";

import type {
    PropsWithChildren
} from "react";

export function ProtectedRoute({
    children,
}: PropsWithChildren) {

    const token =
        localStorage.getItem(
            "token"
        );

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <>{children}</>;
}