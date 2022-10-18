import React from 'react'

const Scanner: React.FunctionComponent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 60 114 114">
    <defs>
      <linearGradient id="a" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" stopColor="#4D91C7" stopOpacity="0" />
        <stop offset="100%" stopColor="#5678FB" stopOpacity=".197" />
      </linearGradient>
      <linearGradient id="b" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#4D91C7" stopOpacity="0" />
        <stop offset="100%" stopColor="#5678FB" stopOpacity=".197" />
      </linearGradient>
      <style>
        {`@keyframes MoveUpDown {
            0% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-126px);
            }
            50% {
                transform: translateY(-126px);
            }
            90% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(0);
            }
        }
        @keyframes MoveUp {
            0% {
                transform: translateY(0);
            }
            30% {
                opacity: 1;
            }
            40% {
                transform: translateY(-126px);
            }
            50% {
                transform: translateY(-126px);
                opacity: 0;
            }
            90% {
                transform: translateY(0);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @keyframes MoveDown {
            0% {
                transform: translateY(0);
            }
            30% {
                opacity: 1;
            }
            40% {
                transform: translateY(126px);
            }
            50% {
                transform: translateY(126px);
                opacity: 0;
            }
            90% {
                transform: translateY(0);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }`}
      </style>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#B1B1B1"
        fillRule="nonzero"
        d="M84.375 64.5a2.25 2.25 0 1 1 0-4.5h22.875a6.75 6.75 0 0 1 6.75 6.75v22.875a2.25 2.25 0 1 1-4.5 0V66.75a2.25 2.25 0 0 0-2.25-2.25H84.375zm25.125 79.875a2.25 2.25 0 1 1 4.5 0v22.875a6.75 6.75 0 0 1-6.75 6.75H84.375a2.25 2.25 0 1 1 0-4.5h22.875a2.25 2.25 0 0 0 2.25-2.25v-22.875zM29.625 169.5a2.25 2.25 0 1 1 0 4.5H6.75A6.75 6.75 0 0 1 0 167.25v-22.875a2.25 2.25 0 1 1 4.5 0v22.875a2.25 2.25 0 0 0 2.25 2.25h22.875zM4.5 89.625a2.25 2.25 0 1 1-4.5 0V66.75A6.75 6.75 0 0 1 6.75 60h22.875a2.25 2.25 0 1 1 0 4.5H6.75a2.25 2.25 0 0 0-2.25 2.25v22.875z"
      />
      <g transform="translate(18 93)">
        <rect width="79" height="48" fill="#FFF" rx="4" />
        <path
          stroke="#979797"
          strokeLinecap="round"
          strokeWidth="1.11"
          d="M11.009 35.237c20.884-52.83-.6-2.278 4.061 1.048 9.57 6.828 15.16-45.617 8.489-.884M31.576 28.326c-7.561 3.447-7.87 15.845 1.445.133.482-.812-1.262 2.486-.38 2.815M32.894 29.66c0 8.706-3.067-5.14 12.55-5.601"
        />
        <path
          stroke="#979797"
          strokeLinecap="round"
          strokeWidth="1.11"
          d="M41.313 23.315c-1.467 28.234-3.152 3.299 22.02-8.113 11.715-5.311-8.508 18.36-10.595 16.113-.744-.802-.958-2.057-.935-3.153.07-3.331.807-6.614 1.211-9.921"
        />
      </g>
      <path style={{ animation: 'MoveUp 4s ease-in-out infinite' }} fill="url(#a)" d="M0 180h114v54H0z" />
      <path
        style={{ animation: 'MoveUpDown 4s ease-in-out infinite' }}
        fill="#5678FB"
        d="M103.937 182.05H10.063a5.251 5.251 0 1 1 0-4.2h93.874a5.251 5.251 0 1 1 0 4.2z"
      />
      <path
        style={{ animation: 'MoveDown 4s ease-in-out infinite', animationDelay: '2s' }}
        fill="url(#b)"
        d="M0 0h114v54H0z"
      />
    </g>
  </svg>
)

export default Scanner
