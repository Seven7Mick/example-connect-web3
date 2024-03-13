<script lang="ts" setup>
  import { formatUnits } from 'viem';

  const wallet = useWalletStore()

  const profileInfo = computed(() => new Map([
    ['Connection status', wallet.getAccount?.status ?? 'disconnected'],
    ['Account address', wallet.getAccount?.address ?? 'Empty'],
    ['Chain ID', wallet.getAccount?.chainId ?? 'Empty'],
    ['Balance', wallet.getAccount?.address && wallet.getNativeBalance?.value
      ? `${formatUnits(wallet.getNativeBalance.value, wallet.getNativeBalance.decimals)}
        ${wallet.getNativeBalance.symbol}`
      : 'Empty'
    ],
  ]))
</script>

<template>
  <v-col>
    <v-row
      v-for="([nameRow, valueRow], idx) in profileInfo"
      :key="idx"
      class="mb-4"
    >
      <v-col class="bg-blue-grey-lighten-3 rounded-s font-weight-bold" cols="4">
        {{ nameRow }}
      </v-col>
      <v-col class="bg-blue-grey-lighten-3 rounded-e" cols="8">
        {{ valueRow }}
      </v-col>
    </v-row>
  </v-col>
</template>
