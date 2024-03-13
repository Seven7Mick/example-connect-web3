<script lang="ts" setup>
  import { initWeb3Modal } from '~/configs/web3Modal.config';

  initWeb3Modal()
</script>

<template>
  <v-main>
    <v-container class="bg-blue-grey-lighten-2 h-100">
      <slot />
    </v-container>
  </v-main>
</template>