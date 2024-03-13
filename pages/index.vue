<script lang="ts" setup>
  import { sendTransaction, waitForTransactionReceipt } from '@wagmi/core';
  import { parseEther } from 'viem';
  import { config } from '~/configs/wagmi.config';

  const wallet = useWalletStore()

  const isLoadingTransfer = ref(false)

  async function handleTransaction({
    formAddress,
    formAmount
  }: { formAddress: `0x${string}`, formAmount : string}) {
    if (!formAddress
      || !formAmount
      || wallet.getAccount?.address === formAddress
    ) return
    try {
      isLoadingTransfer.value = true
      const hash = await sendTransaction(config, {
      to: formAddress,
      value: parseEther(formAmount)
    })
    await waitForTransactionReceipt(config, { hash })
    await wallet.fetchNativeBalance()
    } catch (error) {
      console.log('handleTransaction', error);
    } finally {
      isLoadingTransfer.value = false
    }
  }
</script>

<template>
  <div class="bg-blue-grey-lighten-1 pa-md-6">
    <ProfileInfo class="mb-6"/>
    <TransactionForm
      class="mb-6"
      is-transaction
      :is-loading="isLoadingTransfer"
      :is-disabled="!wallet.getIsConnected"
      @submit:form="handleTransaction"
    />
    <Token class="mb-6"/>
    <Sign class="mb-6"/>
    <Verification />
  </div>
</template>
