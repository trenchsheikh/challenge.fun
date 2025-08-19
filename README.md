# Challenge.fun

A Next.js application for tracking Solana portfolios with wallet connection, live balances, transaction history, and badge systems.

## Features

- 🔗 **Solana Wallet Integration** - Connect Phantom, Solflare, and Torus wallets
- 📊 **Portfolio Overview** - View wallet balance and address information
- 🚀 **Modern UI** - Clean, responsive design with Next.js 14 App Router
- 🔮 **Future Integrations** - Ready for Birdeye API, SolanaFM API, and Supabase

## Project Structure

Based on the data flow outlined in `Context.md`:

```
[Wallet Connect] → [Birdeye API] → [SolanaFM API] → [Supabase DB] → [Frontend UI]
```

- **Wallet Connect**: Solana wallet adapter integration
- **Birdeye API**: Live balances and prices (coming soon)
- **SolanaFM API**: Historical transactions (coming soon)
- **Supabase DB**: Streak data, badge history, PnL stats (coming soon)
- **Frontend UI**: Portfolio view, badges, and insights

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Solana wallet (Phantom, Solflare, or Torus)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Wallet**: Solana Wallet Adapter
- **Styling**: Custom CSS with utility classes
- **State Management**: React hooks
- **APIs**: Ready for Birdeye, SolanaFM, and Supabase integration

## Components

- `WalletProvider`: Solana wallet connection provider
- `Header`: Navigation with wallet connect button
- `Home`: Main portfolio dashboard
- `layout.tsx`: Root layout with wallet provider

## Wallet Support

- Phantom Wallet
- Solflare Wallet  
- Torus Wallet

## Development

The app is currently set to use Solana devnet for development. To switch to mainnet:

1. Update `WalletAdapterNetwork.Devnet` to `WalletAdapterNetwork.MainnetBeta` in `components/WalletProvider.tsx`
2. Update the RPC endpoint if needed

## Next Steps

1. **Birdeye API Integration**: Add live token balances and prices
2. **SolanaFM API Integration**: Implement transaction history
3. **Supabase Setup**: Configure database for user data storage
4. **Badge System**: Implement achievement and streak tracking
5. **Portfolio Analytics**: Add PnL calculations and insights

## Contributing

This is a development project. Feel free to contribute by:
- Adding new wallet adapters
- Implementing API integrations
- Improving the UI/UX
- Adding new features

## License

MIT License 