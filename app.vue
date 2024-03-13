<script lang="ts" setup>
</script>

<template>
  <v-app class="bg-blue-grey-lighten-4">
    <v-container class="bg-blue-grey-lighten-2">
      <v-tabs
        class="bg-blue-grey"
        fixed-tabs
      >
        <v-tab
          value="/"
          to="/"
          variant="plain"
          class="font-weight-bold"
        >
          Wagmi Connect
        </v-tab>
        <v-tab
          value="/modal"
          to="/modal"
          variant="plain"
          class="font-weight-bold"
        >
          Web3Modal
        </v-tab>
      </v-tabs>
    </v-container class="bg-blue-grey-lighten-2">

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
