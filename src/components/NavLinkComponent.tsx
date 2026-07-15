import { Link } from "@tanstack/react-router";

type NavLinkComponentProps = {
    icon?: React.ReactElement;
    displayName: string;
    to: string;
    className?: string;
    activeClassName?: string;
    style?: React.CSSProperties;
    exact?: boolean;
}

export default function NavLinkComponent({
    icon,
    displayName,
    to,
    className,
    activeClassName,
    style,
    exact = false,
}: NavLinkComponentProps) {
    return (
        <Link
            to={to}
            className={`font-medium flex items-center gap-1.5 transition-colors ${className || ''}`}
            style={style}
            activeOptions={{ exact }}
            activeProps={{
                className: activeClassName || 'font-bold',
                style: { color: 'var(--primary)', borderColor: 'var(--primary)' }
            }}
            inactiveProps={{
                style: { color: 'var(--texte-gray)' }
            }}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {displayName}
        </Link>
    )
}
