// src/components/Card.tsx
import React from "react";

interface CardProps {
    title?: string;
    children: React.ReactNode;
    /** an icon element to display above the title */
    icon?: React.ReactNode;
    /** extra CSS class, e.g. "card-tasks" */
    className?: string;
}

const Card: React.FC<CardProps> = ({
                                       title,
                                       icon,
                                       children,
                                       className = "",
                                   }) => (
    <div className={`card ${className}`} style={{ padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 4px 6px var(--color-card-shadow)", transition: "transform 0.2s" }}>
        {icon && <div className="card-icon">{icon}</div>}
        {title && <h3>{title}</h3>}
        <div>{children}</div>
    </div>
);

export default Card;
