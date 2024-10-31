import {
  mdiAccountMultiple,
  mdiChartPie,
  mdiChartTimelineVariant,
  mdiMonitorCellphone,
  mdiReload,
} from '@mdi/js'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import Button from '../components/Button'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import { useSampleClients } from '../hooks/sampleData'
import {  ReportTranksasi } from '../interfaces'
import CardBoxClient from '../components/CardBox/Client'
import CardBox from '../components/CardBox'
import { sampleChartData } from '../components/ChartLineSample/config'
import ChartLineSample from '../components/ChartLineSample'
import NotificationBar from '../components/NotificationBar'
import TableSampleClients from '../components/Table/SampleClients'
import { getPageTitle } from '../config'
import axios from 'axios'
import { BubbleChat } from 'flowise-embed-react'

const DashboardPage = () => {
  const { clients } = useSampleClients()
  const [report, setReport] = useState<ReportTranksasi[]>([])


  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('http://localhost:5000/report')
        setReport(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching report:', error)
      }
    }
   

    fetchReport()
  }, [])




  const clientsListed = clients.slice(0, 8)

  const [chartData, setChartData] = useState(sampleChartData())

  const fillChartData = (e: React.MouseEvent) => {
    e.preventDefault()

    setChartData(sampleChartData())
  }

  const combinedData = clientsListed.map((client: any) => {
    const clientReport = report.find((r) => r.id === client.id)
    return {
      ...client,
      report: clientReport || {},
    }
  })

  return (
    <>
      <Head>
        <title>{getPageTitle('Dashboard')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title="User"
          main
        ></SectionTitleLineWithButton>

        <div className="flex flex-cols-1 lg:flex-cols-2 gap-6 mb-6">
          <div className="flex flex-wrap justify-between">
            {combinedData.map((data: any, index: any) => (
              <CardBoxClient key={index} client={data} />
            ))}
          </div>
        </div>

        <div className="my-6"></div>

        <SectionTitleLineWithButton icon={mdiChartPie} title="Trends overview">
          <Button icon={mdiReload} color="whiteDark" onClick={fillChartData} />
        </SectionTitleLineWithButton>

        <CardBox className="mb-6">{chartData && <ChartLineSample data={chartData} />}</CardBox>

        <SectionTitleLineWithButton icon={mdiAccountMultiple} title="Clients" />

        <NotificationBar color="info" icon={mdiMonitorCellphone}>
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox hasTable>
          <TableSampleClients apiUrl="/users" />
        </CardBox>
        <BubbleChat chatflowid="4d5f6294-ecfa-4c83-8c62-ebe33e757724" apiHost="http://localhost:3000" 
          theme={{
            chatWindow:{
              title:'General Data',
              footer:{
                textColor: '#303235',
                        text: 'studyCase',
                        company: 'ChatBot',
                        companyLink: 'https://flowiseai.com',
              }
            }
          }}     
         />

      </SectionMain>
    </>
  )
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default DashboardPage
