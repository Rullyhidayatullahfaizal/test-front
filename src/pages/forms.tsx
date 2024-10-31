import Head from 'next/head'
import { ReactElement } from 'react'
import CardBox from '../components/CardBox'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import { getPageTitle } from '../config'
import MakananForm from '../components/Form/FormMakanan'

const FormsPage = () => {
  return (
    <>
      <Head>
        <title>{getPageTitle('Forms')}</title>
      </Head>

      <SectionMain>
        <div className="flex justify-between mx-5">
          <SectionTitleLineWithButton title="Input Form" main />
        </div>

        <CardBox>
          <MakananForm />
        </CardBox>
      </SectionMain>
    </>
  )
}

FormsPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default FormsPage
