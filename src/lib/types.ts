import { z } from 'zod';

export const simulationParametersSchema = z.object({
  networkType: z.enum(['4G', '5G']),
  modulation: z.enum(['QPSK', '16-QAM', '64-QAM', '256-QAM']),
  bandwidth: z.number().min(1).max(100),
  distance: z.number().min(10).max(5000),
  noiseLevel: z.number().min(-120).max(-30),
});

export type SimulationParameters = z.infer<typeof simulationParametersSchema>;

export type SimulationMetrics = {
  signalStrength: number;
  snr: number;
  throughput: number;
  ber: number;
};

export type ChartDataSet = {
  signalVsDistance: { x: number; y: number }[];
  berVsSnr: { x: number; y: number }[];
  throughputVsBandwidth: { x: number; y: number }[];
};

export type AiGoal = 'maximize_throughput' | 'minimize_ber' | 'balanced';
