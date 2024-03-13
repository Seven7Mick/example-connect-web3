<script lang="ts" setup>
  import {
    useDisconnect,
    useWeb3Modal,
    useWeb3ModalEvents,
    useWeb3ModalAccount,
    useWeb3ModalProvider,
    useWeb3ModalTheme
  } from '@web3modal/ethers/vue'
  import type { Eip1193Provider } from 'ethers';
  import { BrowserProvider, formatUnits } from 'ethers';

  definePageMeta({
    layout: 'modal'
  })

  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { setThemeMode, themeMode, setThemeVariables, themeVariables } = useWeb3ModalTheme()

  const isSnackbarTheme = defineModel<boolean>()
  const balance = ref('')

  const account = computed(() => new Map([
    ['Chain ID', isConnected.value ? chainId.value?.toString() : 'Empty'],
    ['Address', isConnected.value ? address.value?.toString() : 'Empty'],
    ['Balance', isConnected.value && balance.value ? formatUnits(balance.value) : '0'],
  ]))

  const events = useWeb3ModalEvents()

  watch(events, async (newVal) => {
    if (newVal.data.event === 'CONNECT_SUCCESS') {
    }
  })

  watch(isConnected, async() => {
    await getBalance()
  })

  async function getBalance() {
    if (!isConnected.value || !address.value) return
    const { walletProvider } = useWeb3ModalProvider()
    const provider = new BrowserProvider(walletProvider.value as Eip1193Provider)
    balance.value = (await provider.getBalance(address.value)).toString()
  }

  async function handleOpen(view: NonNullable<Parameters<typeof open>[0]>) {
    await open(view)
  }

  async function handleDisconnect() {
    await disconnect()
  }

  function switchThemeModeModal() {
    setThemeMode(themeMode.value === 'dark' ? 'light' : 'dark')
    isSnackbarTheme.value = true
  }

  function switchThemeVariablesModal() {
    const isCustomVariables = !!Object.values(themeVariables.value).filter(el => !!el).length;

    if (isCustomVariables) {
      const nullable = Object.entries(themeVariables.value).reduce((acc, [key]) => {
      acc[key] = undefined
      return acc
    }, {} as Record<string, undefined>)

      setThemeVariables(nullable)
      return
    }

    setThemeVariables({
      '--w3m-color-mix': 'red',
      '--w3m-accent': 'green',
      '--w3m-color-mix-strength': 10,
      '--w3m-font-family': 'monospaced',
      '--w3m-border-radius-master': 'none'
    })
  }
</script>

<template>
  <v-col class="bg-blue-grey-lighten-1 rounded pa-md-6">
    <v-row class="justify-end ga-3 mb-3">
      <v-btn
        class="font-weight-bold"
        size="large"
        @click="() => handleOpen({ view: 'Connect' })"
      >
        Connect Wallet
      </v-btn>
      <v-btn
        class="font-weight-bold"
        size="large"
        :disabled="!isConnected"
        @click="() => handleOpen({ view: 'Networks' })"
      >
        Network
      </v-btn>
      <v-btn
        class="font-weight-bold"
        size="large"
        :disabled="!isConnected"
        @click="handleDisconnect"
      >
        Disconnect
      </v-btn>
    </v-row>

    <v-row class="ga-3 mb-3">
      <v-btn
        class="font-weight-bold"
        size="large"
        @click="switchThemeModeModal"
      >
        Theme Mode: {{ themeMode }}
      </v-btn>

      <v-btn
        class="font-weight-bold"
        size="large"
        @click="switchThemeVariablesModal"
      >
        Change Theme
      </v-btn>
    </v-row>

    <v-row class="ga-3" style="height: 42px;">
      <w3m-connect-button
        label="Enable Web3"
        loadingLabel="Loading"
      />
      <w3m-network-button :disabled="!isConnected"/>
    </v-row>

    <v-row>
      <v-col class="px-0">
        <v-list class="bg-transparent">
          <v-list-item
            v-for="([itemKey, itemValue], idx) in account"
            :key="idx"
            class="bg-blue-grey-lighten-4 rounded mb-3"
          >
            <v-row>
              <v-col cols="4">
                {{ itemKey }}
              </v-col>
              <v-col cols="8">
                {{ itemValue }}
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-snackbar
      color="green"
      rounded="pill"
      v-model="isSnackbarTheme"
    >
      <v-sheet class="bg-transparent text-center font-weight-bold">
        Theme changed to {{ themeMode }}
      </v-sheet>
    </v-snackbar>
  </v-col>
</template>
