import {
    useEffect
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

export function OAuthSuccessPage() {

    const navigate =
        useNavigate();

    const [params] =
        useSearchParams();

    useEffect(() => {

        const token =
            params.get("token");

        if (token) {

            localStorage.setItem(
                "token",
                token
            );

            navigate(
                "/app/dashboard"
            );
        }

    }, []);

    return <p>Loading...</p>;
}