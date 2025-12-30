import allegroLogo from '../assets/images/allegro.png';
import ebayLogo from '../assets/images/ebay.png';
import prestaLogo from '../assets/images/presta.png';
import shoperLogo from '../assets/images/shoper.png';
import shopifyLogo from '../assets/images/shopify.png';
import { cn } from '../utils/utils';

const CHANNEL_MAP: Record<
    string,
    {
        label: string;
        icon: string;
    }
> = {
    'allegro-pl': {
        label: 'Allegro',
        icon: allegroLogo
    },
    shoper_rest: {
        label: 'Shoper',
        icon: shoperLogo
    },
    shopify_v2: {
        label: 'Shopify',
        icon: shopifyLogo
    },
    presta: {
        label: 'PrestaShop',
        icon: prestaLogo
    },
    'ebay de': {
        label: 'eBay',
        icon: ebayLogo
    }
};

const normalizeChannelKey = (channel: string) => channel.replace(/^\[|\]$/g, '').trim().toLowerCase();

export const getChannelInfo = (channel: string) => {
    if (channel === 'unknown') {
        return null;
    }

    const normalized = normalizeChannelKey(channel);
    return CHANNEL_MAP[normalized] ?? null;
};

type ChannelIconProps = {
    channel: string;
    size?: number;
    className?: string;
};

export function ChannelIcon({ channel, size = 28, className }: ChannelIconProps) {
    if (channel === 'unknown') {
        return <span>(no channel)</span>;
    }

    const info = getChannelInfo(channel);

    if (!info) {
        return <span>{channel}</span>;
    }

    return (
        <span className="inline-flex items-center gap-2">
            <span className={cn('inline-flex items-center justify-center rounded-md', className)} title={info.label}>
                <span
                    aria-hidden
                    style={{
                        width: size,
                        height: size
                    }}
                >
                    <img src={info.icon} alt="" className="h-full w-full object-contain" />
                </span>
                <span className="sr-only">{info.label}</span>
            </span>
            <span>{info.label}</span>
        </span>
    );
}
