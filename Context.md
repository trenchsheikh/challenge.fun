# Test-Sol Data Flow Overview

[Wallet Connect]
↓
[Birdeye API] → Live balances + prices
[SolanaFM API] → Historical transactions
↓
[Supabase DB] → Stores streak data, badge history, PnL stats
↓
[Frontend UI] → Portfolio view + Badges + Insights