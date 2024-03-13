<script lang="ts" setup>
import BigNumber from 'bignumber.js';
import { readContracts, waitForTransactionReceipt, watchContractEvent, writeContract } from '@wagmi/core';
import { parseEther, zeroAddress } from 'viem';
import { ERC20_PARAMS } from '~/configs/main.config';
import { config } from '~/configs/wagmi.config';

  const wallet = useWalletStore()

  const tokenInfo = reactive(new Map([
    ['Balance', '0'],
    ['Name', 'Empty'],
    ['Symbol', 'Empty']
  ]))

  const token = ref({
    name: '',
    symbol: '',
    balance: '0',
    decimals: 18
  })

  const isLoadingMint = ref(false)
  const isLoadingTransfer = ref(false)
  const isSnackbarMint = ref(false)
  const isSnackbarTransfer = ref(false)
  const snackbarTransferList = reactive(new Map())

  let unwatchEvent: null | Function

  onMounted(() => {
    unwatchEvent = watchContractEvent(config, {
      ...ERC20_PARAMS,
      eventName: 'Transfer',
      onLogs(logs) {
        const [{ args }] = logs
        const { from, to, value } = args
        if (from === zeroAddress && to === address.value) {
          token.value.balance = new BigNumber(token.value.balance)
            .plus(value?.toString() ?? 0)
            .toString()

          setTokenBalance()
          isSnackbarMint.value = true
          return
        }

        if (from === address.value) {
          token.value.balance = new BigNumber(token.value.balance)
            .minus(value?.toString() ?? 0)
            .toString()

          setTokenBalance()
          snackbarTransferList.set('From:', from)
          snackbarTransferList.set('To:', to)
          snackbarTransferList.set('Amount:', new BigNumber(value?.toString() ?? 0).div(10 ** token.value.decimals).toString())
          isSnackbarTransfer.value = true
        }
      },
    })
  })

  onUnmounted(() => typeof unwatchEvent === 'function' && unwatchEvent())

  const address = computed(() => wallet.getAccount?.address || null)

  async function fetchTokenInfo() {
    if (!address.value) return
    const [name, symbol, balance, decimals] = await readContracts(config, {
      contracts: [
      {
          ...ERC20_PARAMS,
          functionName: 'name',
        },
        {
          ...ERC20_PARAMS,
          functionName: 'symbol',
        },
        {
          ...ERC20_PARAMS,
          functionName: 'balanceOf',
          args: [address.value]
        },
        {
          ...ERC20_PARAMS,
          functionName: 'decimals',
        }
      ]
    })

    token.value = {
      name: name.result || '',
      symbol: symbol.result || '',
      balance: balance.result?.toString() ?? '0',
      decimals: decimals.result || 18
    }

    tokenInfo.set('Name', name.result?.toString() ?? '')
    tokenInfo.set('Symbol', symbol.result?.toString() ?? '')
    setTokenBalance()
  }

  function setTokenBalance() {
    tokenInfo.set('Balance', new BigNumber(token.value.balance).div(10 ** token.value.decimals).toString())
  }

  watch(address, async (newVal) => {
    if (!newVal) return
    await fetchTokenInfo()
  })

  async function handleMint({ formAmount }: {formAmount : string}) {
    if (!formAmount) return
    try {
      isLoadingMint.value = true
      const hash = await writeContract(config, {
        ...ERC20_PARAMS,
        functionName: 'mint',
        args: [parseEther(formAmount)],
      })
      await waitForTransactionReceipt(config, { hash })
      await wallet.fetchNativeBalance()
    } catch (error) {
      console.log('handleMint', error);
    } finally {
      isLoadingMint.value = false
    }
  }

  async function handleTransfer({
    formAddress,
    formAmount
  }: { formAddress: `0x${string}`, formAmount : string}) {
    if (!formAddress || !formAmount) return
    try {
      isLoadingTransfer.value = true
      const hash = await writeContract(config, {
        ...ERC20_PARAMS,
        functionName: 'transfer',
        args: [formAddress, parseEther(formAmount)],
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
  <v-col class="bg-blue-grey-lighten-3 rounded pb-6">
    <TokenInfo
      :tokenInfo
    />
    <v-row class="my-6">
      <TransactionForm
        class="bg-blue-grey-lighten-1"
        :isLoading="isLoadingMint"
        @submit:form="handleMint"
      />
    </v-row>
    <v-row class="mb-6">
      <TransactionForm
        class="bg-blue-grey-lighten-1"
        is-transaction
        :is-loading="isLoadingTransfer"
        @submit:form="handleTransfer"
      />
    </v-row>

    <v-snackbar
      color="green"
      rounded="pill"
      v-model="isSnackbarMint"
    >
      <v-sheet class="bg-transparent text-center font-weight-bold">
        MINT SUCCESSFUL
      </v-sheet>
    </v-snackbar>

    <v-snackbar
      color="green"
      v-model="isSnackbarTransfer"
    >
      <p>ERC-20 Transfer Successful:</p>
      <v-list class="bg-transparent">
        <v-list-item
          v-for="([itemKey, itemValue], idx) in snackbarTransferList"
          :key="idx"
          :title="itemKey"
          :subtitle="itemValue"
        />
      </v-list>
    </v-snackbar>
  </v-col>
</template>
