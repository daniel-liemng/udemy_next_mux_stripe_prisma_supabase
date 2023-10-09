'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Attachment, Course } from '@prisma/client';
import FileUpload from '@/components/shared/FileUpload';

const formSchema = z.object({
  url: z.string().min(1, {
    message: 'Url is required.',
  }),
});

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const AttachmentForm: React.FC<AttachmentFormProps> = ({
  initialData,
  courseId,
}) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.post(
        `/api/courses/${courseId}/attachments`,
        values
      );
      toast.success('Course Updated');
      toggleEdit();
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      toast.success('Attachment Deleted');
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
      <div className='flex items-center justify-between font-medium'>
        Course attachments
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className='text-sm mt-2 text-slate-500 italic'>
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className='space-y-2'>
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className='flex items-center p-3 bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                >
                  <File className='h-4 w-4 mr-2 flex-shrink-0' />
                  <p className='text-xs line-clamp-1'>{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className='h-4 w-4 ml-2 animate-spin' />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className='ml-auto hover:opacity-75 transition'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            Add anything you students may need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
