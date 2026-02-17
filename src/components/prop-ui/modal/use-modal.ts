import { createSharedComposable, useMediaQuery } from '@vueuse/core'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

const useSharedModal = createSharedComposable(() => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const Modal = computed(() => ({
    Root: isDesktop.value ? Dialog : Drawer,
    Trigger: isDesktop.value ? DialogTrigger : DrawerTrigger,
    Content: isDesktop.value ? DialogContent : DrawerContent,
    Header: isDesktop.value ? DialogHeader : DrawerHeader,
    Title: isDesktop.value ? DialogTitle : DrawerTitle,
    Description: isDesktop.value ? DialogDescription : DrawerDescription,
    Footer: isDesktop.value ? DialogFooter : DrawerFooter,
    Close: isDesktop.value ? DialogClose : DrawerClose,
  }))

  const contentClass = computed(() => (isDesktop.value ? '' : 'px-2 pb-8 *:px-4'))

  return {
    isDesktop,
    Modal,
    contentClass,
  }
})

export function useModal() {
  return useSharedModal()
}
