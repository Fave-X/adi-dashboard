# ADI Chain Analytics Live Dashboard

A professional, Bloomberg Terminal-inspired **live analytics dashboard** for ADI Chain, built with React, Vite, and Tailwind CSS.

**Live Demo:** [https://adi-dashboard-sandy.vercel.app](https://adi-dashboard-sandy.vercel.app)

## Features

- **Real-time Data**: Auto-refreshes every 30 seconds from multiple sources
- **Professional UI**: Dark, institutional-grade design optimized for financial and on-chain data
- **Four Comprehensive Tabs**:
  - **Overview**: Key metrics, interactive price charts, transaction data, and performance table
  - **By Metric**: Detailed analysis of 15+ network metrics with sparklines and trend signals
  - **All Data**: Fully sortable table with the complete dataset
  - **Insights**: Network analysis, technical specifications, and ecosystem partner information

## What it Tracks

- ADI token price, market cap, and 24h volume (via CoinGecko)
- Transaction counts and network activity
- Active & cumulative unique addresses
- Real-time block, gas, and custom on-chain metrics

## Data Sources

- **CoinGecko** — Price, market cap, volume, and supply data
- **ADI Explorer (Blockscout)** — Transaction and address statistics
- **ADI RPC** — Real-time block and gas data
- **Calculated Metrics** — Velocity ratios, momentum indicators, growth rates, and trend signals

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Chart.js with custom styling
- **Icons**: Lucide React
- **Fonts**: DM Mono, Syne, Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Fave-X/adi-chain-live-dashboard.git

# Navigate into the project directory
cd adi-chain-live-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Vercel will automatically detect the Vite framework
3. Deploy with default settings

The `vercel.json` file is pre-configured for optimal deployment.

### Other Platforms

The build output in the `dist/` folder can be deployed to any static hosting service.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Sticky header with live stats
│   ├── OverviewTab.jsx # Overview dashboard
│   ├── ByMetricTab.jsx # Individual metrics
│   ├── AllDataTab.jsx  # Sortable data table
│   ├── InsightsTab.jsx # Analysis and partnerships
│   ├── PriceChart.jsx  # Price history chart
│   ├── TransactionsChart.jsx # Transaction volume
│   ├── AddressesChart.jsx   # Address growth
│   └── MetricsTable.jsx # Performance metrics table
├── services/           # API services
│   └── api.js         # Data fetching and caching
├── App.jsx            # Main application
└── index.css          # Global styles and Tailwind
```

## Configuration

### API Endpoints

The dashboard connects to:

- `https://api.coingecko.com/api/v3/coins/adi-chain`
- `https://explorer.adifoundation.ai/api/v2/stats`
- `https://rpc.adifoundation.ai`

### Customization

- **Colors**: Modify `tailwind.config.js` to update the color scheme
- **Metrics**: Add new metrics in `api.js` and display components
- **Refresh Rate**: Change the interval in `App.jsx` (default: 30 seconds)

## Features Detail

### Header Bar
- Live market cap and volume data
- Top gaining/declining metrics (30d)
- Pulsing live indicator
- UTC clock updating every second

### Overview Tab
- 6 key stat cards with trend indicators
- Interactive price history chart (24H/7D/30D)
- Daily transaction volume chart
- Cumulative unique addresses growth
- Comprehensive performance metrics table

### By Metric Tab
- 15+ individual metric cards
- Mini sparklines for each metric
- Signal badges (GROWING/STABLE/COOLING/DECLINING)
- Data source labels

### All Data Tab
- Fully sortable data table
- Click headers to sort any column
- Complete dataset with trend indicators
- Source badges for transparency

## Performance

- **Caching**: 30-second API response caching
- **Optimized Rendering**: React 19 with minimal re-renders
- **Responsive**: Mobile-first design with desktop optimization
- **Error Handling**: Graceful fallbacks for API failures

## About

Built by Tabugbo Chiagoziem Favour, a Laboratory Analyst turned on-chain data analyst.  This dashboard was created as a community resource for the ADI Chain ecosystem and as a practical showcase of Web3 analytics development.

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please create an issue in the repository.
