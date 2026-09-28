import React from 'react';

function LockIcon() {
    return (
        <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="#D4A760"
                strokeWidth="3"
            />
            <g>
                <path
                    d="M 40 60 A 20 20 0 0 1 80 60"
                    stroke="#5BA989"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                />
                <rect
                    x="35"
                    y="60"
                    width="50"
                    height="40"
                    rx="4"
                    fill="#5BA989"
                />
                <circle cx="60" cy="80" r="6" fill="#373108" />
            </g>
        </svg>
    );
}

export default LockIcon;