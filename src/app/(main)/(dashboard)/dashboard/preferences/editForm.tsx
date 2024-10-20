'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { country_list } from '@/lib/countryList';
import { db, storage } from '@/lib/firebase';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DocumentData,
  DocumentReference,
  Timestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { revalidate } from './action';

const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Store name must be 1 or more characters long' })
    .max(32, {
      message: 'Store name must be no more than 32 characters long',
    }),
  description: z.string(),
  country: z.string(),
  avatar: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 1, `Maximum of 1 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    ),
  banner: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 1, `Maximum of 1 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    ),
});

export default function EditForm(props: {
  data: DocumentData;
  storeID: string;
  userID: string;
}) {
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = React.useState<string>('');
  const [selectedBanner, setSelectedBanner] = React.useState<string>('');
  const [avatarRemoval, setAvatarRemoval] = React.useState<string>('');
  const [bannerRemoval, setBannerRemoval] = React.useState<string>('');
  const [uploadFile, uploading, snapshot, uploadError] = useUploadFile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.data.name || '',
      description: props.data.description || '',
      country: props.data.country,
      avatar: undefined,
      banner: undefined,
    },
  });

  async function uploadImages() {
    let avatar = selectedAvatar;
    let banner = selectedBanner;
    let avatar_fileName = '';
    let banner_fileName = '';
    if (
      avatar !== '' &&
      !selectedAvatar.includes('firebasestorage.googleapis.com')
    ) {
      avatar_fileName = 'avatar_' + form.getValues('avatar')[0].name;
      const storageRef = ref(
        storage,
        `${props.userID}/stores/${props.storeID}/${avatar_fileName}`
      );

      await uploadFile(storageRef, form.getValues('avatar')[0], {
        contentType: form.getValues('avatar')[0].type,
      });
      avatar = await getDownloadURL(storageRef);
    }

    if (avatarRemoval !== '') {
      let removalURL = avatarRemoval.replace(
        'https://firebasestorage.googleapis.com/v0/b/creator-base-6c959.appspot.com/o',
        ''
      );
      removalURL = removalURL.replace(/\?alt.*/, '');
      removalURL = removalURL.replaceAll('%2F', '/');
      const del_avatar_storageRef = ref(storage, removalURL);
      await deleteObject(del_avatar_storageRef);
    }

    if (
      banner !== '' &&
      !selectedBanner.includes('firebasestorage.googleapis.com')
    ) {
      banner_fileName = 'banner_' + form.getValues('banner')[0].name;
      const storageRef = ref(
        storage,
        `${props.userID}/stores/${props.storeID}/${banner_fileName}`
      );

      await uploadFile(storageRef, form.getValues('banner')[0], {
        contentType: form.getValues('banner')[0].type,
      });
      banner = await getDownloadURL(storageRef);
    }

    if (bannerRemoval !== '') {
      let removalURL = bannerRemoval.replace(
        'https://firebasestorage.googleapis.com/v0/b/creator-base-6c959.appspot.com/o',
        ''
      );
      removalURL = removalURL.replace(/\?alt.*/, '');
      removalURL = removalURL.replaceAll('%2F', '/');
      const del_banner_storageRef = ref(storage, removalURL);
      await deleteObject(del_banner_storageRef);
    }

    avatar_fileName = avatar
      .replace(
        `https://firebasestorage.googleapis.com/v0/b/creator-base-6c959.appspot.com/o/${props.userID}%2Fstores%2F${props.storeID}%2F`,
        ''
      )
      .replace(/\?alt.*/, '');
    banner_fileName = banner
      .replace(
        `https://firebasestorage.googleapis.com/v0/b/creator-base-6c959.appspot.com/o/${props.userID}%2Fstores%2F${props.storeID}%2F`,
        ''
      )
      .replace(/\?alt.*/, '');

    setAvatarRemoval('');
    setBannerRemoval('');
    return {
      avatar: avatar,
      avatar_fileName: avatar_fileName,
      banner: banner,
      banner_fileName: banner_fileName,
    };
  }

  async function onSubmit() {
    const docRef: DocumentReference = doc(db, 'stores', props.storeID);
    try {
      setDisabled(true);
      const { avatar, avatar_fileName, banner, banner_fileName } =
        await uploadImages();
      setDisabled(false);
      await updateDoc(docRef, {
        name: form.getValues('name'),
        description: form.getValues('description'),
        avatar_url: avatar,
        avatar_filename: avatar_fileName,
        banner_url: banner,
        banner_filename: banner_fileName,
        country: form.getValues('country'),
        updated_at: Timestamp.fromDate(new Date()),
      });
      revalidate();
      toast.success('Store Updated', {
        description: 'Your store info has been updated.',
      });
    } catch (error) {
      setDisabled(false);
      console.error(error);
      toast.error('Update Error', {
        description:
          'There was an issue updating your store. Please try again.',
      });
    }
  }
  async function clearAvatar() {
    if (selectedAvatar.includes('firebasestorage.googleapis.com')) {
      setAvatarRemoval(selectedAvatar);
    }
    setSelectedAvatar('');
    const data = new DataTransfer();
    form.setValue('avatar', data.files);
  }
  async function clearBanner() {
    if (selectedBanner.includes('firebasestorage.googleapis.com')) {
      setBannerRemoval(selectedBanner);
    }
    setSelectedBanner('');
    const data = new DataTransfer();
    form.setValue('banner', data.files);
  }

  React.useEffect(() => {
    setSelectedAvatar(props.data.avatar_url);
  }, [props.data.avatar_url]);
  React.useEffect(() => {
    setSelectedBanner(props.data.banner_url);
  }, [props.data.banner_url]);

  return (
    <section>
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Preferences</h1>
          <div className="flex items-center gap-4">
            {disabled ? (
              <></>
            ) : (
              <Button type="submit" onClick={onSubmit} asChild>
                <div>
                  <FontAwesomeIcon className="icon mr-[5px]" icon={faSave} />
                  Save
                </div>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/store/${props.storeID}`}>View store</Link>
            </Button>
          </div>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[1754px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-8 px-4 py-8"
          >
            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Name and meta description</b>
                </p>
                <p>
                  The name and meta description help define how your store shows
                  up on search engines.
                </p>
              </aside>
              <aside className="flex w-full flex-1 flex-col gap-8 rounded p-8 drop-shadow">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          onChangeCapture={field.onChange}
                          id="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          onChangeCapture={field.onChange}
                          placeholder="Tell us a little bit about this store..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a default currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {country_list.map((item: any, i: number) => {
                            return (
                              <SelectItem
                                value={item.value}
                                key={`country-${i}`}
                              >
                                {item.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </aside>
            </section>

            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Avatar and Store Banner</b>
                </p>
                <p>
                  The avatar and store banner help create and show off your
                  brand and personality.
                </p>
              </aside>
              <aside className="flex w-full flex-1 flex-col gap-8 rounded p-8 drop-shadow">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { onChange }, ...field }) => {
                    // Get current images value (always watched updated)
                    const images = form.watch('avatar');

                    return (
                      <FormItem className="w-full">
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          {selectedAvatar ? (
                            <section className="flex items-center gap-8">
                              <Avatar className="h-[150px] w-[150px]">
                                <AvatarImage
                                  src={selectedAvatar}
                                  alt="Avatar"
                                />
                              </Avatar>
                              <Button
                                asChild
                                variant="destructive"
                                onClick={clearAvatar}
                              >
                                <p>
                                  <FontAwesomeIcon
                                    className="icon"
                                    icon={faTrash}
                                  />
                                </p>
                              </Button>
                            </section>
                          ) : (
                            <Input
                              type="file"
                              accept="image/*"
                              {...field}
                              onChange={(event) => {
                                // Triggered when user uploaded a new file
                                // FileList is immutable, so we need to create a new one
                                const dataTransfer = new DataTransfer();

                                // Add old images
                                if (images) {
                                  Array.from(images).forEach((image) =>
                                    dataTransfer.items.add(image)
                                  );
                                }

                                // Add newly uploaded images
                                Array.from(event.target.files!).forEach(
                                  (image) => dataTransfer.items.add(image)
                                );

                                // Validate and update uploaded file
                                const newFiles = dataTransfer.files;

                                const [file] = newFiles;
                                if (file) {
                                  setSelectedAvatar(URL.createObjectURL(file));
                                }
                                onChange(newFiles);
                              }}
                            />
                          )}
                        </FormControl>
                        <FormDescription>
                          For best results we suggest an image that is 300x300
                          pixels.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field: { onChange }, ...field }) => {
                    // Get current images value (always watched updated)
                    const images = form.watch('banner');

                    return (
                      <FormItem className="w-full">
                        <FormLabel>Store Banner</FormLabel>
                        <FormControl>
                          {selectedBanner ? (
                            <section className="flex w-full items-center gap-8">
                              <section className="flex flex-1">
                                <Image
                                  src={selectedBanner}
                                  alt="Store Banner"
                                  width={3096}
                                  height={526}
                                  style={{ width: '100%', height: 'auto' }}
                                ></Image>
                              </section>
                              <section>
                                <Button
                                  asChild
                                  variant="destructive"
                                  onClick={clearBanner}
                                >
                                  <p>
                                    <FontAwesomeIcon
                                      className="icon"
                                      icon={faTrash}
                                    />
                                  </p>
                                </Button>
                              </section>
                            </section>
                          ) : (
                            <Input
                              type="file"
                              accept="image/*"
                              {...field}
                              onChange={(event) => {
                                // Triggered when user uploaded a new file
                                // FileList is immutable, so we need to create a new one
                                const dataTransfer = new DataTransfer();

                                // Add old images
                                if (images) {
                                  Array.from(images).forEach((image) =>
                                    dataTransfer.items.add(image)
                                  );
                                }

                                // Add newly uploaded images
                                Array.from(event.target.files!).forEach(
                                  (image) => dataTransfer.items.add(image)
                                );

                                // Validate and update uploaded file
                                const newFiles = dataTransfer.files;

                                const [file] = newFiles;
                                if (file) {
                                  setSelectedBanner(URL.createObjectURL(file));
                                }
                                onChange(newFiles);
                              }}
                            />
                          )}
                        </FormControl>
                        <FormDescription>
                          For best results we suggest an image that is 3096x526
                          pixels.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </aside>
            </section>
          </form>
        </Form>
      </section>
    </section>
  );
}
