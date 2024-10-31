import { mdiAccountCog,  mdiTrashCan } from '@mdi/js'
import React, { useState } from 'react'
import Button from '../Button'
import Buttons from '../Buttons'
import CardBoxModal from '../CardBox/Modal'
import { Field, Form, Formik } from 'formik'
import FormField from '../Form/Field'
import Divider from '../Divider'

interface TableSampleClientsProps {
  columns: Array<{ key: string; label: string }>
  data: any[]
  type?: string
  onUpdateData?: (updatedData: any,type:string) => void // Tambahkan prop onUpdateData 
  onDelete?: (id: string, type: string) => void // Add onDelete prop

}

const TableSampleAdminstators = ({ columns, data,type,onUpdateData,onDelete  }: TableSampleClientsProps) => {
  const perPage = 5
  const [currentPage, setCurrentPage] = useState(0)
  const [dataUpdate, setDataUpdate] = useState(data)
  const validData = Array.isArray(data) ? data : []
  const dataPaginated = validData.slice(perPage * currentPage, perPage * (currentPage + 1))
  const numPages = Math.ceil(validData.length / perPage)
  const pagesList = Array.from({ length: numPages }, (_, i) => i)

  const [isModalInfoActive, setIsModalInfoActive] = useState(false)
  const [isModalTrashActive, setIsModalTrashActive] = useState(false)
  const [modalData, setModalData] = useState(null) 


  const handleModalAction = () => {
    setIsModalInfoActive(false)
    setIsModalTrashActive(false)
  }

  const openInfoModal = (data:any) => {
    setModalData(data)
    // console.log(modalData)
    setIsModalInfoActive(true)
  }

  const handleUpdateData = (updatedData: any) => {
    setDataUpdate(prevData =>
      prevData.map(item => (item.id === updatedData.id ? updatedData : item))
    )
    setIsModalInfoActive(false)
    if (onUpdateData) {
      onUpdateData(updatedData  ,type) // Memanggil onUpdateData untuk memperbarui state di TablesPage
    }
  }

  const handleDeleteConfirm = () => {
    if (modalData && onDelete) {
      onDelete(modalData.id, type || '')
    }
    handleModalAction()
  }

  const formatRupiah = (amount:any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <>
      <CardBoxModal
         title="UPDATE DATA"
         buttonColor="info"
         buttonLabel="Done"
         isActive={isModalInfoActive}
         onConfirm={() => {}}
         onCancel={handleModalAction}
         type={type}
         data={modalData}
         onUpdateData={handleUpdateData} // Pass update function to modal
      >
         
      </CardBoxModal>

      <CardBoxModal
        title="Please confirm"
        buttonColor="danger"
        buttonLabel="Confirm"
        isActive={isModalTrashActive}
        data={modalData}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsModalTrashActive(false)}
      >
        <p className='font-semibold text-gray-600'>
          Apakah anda yakin ingin <b className='text-red-900'>meghapusnya </b> ?
        </p>
        
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.label === 'Gambar' ? 'text-center' : ''}>
                {column.label}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataPaginated.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={column.key} data-label={column.label}>
                  {column.key === 'image' ? (
                    <img
                      src={`http://localhost:5000/${item[column.key]}`}
                      alt="Image"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : column.key === 'price' ? (
                    formatRupiah(item[column.key])
                  ) : (
                    item[column.key]
                  )}
                </td>
              ))}
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiAccountCog}
                    onClick={() =>{
                    openInfoModal(item)} }
                    small
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setModalData(item)
                      setIsModalTrashActive(true)
                    }}
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

export default TableSampleAdminstators
