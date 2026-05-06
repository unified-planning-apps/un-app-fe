import { Link } from "@tanstack/react-router";

type LinkComponentProps = {
    displayName: string;
    to: string;
}

export default function LinkComponent({ displayName, to }: LinkComponentProps) {
    return (
        <Link
            to={to}
            className="block p-2"
            activeProps={{
                className: 'font-bold bg-blue-100'
            }}
        >
            {displayName}
        </Link>
    )
}