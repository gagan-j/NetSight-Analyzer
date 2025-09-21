import type { SimulationParameters, SimulationMetrics } from './types';

// --- Constants for Simulation Models ---
const TX_POWER_DBM = 46; // Typical transmission power for a macro cell in dBm
const PATH_LOSS_CONSTANT_4G = 32.4;
const PATH_LOSS_CONSTANT_5G = 32.4; 
const FREQUENCY_4G_MHZ = 2600; 
const FREQUENCY_5G_MHZ = 3500; 

// Simplified mapping of Modulation to its relative efficiency/robustness factor
const MODULATION_FACTORS: Record<string, { berFactor: number; efficiency: number }> = {
  'QPSK': { berFactor: 0.5, efficiency: 2 },
  '16-QAM': { berFactor: 2.5, efficiency: 4 },
  '64-QAM': { berFactor: 10.5, efficiency: 6 },
  '256-QAM': { berFactor: 40.5, efficiency: 8 },
};

// Simplified "coding gain" in dB for different channel coding schemes
const CODING_GAIN_DB: Record<string, number> = {
  'None': 0,
  'Hamming': 2.5, // Hamming codes offer modest gain
  'LDPC': 6.0,    // Modern LDPC codes offer significant gain
};

/**
 * Calculates free-space path loss.
 * A simplified model for how signal strength decreases over distance.
 */
function calculatePathLoss(distance_m: number, frequency_MHz: number, constant: number): number {
  if (distance_m <= 0) return 0;
  return 20 * Math.log10(distance_m) + 20 * Math.log10(frequency_MHz) + constant;
}

/**
 * Calculates Signal-to-Noise Ratio (SNR).
 */
function calculateSnr(signalStrength_dBm: number, noiseLevel_dBm: number): number {
  return signalStrength_dBm - noiseLevel_dBm;
}

/**
 * Calculates an estimated throughput using a capped Shannon-Hartley theorem approach.
 */
function calculateThroughput(snr_dB: number, bandwidth_MHz: number, modulation: string): number {
  if (snr_dB < -10) return 0;
  const snrLinear = 10 ** (snr_dB / 10);
  const spectralEfficiency = MODULATION_FACTORS[modulation]?.efficiency || 2;
  // Shannon-Hartley provides theoretical max
  const theoreticalSpectralEfficiency = Math.log2(1 + snrLinear);
  // Real-world throughput is capped by the chosen modulation scheme
  const effectiveSpectralEfficiency = Math.min(spectralEfficiency, theoreticalSpectralEfficiency);
  return bandwidth_MHz * effectiveSpectralEfficiency;
}

/**
 * Calculates a simplified Bit Error Rate (BER).
 * This is a highly simplified model for illustrative purposes.
 */
function calculateBer(snr_dB: number, modulation: string): number {
    const snrLinear = 10 ** (snr_dB / 10);
    const { berFactor } = MODULATION_FACTORS[modulation] || MODULATION_FACTORS['QPSK'];
    
    // Simplified BER approximation using an exponential decay function related to SNR
    const ber = 0.5 * Math.exp(-0.5 * snrLinear / berFactor);
    
    // Clamp BER to a reasonable range [~0, 0.5]
    return Math.max(1e-9, Math.min(ber, 0.5));
}


/**
 * Calculates the Coded BER by applying a simplified coding gain.
 */
function calculateCodedBer(snr_dB: number, modulation: string, channelCoding: string): number {
  const codingGain = CODING_GAIN_DB[channelCoding] || 0;
  // Apply coding gain to the SNR to get an "effective SNR" for the coded system
  const effectiveSnr = snr_dB + codingGain;
  // Calculate BER with the improved SNR
  return calculateBer(effectiveSnr, modulation);
}

/**
 * Main function to run all calculations based on input parameters.
 */
export function runSimulation(params: SimulationParameters): SimulationMetrics {
  const { networkType, distance, noiseLevel, modulation, bandwidth, channelCoding } = params;

  const frequency = networkType === '5G' ? FREQUENCY_5G_MHZ : FREQUENCY_4G_MHZ;
  const pathLossConstant = networkType === '5G' ? PATH_LOSS_CONSTANT_5G : PATH_LOSS_CONSTANT_4G;
  
  const pathLoss = calculatePathLoss(distance, frequency, pathLossConstant);
  const signalStrength = TX_POWER_DBM - pathLoss;
  const snr = calculateSnr(signalStrength, noiseLevel);
  const throughput = calculateThroughput(snr, bandwidth, modulation);
  const ber = calculateBer(snr, modulation);
  const codedBer = calculateCodedBer(snr, modulation, channelCoding);

  return { signalStrength, snr, throughput, ber, codedBer };
}

/**
 * Generates data for charts by varying one parameter while keeping others fixed.
 */
export function generateChartData(
  baseParams: SimulationParameters
): {
  signalVsDistance: { x: number; y: number }[];
  berVsSnr: { x: number; y: number }[];
  throughputVsBandwidth: { x: number; y: number }[];
} {
  const signalVsDistance: { x: number; y: number }[] = [];
  for (let d = 10; d <= 5000; d += 100) {
    const metrics = runSimulation({ ...baseParams, distance: d });
    signalVsDistance.push({ x: d, y: parseFloat(metrics.signalStrength.toFixed(2)) });
  }

  const berVsSnr: { x: number; y: number }[] = [];
  for (let s = -10; s <= 40; s += 1) {
      const ber = calculateBer(s, baseParams.modulation);
      berVsSnr.push({ x: s, y: ber });
  }

  const throughputVsBandwidth: { x: number; y: number }[] = [];
  for (let b = 1; b <= 100; b += 5) {
    const metrics = runSimulation({ ...baseParams, bandwidth: b });
    throughputVsBandwidth.push({ x: b, y: parseFloat(metrics.throughput.toFixed(2)) });
  }

  return { signalVsDistance, berVsSnr, throughputVsBandwidth };
}
