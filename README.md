# NetSight Analyzer 📡

![NetSight Analyzer](https://img.shields.io/badge/Network-Simulator-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC)

**NetSight Analyzer** is an interactive web application that simulates and visualizes the performance of 4G and 5G mobile communication networks. Designed as an educational tool, it demonstrates how various physical parameters affect network quality and speed in real-time.

🔗 **[Live Demo](https://netsight-analyzer.vercel.app/)**

## ✨ Features

- **Real-time Network Simulation**: Adjust parameters and see instant changes in network performance
- **Interactive Visualizations**: Dynamic charts showing signal strength, throughput, and error rates
- **Educational KPI Dashboard**: Key Performance Indicators with detailed metric cards
- **4G/5G Network Comparison**: Compare performance between different network generations
- **PDF Report Generation**: Download comprehensive network analysis reports
- **Physics-based Calculations**: Accurate modeling of digital communication principles
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/netsight-analyzer.git
   cd netsight-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 18** | UI library with modern hooks |
| **TypeScript** | Type-safe JavaScript |
| **ShadCN UI** | Beautiful, accessible components |
| **Tailwind CSS** | Utility-first CSS framework |
| **Recharts** | Interactive data visualization |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **jsPDF + html2canvas** | PDF report generation |

## 📊 How It Works

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Configuration  │───▶│   Simulation     │───▶│  Visualization  │
│     Panel       │    │     Engine       │    │     Charts      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        ▼                       │
         │              ┌──────────────────┐              │
         └─────────────▶│  Network KPIs    │◀─────────────┘
                        │   Dashboard      │
                        └──────────────────┘
```

### Simulation Workflow

1. **Parameter Input**: Users adjust network parameters via interactive controls
2. **Real-time Validation**: Zod schema ensures parameter validity
3. **Physics Simulation**: Core algorithms calculate network performance metrics
4. **Data Visualization**: Charts and KPIs update instantly with new results
5. **Report Generation**: Users can export comprehensive PDF reports

## 🧮 Core Calculations

The simulation engine models key wireless communication principles:

### Signal Propagation
- **Path Loss**: `PL = 20log₁₀(4πdf/c)` (Free Space Path Loss)
- **Signal-to-Noise Ratio**: Critical for determining data rates
- **Interference Modeling**: Co-channel and adjacent channel interference

### Network Performance
- **Throughput Calculation**: Shannon-Hartley theorem application
- **Bit Error Rate (BER)**: Raw and channel-coded error rates
- **Channel Coding**: LDPC and Turbo code error correction simulation
- **Modulation Impact**: QPSK, 16-QAM, 64-QAM, and 256-QAM modeling

### Key Performance Indicators
| KPI | Description | Formula/Model |
|-----|-------------|---------------|
| **Signal Strength (RSSI)** | Received signal power | Path loss + antenna gains |
| **SNR** | Signal-to-noise ratio | Signal power / Noise power |
| **Throughput** | Data transfer rate | Shannon capacity with practical limits |
| **BER** | Bit error probability | Modulation-dependent AWGN curves |
| **Coded BER** | Post-FEC error rate | Channel coding gain applied |

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Main page component
├── components/
│   ├── ui/               # ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── netsight-analyzer.tsx  # Main application component
├── lib/
│   ├── constants.ts      # Application constants
│   ├── types.ts         # TypeScript types and Zod schemas
│   ├── network-calculations.ts  # Core simulation algorithms
│   └── utils.ts         # Utility functions
└── ...
```

## 🎛️ Configuration Parameters

### Network Settings
- **Network Type**: 4G LTE, 5G Sub-6, 5G mmWave
- **Bandwidth**: 5MHz to 100MHz
- **Modulation**: QPSK, 16-QAM, 64-QAM, 256-QAM
- **Channel Coding**: LDPC, Turbo Code, No Coding

### Environmental Factors
- **Distance**: 0.1km to 20km from cell tower
- **Environment**: Urban, Suburban, Rural
- **Frequency Band**: 700MHz to 28GHz
- **Antenna Configuration**: SISO, MIMO 2x2, MIMO 4x4

## 📈 Visualizations

### Interactive Charts
1. **Signal Strength vs Distance**: Shows path loss over distance
2. **Throughput vs SNR**: Demonstrates modulation efficiency
3. **BER Performance**: Compares coded vs uncoded error rates
4. **Network Capacity**: Real-time capacity calculations

### Real-time Metrics
- Live updating KPI cards
- Color-coded performance indicators
- Comparative analysis between network types
- Historical trend visualization

## 🎓 Educational Use Cases

### For Students
- **Wireless Communication Principles**: Understand path loss, SNR, and modulation
- **Network Planning**: Learn how distance and environment affect performance
- **Channel Coding**: Visualize the impact of error correction codes
- **5G vs 4G**: Compare next-generation network capabilities

### For Educators
- **Interactive Learning**: Engage students with hands-on simulations
- **Curriculum Support**: Supplement theoretical concepts with practical examples
- **Assessment Tool**: Generate reports for student evaluation
- **Research Platform**: Experiment with different network scenarios

### For Professionals
- **Network Planning**: Prototype and validate network designs
- **Performance Analysis**: Understand trade-offs in network configuration
- **Training Tool**: Educate teams on wireless fundamentals
- **Presentation Aid**: Generate professional reports and visualizations

## Contributing

Contributions are welcome. Please follow these guidelines:

- Follow TypeScript best practices
- Maintain consistent code formatting (Prettier/ESLint)
- Add tests for new simulation algorithms
- Update documentation for new features
- Ensure mobile responsiveness

## License

This project is licensed under the MIT License.

## Acknowledgments

- Shannon-Hartley Theorem for capacity calculations
- 3GPP Standards for 4G/5G specifications
- Open source libraries and tools
