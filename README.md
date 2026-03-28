# ADI Chain Analytics Dashboard

A professional, Bloomberg Terminal-inspired live analytics dashboard for ADI Chain, built with React, Vite, and Tailwind CSS.

## Features

- **Real-time Data**: Auto-refreshes every 30 seconds from multiple data sources
- **Professional UI**: Dark, institutional design optimized for financial data
- **Four Comprehensive Tabs**:
  - **Overview**: Key metrics, price charts, transaction data, and performance table
  - **By Metric**: Detailed analysis of 15+ network metrics with sparklines
  - **All Data**: Sortable table with complete dataset
  - **Insights**: Network analysis and ecosystem partner information

## Data Sources

- **CoinGecko**: Price, market cap, volume, and supply data
- **ADI Explorer**: Transaction and address statistics  
- **ADI RPC**: Real-time block and gas data
- **Calculated Metrics**: Velocity ratios, momentum indicators, and growth rates

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
git clone <repository-url>
cd adi-dashboard

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
- Interactive price history chart (30D/90D/ALL)
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

### Insights Tab
- Network analysis with BULLISH/NEUTRAL/BEARISH signals
- ADI Chain technical specifications
- Ecosystem partner status and information
- Explanatory analysis for each metric

## Performance

- **Caching**: 30-second API response caching
- **Optimized Rendering**: React 19 with minimal re-renders
- **Responsive**: Mobile-first design with desktop optimization
- **Error Handling**: Graceful fallbacks for API failures

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please create an issue in the repository.
