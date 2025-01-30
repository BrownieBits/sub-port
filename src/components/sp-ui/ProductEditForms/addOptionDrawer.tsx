'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Option } from '@/lib/types';
import { faSquarePen, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Form, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Product name must be 1 or more characters long' })
    .max(32, {
      message: 'Product name must be no more than 32 characters long',
    }),
  options: z
    .string()
    .min(1, { message: 'Options must be 1 or more characters long' })
    .max(32, {
      message: 'Options must be no more than 32 characters long',
    }),
});
type Props = {
  name?: string;
  options?: string;
  optionList: Option[];
  index?: number;
  id?: string;
  setOptions: (options: Option[]) => void;
};

export default function AddOptionDrawer(props: Props) {
  const [open, setOpen] = React.useState(false);
  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name || '',
      options: props.options || '',
    },
  });
  async function onAdd() {
    const newOption: Option = {
      name: addForm.getValues('name'),
      options: addForm.getValues('options').replace(/ /g, '').split(','),
      id: props.id,
    };
    const newOptionsList = props.optionList.slice(0);
    if (props.index !== undefined) {
      newOptionsList.splice(props.index, 1);
      newOptionsList.splice(props.index, 0, newOption);
    } else {
      newOptionsList.push(newOption);
    }
    props.setOptions(newOptionsList);
    addForm.reset();
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {props.index !== undefined ? (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="hover: text-xl"
            asChild
          >
            <p className="text-lg">
              <FontAwesomeIcon className="icon" icon={faSquarePen} />
            </p>
          </Button>
        ) : (
          <Button variant="outline" type="button" className="hover:">
            <FontAwesomeIcon className="icon mr-2" icon={faSquarePlus} />
            Add Option
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto flex w-full max-w-[1754px] flex-col items-start justify-start">
          <DrawerTitle>Add Option</DrawerTitle>
          <DrawerDescription className="w-full" asChild>
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(onAdd)}
                className="flex w-full flex-col items-start justify-start gap-8 pt-4"
              >
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col items-start justify-start text-foreground">
                      <FormLabel className="text-foreground">Name</FormLabel>
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
                  control={addForm.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col items-start justify-start text-foreground">
                      <FormLabel className="text-foreground">Options</FormLabel>
                      <FormControl>
                        <Input
                          onChangeCapture={field.onChange}
                          id="options"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use commas to seperate different options.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="mx-auto w-full max-w-[1754px]">
          <section className="flex w-full justify-end gap-8">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            {props.index !== undefined ? (
              <Button type="submit" onClick={addForm.handleSubmit(onAdd)}>
                Save
              </Button>
            ) : (
              <Button type="submit" onClick={addForm.handleSubmit(onAdd)}>
                Add Option
              </Button>
            )}
          </section>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
