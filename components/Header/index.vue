<script lang="ts" setup>
import { connectors } from '~/configs/wagmi.config';

const wallet = useWalletStore()

const wallets = [...connectors.keys()]

const connectorName = computed(() => wallet.getAccount?.connector?.name ?? 'Connect')

onMounted(async () => {
  await wallet.reconnectWallet()
})
</script>

<template>
  <v-col class="bg-blue-grey pa-md-6 mb-4 rounded">
    <v-row class="justify-end align-center ga-3">
      <v-btn
        class="font-weight-bold"
        size="large"
      >
        {{ connectorName }}
        <v-menu activator="parent" transition="slide-y-transition">
          <v-list class="bg-blue-grey-lighten-4">
            <v-list-item
              v-for="(item, idx) in wallets"
              :key="idx"
              :value="idx"
            >
              <v-list-item-title @click="wallet.connectWallet(item)">
                {{ item }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

      <v-btn
        class="font-weight-bold"
        size="large"
        @click="wallet.disconnectWallet"
        :disabled="!wallet.getAccount?.isConnected"
      >
        Disconnect
      </v-btn>
    </v-row>
  </v-col>
</template>