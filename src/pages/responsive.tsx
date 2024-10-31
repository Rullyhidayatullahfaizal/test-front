import Head from 'next/head'
import React, { ReactElement } from 'react'
import LayoutAuthenticated from '../layouts/Authenticated'
import {  getPageTitle } from '../config'

const ResponsivePage = () => {
  return (
    <>
      <Head>
        <title>{getPageTitle('Responsive')}</title>
      </Head>

    
    </>
  )
}

ResponsivePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ResponsivePage
