import { mdiEye, mdiTrashCan } from '@mdi/js'
import React, { ReactNode, useEffect, useState } from 'react'
import { useSampleClients } from '../../hooks/sampleData'
import { Client } from '../../interfaces'
import Button from '../Button'
import Buttons from '../Buttons'
import CardBoxModal from '../CardBox/Modal'
import UserAvatar from '../UserAvatar'
import { useAxios } from '../../config'
import {jwtDecode} from 'jwt-decode'
import axios from 'axios'

interface TableSampleClientsProps {
  apiUrl: string;

}
const TableSampleClients = ({apiUrl}:TableSampleClientsProps) => {
  const { clients } = useSampleClients()
  const [siswa, setSiswa] = useState([])
  const [token,setToken] = useState<any>('')
  const [name,setName] = useState<string>('')
  const [expire,setExpire] = useState<any>('')
  const api = useAxios()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(apiUrl)
        setSiswa(response.data)
        // console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    // refreshToken() 
    fetchData()
  }, [])

    const refreshToken = async () => {
  try {
    const response = await axios.get('http://localhost:5000/admin-token', {
      withCredentials: true, // Ensure cookies are sent with the request
    });
    setToken(response.data.accessToken);
    const decoded = jwtDecode(response.data.accessToken);
    setName(decoded.iss);
    setExpire(decoded.exp);
  } catch (error) {
    if (error.response) {
      console.error('Error refreshing token:', error.response.data);
    }
  }
};


    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
      const currentDate = new Date();
      if (expire * 15 < currentDate.getTime()) {
        const response = await axios.get('http://localhost:5000/admin-token', {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setName(decoded.iss);
        setExpire(decoded.exp);
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
    

  const perPage = 5
  const [currentPage, setCurrentPage] = useState(0)
  const clientsPaginated = clients.slice(perPage * currentPage, perPage * (currentPage + 1))
  const numPages = Math.ceil(clients.length / perPage)
  const pagesList = Array.from({ length: numPages }, (_, i) => i)

  const [isModalInfoActive, setIsModalInfoActive] = useState(false)
  const [isModalTrashActive, setIsModalTrashActive] = useState(false)

  const handleModalAction = () => {
    setIsModalInfoActive(false)
    setIsModalTrashActive(false)
  }

  return (
    <>
      <CardBoxModal
        title="Sample modal"
        buttonColor="info"
        buttonLabel="Done"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
        onCancel={handleModalAction}
      >
        <p>
          Lorem ipsum dolor sit amet <b>adipiscing elit</b>
        </p>
        <p>This is sample modal</p>
      </CardBoxModal>

      <CardBoxModal
        title="Please confirm"
        buttonColor="danger"
        buttonLabel="Confirm"
        isActive={isModalTrashActive}
        onConfirm={handleModalAction}
        onCancel={handleModalAction}
      >
        <p>
          Lorem ipsum dolor sit amet <b>adipiscing elit</b>
        </p>
        <p>This is sample modal</p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th />
            <th>Username</th>
            <th>Email</th>
            <th>Nama kelas</th>
            <th>Progress</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {siswa.slice(perPage * currentPage, perPage * (currentPage + 1)).map((user, index) => (
            <tr key={user.id}>
              <td className="border-b-0 lg:w-6 before:hidden">
                <UserAvatar username={clientsPaginated[index]?.name} className="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
              </td>
              <td data-label="Username">{user.username}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Nama kelas">{user.nama_kelas}</td>
              <td data-label="Progress" className="lg:w-32">
                <progress
                  className="flex w-2/5 self-center lg:w-full"
                  max="100"
                  value={clientsPaginated[index]?.progress}
                >
                  {clientsPaginated[index]?.progress}
                </progress>
              </td>
              <td data-label="Created" className="lg:w-1 whitespace-nowrap">
                <small className="text-gray-500 dark:text-slate-400">{user.createdAt}</small>
              </td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    onClick={() => setIsModalInfoActive(true)}
                    small
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => setIsModalTrashActive(true)}
                    small
                  />
                </Buttons>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
          <Buttons>
            {pagesList.map((page) => (
              <Button
                key={page}
                active={page === currentPage}
                label={page + 1}
                color={page === currentPage ? 'lightDark' : 'whiteDark'}
                small
                onClick={() => setCurrentPage(page)}
              />
            ))}
          </Buttons>
          <small className="mt-6 md:mt-0">
            Page {currentPage + 1} of {numPages}
          </small>
        </div>
      </div>
    </>
  )
}

export default TableSampleClients
