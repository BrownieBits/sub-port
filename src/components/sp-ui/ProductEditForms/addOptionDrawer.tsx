'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TagsInput } from '@/components/ui/tags-input';
import { useMediaQuery } from '@/hooks/use-media-query';
import { _Option } from '@/lib/types';
import { faSquarePen, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Product name must be 1 or more characters long' })
    .max(32, {
      message: 'Product name must be no more than 32 characters long',
    }),
  options: z.array(z.string()),
});
type Props = {
  name?: string;
  options?: string[];
  optionList: _Option[];
  index?: number;
  id?: string;
  setOptions: (options: _Option[]) => void;
};

export default function AddOptionDrawer(props: Props) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name || '',
      options: props.options || [],
    },
  });
  async function onAdd() {
    const newOption: _Option = {
      name: addForm.getValues('name'),
      options: addForm.getValues('options'),
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

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {props.index !== undefined ? (
            <Button variant="outline" asChild>
              <FontAwesomeIcon className="icon" icon={faSquarePen} />
            </Button>
          ) : (
            <Button variant="outline">
              <FontAwesomeIcon className="icon mr-2" icon={faSquarePlus} />
              Add Option
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Options</DialogTitle>
            <DialogDescription className="flex flex-col" asChild>
              <section>
                <Form {...addForm}>
                  <form
                    onSubmit={addForm.handleSubmit(onAdd)}
                    className="flex w-full flex-col items-start justify-start gap-8 pt-4"
                  >
                    <FormField
                      control={addForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="text-foreground flex w-full flex-col items-start justify-start">
                          <FormLabel className="text-foreground">
                            Name
                          </FormLabel>
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
                        <FormItem className="w-full">
                          <FormLabel className="text-foreground">
                            Options
                          </FormLabel>
                          <FormControl>
                            <TagsInput
                              value={field.value}
                              onValueChange={field.onChange}
                              id="options"
                              className="w-full"
                            />
                          </FormControl>
                          <FormDescription>
                            Use{' '}
                            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                              Enter
                            </kbd>{' '}
                            to add Options to list.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </section>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <section className="flex w-full justify-end gap-8">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {props.index !== undefined ? (
          <Button variant="outline" asChild>
            <FontAwesomeIcon className="icon" icon={faSquarePen} />
          </Button>
        ) : (
          <Button variant="outline">
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
                    <FormItem className="text-foreground flex w-full flex-col items-start justify-start">
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
                    <FormItem className="w-full">
                      <FormLabel className="text-foreground">Options</FormLabel>
                      <FormControl>
                        <TagsInput
                          value={field.value}
                          onValueChange={field.onChange}
                          id="options"
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>
                        Use{' '}
                        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                          Enter
                        </kbd>{' '}
                        to add Options to list.
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
