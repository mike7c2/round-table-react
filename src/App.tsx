import React from "react";
import "./App.css";
import logoFile from "./RoundTable.jpg";

import {
    ConnectionProvider,
    WalletProvider
} from "@solana/wallet-adapter-react";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet
} from "@solana/wallet-adapter-wallets";
import MyWallet from "./MyWallet";
import TestView from "./view/TestView";

function App()
{
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = "https://api.devnet.solana.com";

    // You can also provide a custom RPC endpoint
    const endpoint = React.useMemo(() => network, [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
    // Only the wallets you configure here will be compiled into your application
    const wallets = React.useMemo(
        () => [
            getPhantomWallet(),
            getSlopeWallet(),
            getSolflareWallet(),
            getLedgerWallet()
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <TestView/>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
