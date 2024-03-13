<script lang="ts" setup>
  defineProps(['tokenInfo'])
</script>

<template>
  <v-row>
    <v-sheet class="text-h6 font-weight-bold bg-blue-grey-lighten-3 ma-3">
      Token ERC-20
    </v-sheet>
  </v-row>
  <v-row
    v-for="([itemKey, itemValue], idx) in tokenInfo"
    :key="idx"
  >
    <v-col class="bg-blue-grey-lighten-3 rounded-s font-weight-bold" cols="4">
      {{ itemKey }}
    </v-col>
    <v-col class="bg-blue-grey-lighten-3 rounded-e" cols="8">
      {{ itemValue }}
    </v-col>
  </v-row>
</template>