import {
  mdiMonitor,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiWebBox,
} from '@mdi/js'
import { MenuAsideItem } from './interfaces'


const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    href: '/tables',
    label: 'Administrator',
    icon: mdiTable,
  },
  {
    href: '/forms',
    label: 'Forms',
    icon: mdiSquareEditOutline,
  },
  {
    href:'/ai',
    label:'AI-Artificial',
    icon: mdiWebBox, 
  }
  ,
  {
    href: '/ui',
    label: 'UI',
    icon: mdiTelevisionGuide,
  },
  {
    href: '/responsive',
    label: 'Responsive',
    icon: mdiResponsive,
  },
  
  {
    href: '/error',
    label: 'Error',
    icon: mdiAlertCircle,
  },
  
]

export default menuAside
