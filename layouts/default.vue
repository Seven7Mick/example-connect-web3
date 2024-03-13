<script lang="ts" setup>
  import { watchAccount } from '@wagmi/core';
  import { config } from '~/configs/wagmi.config';

  const wallet = useWalletStore()

  let unwatchEvent: null | Function

  onMounted(() => {
    unwatchEvent = watchAccount(config, {
      onChange(data) {
        wallet.setAccount(data)
      },
    })
  })

  onUnmounted(() => typeof unwatchEvent === 'function' && unwatchEvent())
</script>

<template>
  <v-main>
    <v-container class="bg-blue-grey-lighten-2">
      <Header />
      <slot />
    </v-container>
  </v-main>
</template>
