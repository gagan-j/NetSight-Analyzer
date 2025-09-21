import { type AiGoal } from './types';

export const MODULATION_OPTIONS: readonly [string, ...string[]] = ['QPSK', '16-QAM', '64-QAM', '256-QAM'];

export const NETWORK_TYPE_OPTIONS: readonly [string, ...string[]] = ['4G', '5G'];

export const CHANNEL_CODING_OPTIONS: readonly [string, ...string[]] = ['None', 'Hamming', 'LDPC'];

export const SLIDER_DEBOUNCE_TIME = 100;

export const INITIAL_PARAMS = {
    networkType: '5G',
    modulation: '64-QAM',
    channelCoding: 'LDPC',
    bandwidth: 20,
    distance: 500,
    noiseLevel: -95,
} as const;
