import type { ReactNode } from "react";

type WeatherDetailProps = {
    name: string;
    description: string;
    children?: ReactNode;
    icon?: ReactNode;
    value?: string;
    trend?: 'up' | 'down' | 'stable';
    color?: string;
}

export default function WeatherDetail({ name, description, children, icon, value, color = 'var(--primary2)' }: WeatherDetailProps) {
    return (
        <div
            className="rounded-2xl border p-5 w-full min-w-52 transition-all hover:shadow-sm"
            style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
            {icon && (
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${color}18`, color }}
                >
                    {icon}
                </div>
            )}
            {value && (
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--texte-extra-black)' }}>{value}</p>
            )}
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--texte-extra-black)' }}>{name}</p>
            <p className="text-xs mb-3" style={{ color: 'var(--texte-gray)' }}>{description}</p>
            <div style={{ color: 'var(--texte-black)' }}>{children}</div>
        </div>
    )
}
