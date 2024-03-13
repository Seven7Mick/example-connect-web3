<script lang="ts" setup>
  const { isTransaction } = defineProps({
    isLoading: {
      type: Boolean,
      default: false
    },
    isTransaction: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['submit:form'])

  const formAddress = defineModel<`0x${string}`>('formAddress')
  const formAmount = defineModel<string>('formAmount')

  function required(value: string) {
    return !!value || 'This field is required'
  }

  function submitForm() {
    const data = isTransaction
      ? { formAddress: formAddress.value, formAmount: formAmount.value }
      : { formAmount: formAmount.value }
    emit('submit:form', data)
  }
</script>

<template>
  <v-col class="bg-blue-grey-lighten-3 rounded mx-auto" cols="6">
    <v-sheet class="text-h6 font-weight-bold bg-transparent mb-3">
      {{ isTransaction ? 'Transfer' : 'Mint'}}
    </v-sheet>
    <v-form @submit.prevent="submitForm">
      <v-text-field
        v-if="isTransaction"
        v-model="formAddress"
        variant="outlined"
        label="Address to"
        class="mb-3"
        :rules="[required]"
        :clearable="!isLoading"
        :readonly="isLoading"
      />
      <v-text-field
        v-model="formAmount"
        variant="outlined"
        label="Amount"
        class="mb-3"
        :rules="[required]"
        :clearable="!isLoading"
        :readonly="isLoading"
      />

      <v-btn
        type="submit"
        block
        class="font-weight-bold"
        :loading="isLoading"
      >
        Send
      </v-btn>
    </v-form>
  </v-col>
</template>
