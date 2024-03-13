import { walletConnect } from '@wagmi/connectors'
import { http, createConfig, injected, type CreateConnectorFn } from '@wagmi/core'
import { polygonMumbai } from '@wagmi/core/chains'

const {
  walletConnectKey: projectId,
  mumbaiKey
} = useRuntimeConfig().public

const INFURA_URL = 'https://polygon-mumbai.infura.io/v3/'

export enum EnumConnector {
  METAMASK = 'MetaMask',
  WALLET_CONNECT = 'WalletConnect',
  COINBASE_WALLET = 'CoinbaseWallet'
}

export const connectors = new Map<EnumConnector, CreateConnectorFn>([
  [EnumConnector.METAMASK, injected({ target: 'metaMask' })],
  [EnumConnector.WALLET_CONNECT, walletConnect({ projectId })],
  [EnumConnector.COINBASE_WALLET, injected({ target: 'coinbaseWallet' })],
])

export const config = createConfig({
  chains: [polygonMumbai],
  ssr: false,
  connectors: [...connectors.values()],
  transports: {
    [polygonMumbai.id]: http(INFURA_URL + mumbaiKey),
  },
})
