import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import BackButton from '@/components/bigComponents/BackButton.jsx';
import RHFTextInput from '@/components/rhform/RHFTextInput';
import RHFTextarea from '@/components/rhform/RHFTextArea';
import RHFFileUpload from '@/components/rhform/RHFFileUpload';
import { Button } from 'flowbite-react';
import RHFSelectInput from '@/components/rhform/RHFSelectInput';
import { useState } from 'react';

function AddProduct() {
  const { control, handleSubmit, reset, setValue, watch } = useForm();
  const [resetKey, setResetKey] = useState(0);

  const mutation = useMutation({
    mutationFn: (newProduct) => axios.post('/api/products/', newProduct).then((res) => res.data),
    onSuccess: () => {
      toast.success('Product added successfully!');
      reset({
        id: '',
        name: '',
        category: '',
        stock_quantity: '',
        price: '',
        image: '',
        description: '',
      });
      setResetKey((prev) => prev + 1);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      id: data.id,
      name: data.name,
      category: data.category,
      stock_quantity: Number(data.stock_quantity),
      price: Number(data.price),
      image: data.image,
      description: data.description,
    });
  };

  return (
    <>
      <div className="flex flex-col p-4 overflow-auto bg-admin">
        <main className="w-full p-6 mx-auto overflow-x-auto border shadow bg-card rounded-xl ring-1">
          <div className="flex items-center w-full gap-3 mb-6">
            <BackButton label="" className="py-6 ring-1" />

            <div className="flex flex-col">
              <span className="text-sm text-lighter">Create a new product for the menu</span>
              <h1 className="flex items-center gap-1 text-xl font-bold">Add Product</h1>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid w-full max-w-full grid-cols-1 gap-8 mx-auto md:grid-cols-2"
          >
            <div className="flex flex-col gap-7 rounded-xl">
              <RHFTextInput
                name="id"
                control={control}
                label="Product ID"
                placeholder="Product ID"
                rules={{ required: 'ID is required' }}
              />
              <RHFTextInput
                name="name"
                control={control}
                label="Product Name"
                placeholder="Product Name"
                rules={{ required: 'Name is required' }}
              />

              <RHFFileUpload
                key={resetKey}
                name="image"
                control={control}
                rules={{ required: 'Image is required' }}
                onUploadSuccess={(uploadData) => setValue('image', uploadData.url)}
              />

              <RHFSelectInput
                name="category"
                control={control}
                label="Category"
                placeholder="Select a category"
                rules={{ required: 'Category is required' }}
                options={['condiment', 'pickles', 'powders']}
              />

              <div className="grid grid-cols-2 gap-4">
                <RHFTextInput
                  name="stock_quantity"
                  control={control}
                  label="Stock Quantity"
                  placeholder="Stock"
                  type="number"
                  rules={{
                    required: 'Stock is required',
                    min: {
                      value: 0,
                      message: 'Stock cannot be negative',
                    },
                  }}
                  min={0}
                />
                <RHFTextInput
                  name="price"
                  control={control}
                  label="Price"
                  placeholder="Price"
                  type="number"
                  rules={{
                    required: 'Price is required',
                    min: {
                      value: 0,
                      message: 'Stock cannot be negative',
                    },
                  }}
                  min={0}
                />
              </div>

              <RHFTextarea
                name="description"
                control={control}
                label="Description"
                placeholder="Enter product description"
                rows={4}
                rules={{ required: 'Description is required' }}
              />

              <Button type="submit" color="gray" disabled={mutation.isLoading} className="w-full">
                {mutation.isLoading ? 'Adding...' : 'Add Product'}
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center h-full p-8 rounded-xl ring-1">
              {watch('image') ? (
                <img
                  src={watch('image')}
                  alt="Uploaded preview"
                  className="h-full max-h-[500px] w-auto rounded-lg object-cover shadow"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400 border-2 border-gray-300 border-dashed rounded-lg">
                  No image uploaded...
                </div>
              )}
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default AddProduct;
