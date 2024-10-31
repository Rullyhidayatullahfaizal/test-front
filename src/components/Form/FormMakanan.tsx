import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import FormField from "../Form/Field";
import FormFilePicker from "../Form/FilePicker";
import { mdiUpload } from "@mdi/js";
import Divider from "../Divider";
import Buttons from "../Buttons";
import Button from "../Button";
import NumberFormatCustom from "./NumberFormat";


const MakananForm = () => {
    const router = useRouter(); // Jika menggunakan React Router v6
  
    return (
      <Formik
        initialValues={{
          name: '',
          price: '',
          description: '',
          start_date:"2024-07-16",
          end_date:"2024-07-16",
          image: null, // Menyimpan file gambar
        }}
        onSubmit={async (values:any, { setSubmitting }) => {
          try {
            // Menggunakan FormData untuk mengirim file gambar
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('price', values.price);
            formData.append('description', values.description);
            formData.append("start_date", values.start_date);
            formData.append("end_date", values.end_date);
            formData.append('image', values.image); // Menambahkan file gambar ke FormData
  
            console.log('Submitting form with values:', values);
            console.log('FormData content:', formData.get('image'));
  
            const response = await axios.post('http://localhost:5000/makanan', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            // alert(JSON.stringify(response.data, null, 2));
            router.push('/tables'); 
          } catch (error) {
            console.error(error);
            alert('Gagal mengirim formulir');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({  setFieldValue }) => (
          <Form>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nama makanan">
                <Field name="name" placeholder="Nama makanan" />
              </FormField>
              <FormField label="Harga">
                <Field name="price" component={NumberFormatCustom} placeholder="Rp...." />
              </FormField>
            </div>
  
            <FormField label="Deskripsi" hasTextareaHeight>
              <Field name="description" as="textarea" placeholder="Deskripsi makanan ...." />
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
              />
            </FormField>
  
            <Divider />
  
            <Buttons>
              <Button type="submit" color="info" label="Submit"  />
              <Button type="reset" color="info" outline label="Reset" />
            </Buttons>
          </Form>
        )}
      </Formik>
    );
  };

  export default MakananForm