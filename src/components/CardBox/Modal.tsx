import { mdiClose, mdiUpload } from '@mdi/js'
import { ReactNode } from 'react'
import type { ColorButtonKey } from '../../interfaces'
import Button from '../Button'
import Buttons from '../Buttons'
import CardBox from '.'
import CardBoxComponentTitle from './Component/Title'
import OverlayLayer from '../OverlayLayer'
import { Field, Form, Formik } from 'formik'
import FormField from '../Form/Field'
import Divider from '../Divider'
import FormFilePicker from '../Form/FilePicker'
import axios from 'axios'

type Props = {
  title: string
  buttonColor: ColorButtonKey
  buttonLabel?: string
  isActive: boolean
  children?: ReactNode
  onConfirm: () => void
  onCancel?: () => void
  type?: string
  data?: any
  onUpdateData?: (data: any) => void
}

const CardBoxModal = ({
  title,
  buttonColor,
  buttonLabel,
  isActive,
  onConfirm,
  onCancel,
  type,
  data,
  onUpdateData,
  children,
}: Props) => {
  if (!isActive) {
    return null
  }

  const footer = (
    <Buttons className="">
      {type !== 'guru' &&
        type !== 'kelas' &&
        type !== 'makanan' &&
        !!onCancel && (
          <>
            <div className='grid grid-cols-2 gap-5'>
            <Button label="Cancel" color={buttonColor} outline onClick={onCancel} />
            <Button label={buttonLabel} color={buttonColor} onClick={onConfirm} />
            </div>
          </>
        )}
    </Buttons>
  )

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      let url = `http://localhost:5000/${type}/${values.id}`
      let updatedValues = { ...values }

      if (type === 'kelas') {
        updatedValues = {
          ...values,
          nama_walikelas: values.name, 
        }
        delete updatedValues.name 
      }
      

      const response = await axios.put(url, updatedValues)
      console.log(response)
      // Remap nama_walikelas back to name after receiving the response
      if (type === 'kelas') {
        updatedValues = {
          ...updatedValues,
          name: updatedValues.nama_walikelas,
        }
        delete updatedValues.nama_walikelas
      }

      

      if (onUpdateData) onUpdateData(updatedValues) // Call the update function with the new data
      onConfirm() // Close modal after success
    } catch (error) {
      console.error('Failed to submit form', error)
      alert('Failed to submit form')
    } finally {
      setSubmitting(false)
    }
  }
  const handleSubmitMakanan = async (values: any, { setSubmitting }: any) => {
    try {
      const formData = new FormData();
      formData.append('id', values.id);
      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('description', values.description);
      formData.append('image', values.image); // Adding file image to FormData
      formData.append('start_date', values.start_date);
      formData.append('updatedAt', values.updatedAt);

      const url = `http://localhost:5000/makanan/${values.id}`;

      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // console.log(response);

      if (onUpdateData) {
        // Use the updated data returned from the response
        onUpdateData(response.data);
      }
      onConfirm(); // Close modal after success
    } catch (error) {
      console.error('Failed to submit form', error);
      alert('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  }
  const renderForm = () => {
    switch (type) {
      case 'guru':
        return (
          <Formik
            initialValues={{
              id: data?.id || '',
              name: data?.name || '',
              createdAt: data?.createdAt || "testing",
            }}
            onSubmit={handleSubmit}
          >
            <Form>
              <FormField label="ID">
                <Field name="id" placeholder="79" />
              </FormField>

              <FormField label="Nama">
                <Field name="name" placeholder="Coach Justin" />
              </FormField>

              <Divider />

              <Buttons>
                <Button type="submit" color="info" label="Submit" />
                <Button type="reset" color="info" outline label="Reset" />
              </Buttons>
            </Form>
          </Formik>
        )
      case 'kelas':
        return (
          <Formik
            initialValues={{
              id: data?.id || '',
              nama_kelas: data?.nama_kelas || '',
              name: data?.name || '',
              createdAt: data?.createdAt || "testing",

            }}
            onSubmit={handleSubmit}
          >
            <Form>
              <FormField label="ID">
                <Field name="id" placeholder="123" />
              </FormField>

              <FormField label="Nama Kelas">
                <Field name="nama_kelas" placeholder="Nama Kelas" />
              </FormField>

              <FormField label="Nama Wali Kelas">
                <Field name="name" placeholder="Nama Wali Kelas" />
              </FormField>

              <Divider />

              <Buttons>
                <Button type="submit" color="info" label="Submit" />
                <Button type="reset" color="info" outline label="Reset" />
              </Buttons>
            </Form>
          </Formik>
        )
      case 'makanan':
        return (
          <Formik
            initialValues={{
              id: data?.id || '',
              name: data?.name || '',
              price: data?.price || '',
              description: data?.description || '',
              image: data?.image || '',
              start_date:data?.start_date || "",
              updatedAt:data?.updatedAt || ""
            }}
            onSubmit={handleSubmitMakanan}
          >
            {({ setFieldValue }) => (
            <Form>

              <FormField label="Nama Makanan">
                  <Field name="name" placeholder="Nama Makanan" />
              </FormField>
              <div className="grid grid-cols-2 gap-5">
               

                
              </div>

              <FormField label="Harga">
                <Field name="price" placeholder="Harga" />
              </FormField>

              <FormField label="Deskripsi">
                <Field name="description" placeholder="Deskripsi" />
              </FormField>

              <FormField>
                {/* FormFilePicker untuk memilih file gambar */}
                <Field
                  name="image"
                  component={FormFilePicker}
                  label="Upload Image"
                  color="info"
                  icon={mdiUpload}
                  accept="image/*"
                  onChange={(event: any) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                />
              </FormField>

              <Divider />

              <Buttons>
                <Button type="submit" color="info" label="Submit" />
                <Button type="reset" color="info" outline label="Reset" />
              </Buttons>
            </Form>
             )}
          </Formik>
        )
      default:
        return null
    }
  }

  return (
    <OverlayLayer onClick={onCancel} className={onCancel ? 'cursor-pointer' : ''}>
      <CardBox
        className={`transition-transform shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50`}
        isModal
        footer={footer}
      >
        <CardBoxComponentTitle title={title}>
          {!!onCancel && (
            <Button icon={mdiClose} color="whiteDark" onClick={onCancel} small roundedFull />
          )}
        </CardBoxComponentTitle>

        <div className="space-y-3">{renderForm()}</div>
        <div className="space-y-3">{children}</div>
      </CardBox>
    </OverlayLayer>
  )
}

export default CardBoxModal
