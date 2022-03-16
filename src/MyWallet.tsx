import React from 'react';
import {
    useAnchorWallet,
    useConnection,
    useWallet
} from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

const MyWallet: React.FC = () =>
{
    const {connection} = useConnection();
    const wallet = useWallet();

    return (
        <>
            <div className="multi-wrapper">
                <span className="button-wrapper">
                    {!wallet.connected &&
                    <WalletModalProvider>
                        <WalletMultiButton/>
                    </WalletModalProvider>
                    }
                </span>
            </div>
        </>
    );
};

export default MyWallet;
