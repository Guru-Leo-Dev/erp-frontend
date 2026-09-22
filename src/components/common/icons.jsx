// A small hand-picked set of line icons so the app needs no icon-library
// dependency. Each icon is a plain functional component; `props` passes
// through so size/className can be overridden where needed.

const base = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconDashboard = (props) => (
  <svg {...base} {...props}>
    <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.2" />
    <rect x="11" y="2.5" width="6.5" height="4" rx="1.2" />
    <rect x="11" y="8.5" width="6.5" height="9" rx="1.2" />
    <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.2" />
  </svg>
);

export const IconCustomers = (props) => (
  <svg {...base} {...props}>
    <circle cx="7.5" cy="6.2" r="3" />
    <path d="M2 17c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <circle cx="14.2" cy="7.5" r="2.3" />
    <path d="M13 12.2c2.6.2 4.8 2 4.8 4.8" />
  </svg>
);

export const IconVendors = (props) => (
  <svg {...base} {...props}>
    <path d="M3 8.5 10 3l7 5.5" />
    <path d="M4.5 8v8.5h11V8" />
    <path d="M8 16.5V12h4v4.5" />
  </svg>
);

export const IconItems = (props) => (
  <svg {...base} {...props}>
    <path d="M10 2.5 17 6v8L10 17.5 3 14V6l7-3.5Z" />
    <path d="M3 6l7 3.5L17 6" />
    <path d="M10 9.5v8" />
  </svg>
);

export const IconStores = (props) => (
  <svg {...base} {...props}>
    <path d="M2.5 7 3.6 3h12.8l1.1 4" />
    <path d="M2.8 7c.3 1.6 3 1.6 3.3 0 .3 1.6 3 1.6 3.3 0 .3 1.6 3 1.6 3.3 0 .3 1.6 3 1.6 3.3 0" />
    <path d="M4 7.2V17h12V7.2" />
    <path d="M8 17v-4.5h4V17" />
  </svg>
);

export const IconSales = (props) => (
  <svg {...base} {...props}>
    <circle cx="7" cy="16" r="1.2" />
    <circle cx="14.5" cy="16" r="1.2" />
    <path d="M2 3h2.2l1.6 9.6a1.6 1.6 0 0 0 1.6 1.4h7.4a1.6 1.6 0 0 0 1.6-1.3l1.1-6.2H5.1" />
  </svg>
);

export const IconPurchase = (props) => (
  <svg {...base} {...props}>
    <path d="M5 6.5V5a3 3 0 0 1 6 0v1.5" />
    <path d="M3.6 6.5h9.8l-.7 9a1.4 1.4 0 0 1-1.4 1.3H5.7a1.4 1.4 0 0 1-1.4-1.3l-.7-9Z" />
    <path d="M8 9.2v3" />
  </svg>
);

export const IconShipping = (props) => (
  <svg {...base} {...props}>
    <rect x="2" y="6" width="9" height="7.5" rx="1" />
    <path d="M11 8.5h3.2L17 11v2.5h-6z" />
    <circle cx="6" cy="15.7" r="1.3" />
    <circle cx="14.2" cy="15.7" r="1.3" />
  </svg>
);

export const IconInvoice = (props) => (
  <svg {...base} {...props}>
    <path d="M5 2.5h7.5L16 6v11a.6.6 0 0 1-.6.6H5a.6.6 0 0 1-.6-.6V3.1c0-.33.27-.6.6-.6Z" />
    <path d="M7 8h6M7 11h6M7 14h3.5" />
  </svg>
);

export const IconMenu = (props) => (
  <svg {...base} {...props}>
    <path d="M3 5.5h14M3 10h14M3 14.5h14" />
  </svg>
);

export const IconClose = (props) => (
  <svg {...base} {...props}>
    <path d="M5 5l10 10M15 5 5 15" />
  </svg>
);

export const IconSun = (props) => (
  <svg {...base} {...props}>
    <circle cx="10" cy="10" r="3.4" />
    <path d="M10 2.5v2M10 15.5v2M3.5 10h-2M18.5 10h-2M5.3 5.3 3.9 3.9M16.1 16.1l-1.4-1.4M5.3 14.7l-1.4 1.4M16.1 3.9l-1.4 1.4" />
  </svg>
);

export const IconMoon = (props) => (
  <svg {...base} {...props}>
    <path d="M16.5 12.3A7 7 0 0 1 7.7 3.5a7 7 0 1 0 8.8 8.8Z" />
  </svg>
);

export const IconSearch = (props) => (
  <svg {...base} {...props}>
    <circle cx="8.5" cy="8.5" r="5.5" />
    <path d="m17 17-4-4" />
  </svg>
);

export const IconPlus = (props) => (
  <svg {...base} {...props}>
    <path d="M10 3.5v13M3.5 10h13" />
  </svg>
);

export const IconEdit = (props) => (
  <svg {...base} {...props}>
    <path d="M12.6 3.4a1.8 1.8 0 0 1 2.5 2.5L6.4 14.6l-3.2.8.8-3.2L12.6 3.4Z" />
  </svg>
);

export const IconTrash = (props) => (
  <svg {...base} {...props}>
    <path d="M3.5 5.5h13M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M6 5.5l.6 10a1.4 1.4 0 0 0 1.4 1.3h4a1.4 1.4 0 0 0 1.4-1.3l.6-10" />
  </svg>
);

export const IconAlert = (props) => (
  <svg {...base} {...props}>
    <path d="M10 2.5 18 16.5H2L10 2.5Z" />
    <path d="M10 8v3.5" />
    <circle cx="10" cy="14" r="0.15" fill="currentColor" stroke="none" />
  </svg>
);

export const IconChevronDown = (props) => (
  <svg {...base} {...props}>
    <path d="m4.5 7 5.5 6 5.5-6" />
  </svg>
);

export const IconPackage = IconItems;
export const IconTruck = IconShipping;
