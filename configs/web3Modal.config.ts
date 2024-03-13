import { polygon, polygonMumbai, mainnet } from '@wagmi/core/chains'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue'

const { walletConnectKey: projectId } = useRuntimeConfig().public

const mumbaiChain = {
  chainId: polygonMumbai.id,
  name: polygonMumbai.name,
  currency: polygonMumbai.nativeCurrency.symbol,
  explorerUrl: polygonMumbai.blockExplorers.default.url,
  rpcUrl: polygonMumbai.rpcUrls.default.http[0]
}

const polygonChain = {
  chainId: polygon.id,
  name: polygon.name,
  currency: polygon.nativeCurrency.symbol,
  explorerUrl: polygon.blockExplorers.default.url,
  rpcUrl: polygon.rpcUrls.default.http[0]
}

const mainnetChain = {
  chainId: mainnet.id,
  name: mainnet.name,
  currency: mainnet.nativeCurrency.symbol,
  explorerUrl: mainnet.blockExplorers.default.url,
  rpcUrl: mainnet.rpcUrls.default.http[0]
}

const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}

export const initWeb3Modal = () => createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata,
    defaultChainId: 1,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: '...' // used for the Coinbase SDK
  }),
  chains: [mumbaiChain, polygonChain, mainnetChain],
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})