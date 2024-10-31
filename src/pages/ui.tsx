import {

  mdiContrastCircle,

} from '@mdi/js'

import Head from 'next/head'
import type { ReactElement } from 'react'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import { getPageTitle } from '../config'

const UiPage = () => {
  

  return (
    <>
      <Head>
        <title>{getPageTitle('UI')}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiContrastCircle}
          title="UI Elements"
          main
          
        />
      </SectionMain>
    </>
  )
}

UiPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default UiPage
