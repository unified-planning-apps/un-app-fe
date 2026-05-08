import { Link } from "@tanstack/react-router";

type NavLinkComponentProps = {
    icon?: React.ReactElement;
    displayName: string;
    to: string;
    className?: string;
    activeClassName?: string;
}

export default function NavLinkComponent({ icon, displayName, to, className, activeClassName }: NavLinkComponentProps) {
    return (
        <Link
            to={to}
            className={`font-medium  flex items-center ${className || ''}`}
            activeProps={{
                className: activeClassName || 'font-bold bg-blue-100'
            }}
        >
            {icon && <span className="mr-2">{icon}</span>} {displayName}
        </Link>
    )
}