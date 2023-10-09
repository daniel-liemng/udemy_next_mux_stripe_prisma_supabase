'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Course } from '@prisma/client';
import FileUpload from '@/components/shared/FileUpload';

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Image is required.',
  }),
});

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const ImageForm: React.FC<ImageFormProps> = ({ initialData, courseId }) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData.imageUrl || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course Updated');
      toggleEdit();
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
      <div className='flex items-center justify-between font-medium'>
        Course image
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add an image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <ImageIcon className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <Image
              src={initialData.imageUrl!}
              fill
              className='object-cover rounded-md'
              alt='Upload'
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseImage'
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
