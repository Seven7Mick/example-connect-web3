import { ABI_ERC20 } from './ABI/ERC20'

const { contractAddressERC20 } = useRuntimeConfig().public

export const ERC20_PARAMS = {
  abi: ABI_ERC20,
  address: contractAddressERC20 as `0x${string}`,
} as const