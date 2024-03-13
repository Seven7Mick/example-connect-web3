import { defineStore } from 'pinia'
import {
  type GetBalanceReturnType,
  type GetAccountReturnType,
  connect,
  reconnect,
  getBalance,
  disconnect
} from '@wagmi/core'
import { config, connectors, EnumConnector } from '~/configs/wagmi.config';

interface State {
  account: GetAccountReturnType | null
  nativeBalance: GetBalanceReturnType | null
}

export const useWalletStore = defineStore('wallet', {
  state: (): State => ({
    account: null,
    nativeBalance: null,
  }),

  getters: {
    getAccount: (state) => state.account,
    getNativeBalance: (state) => state.nativeBalance,
  },

  actions: {
    async connectWallet(
      wallet: EnumConnector,
      chainId: keyof typeof config._internal.transports = config.chains[0].id
    ) {
      const connector = connectors.get(wallet)
      if (!connector) return
      this.disconnectWallet()
      await connect(config, {
        connector,
        chainId
      })
      await this.fetchNativeBalance()
    },

    async reconnectWallet(){
      await reconnect(config)
      await this.fetchNativeBalance()
    },

    async disconnectWallet() {
      await disconnect(config)
      this.$reset()
    },

    async fetchNativeBalance(){
      if (this.account?.address) {
        this.nativeBalance = await getBalance(config, {
          address: this.account.address,
        })
      }
    },

    setAccount(account: GetAccountReturnType) {
      this.account = account
    } 
  },
})