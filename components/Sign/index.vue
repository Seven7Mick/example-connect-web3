<script lang="ts" setup>
  import { signMessage } from '@wagmi/core'
  import { config } from '~/configs/wagmi.config';

  const wallet = useWalletStore()

  const isLoadingSign = ref(false)

  const signData = defineModel<string>('signData')
  const signMessageData = defineModel<string>('signMessageData')

  function required(value: string) {
    return !!value || 'This field is required'
  }

  async function handleSign() {
    if (!signData.value?.length) return
    try {
      isLoadingSign.value = true
      signMessageData.value = await signMessage(config, { message: signData.value })      
    } catch (error) {
      console.log('handleSign', error);
    } finally {
      isLoadingSign.value = false
    }
  }

</script>

<template>
  <v-col class="bg-blue-grey-lighten-3 rounded">
    <v-sheet class="text-h6 font-weight-bold bg-transparent mb-3">
      Sign Message
    </v-sheet>
    <v-row>
      <v-col cols="9">
        <v-text-field
          v-model="signData"
          variant="outlined"
          label="Message"
          class="mb-3"
          :rules="[required]"
          :clearable="!isLoadingSign"
          :disabled="!wallet.getIsConnected"
          :readonly="isLoadingSign"
        />
      </v-col>
      <v-col cols="3">
        <v-btn
          block
          class="font-weight-bold mt-2"
          :disabled="!wallet.getIsConnected"
          :loading="isLoadingSign"
          @click="handleSign"
        >
          Sign
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="signMessageData"
          variant="outlined"
          label="Sign message"
          class="mb-3"
          readonly
          :disabled="!wallet.getIsConnected"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
