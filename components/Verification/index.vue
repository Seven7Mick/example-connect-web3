<script lang="ts" setup>
  import { verifyMessage } from '@wagmi/core';
  import { config } from '~/configs/wagmi.config';

  const wallet = useWalletStore()

  const isLoadingSign = ref(false)
  const verifySnackbarText = ref('')
  const verifySnackbarStatus = ref('green')

  const addressData = defineModel<`0x${string}`>('addressData')
  const messageData = defineModel<string>('messageData')
  const signData = defineModel<`0x${string}` | Uint8Array>('signData')
  const isSnackbarVerify = defineModel<boolean>('isSnackbarVerify')

  function required(value: string) {
    return !!value || 'This field is required'
  }

  async function handleSign() {
    if (!addressData.value || !messageData.value || !signData.value) return
    try {
      isLoadingSign.value = true
      const result = await verifyMessage(config, {
        address: addressData.value,
        message: messageData.value,
        signature: signData.value
      })
      verifySnackbarText.value = result
        ? 'Verified!'
        : 'Invalid signature!'

      verifySnackbarStatus.value = result
        ? 'green'
        : 'red'

      isSnackbarVerify.value = true
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
      Verification
    </v-sheet>
    <v-row>
      <v-col>
        <v-text-field
          v-model="addressData"
          variant="outlined"
          label="Address"
          class="mb-3"
          :rules="[required]"
          :clearable="!isLoadingSign"
          :readonly="isLoadingSign"
          :disabled="!wallet.getIsConnected"
        />

        <v-text-field
          v-model="messageData"
          variant="outlined"
          label="Message"
          class="mb-3"
          :rules="[required]"
          :clearable="!isLoadingSign"
          :readonly="isLoadingSign"
          :disabled="!wallet.getIsConnected"
        />

        <v-text-field
          v-model="signData"
          variant="outlined"
          label="Sign message"
          class="mb-3"
          :rules="[required]"
          :clearable="!isLoadingSign"
          :readonly="isLoadingSign"
          :disabled="!wallet.getIsConnected"
        />

      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-btn
          block
          class="font-weight-bold"
          :loading="isLoadingSign"
          :disabled="!wallet.getIsConnected"
          @click="handleSign"
        >
          Verify
        </v-btn>
      </v-col>
    </v-row>

    <v-snackbar
      :color="verifySnackbarStatus"
      rounded="pill"
      v-model="isSnackbarVerify"
    >
      <v-sheet class="bg-transparent text-center font-weight-bold">
        {{ verifySnackbarText }}
      </v-sheet>
    </v-snackbar>
  </v-col>
</template>
