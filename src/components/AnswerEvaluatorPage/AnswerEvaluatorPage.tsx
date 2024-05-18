/* eslint-disable @next/next/no-img-element */
import { z } from "zod";

import skartnerAI from "@/api/skartnerAI";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import useBreakpoints from "@/hooks/useBreakpoints";
import eventTracker from "@/lib/eventTracker";
import {
  getPresignedUrl,
  getUploadURL,
  getUrlFromUploadUrl,
} from "@/lib/s3Utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import { Input } from "../ui/input";

const nonEmptyStringValidation = z.string().min(1, {
  message: "this field should not be empty",
});

interface AnswerEvaluatorPageProps {}
const AnswerEvaluatorPage: React.FC<AnswerEvaluatorPageProps> = ({}) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);
  const breakpoints = useBreakpoints();
  // 1. Define your form.
  const [tab, setTab] = useState<"task1" | "task2">("task1");

  return (
    <div className="p-4">
      <h1 className="text-xl text-center">Evaluate IELTs Writing Tasks</h1>
      <div className="h-[30px]"></div>
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as any);
        }}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="task1">
            Task 1 - Analyse {breakpoints.md ? "Graph/Chart/Diagram" : "Graph"}
          </TabsTrigger>
          <TabsTrigger value="task2">Task 2 - Essay</TabsTrigger>
        </TabsList>
        <TabsContent forceMount value="task1" hidden={tab !== "task1"}>
          <Task1Form />
        </TabsContent>
        <TabsContent forceMount value="task2" hidden={tab !== "task2"}>
          <Task2Form />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AnswerEvaluatorPage;

interface Task1FormProps {}
const Task1Form: React.FC<Task1FormProps> = ({}) => {
  const formSchema = z.object({
    task: nonEmptyStringValidation,
    image_url: nonEmptyStringValidation,
    attempt: nonEmptyStringValidation,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
      image_url: "",
      attempt: "",
    },
  });
  const answerEvaluatorMutation = useMutation({
    mutationFn: skartnerAI.answerEvaluator,
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    answerEvaluatorMutation.mutate({
      type: "ielts_academic_writing_task_1",
      args: {
        task: values.task,
        image_url: values.image_url,
        attempt: values.attempt,
      },
    });
    eventTracker.answerEvaluated({
      type: "ielts_academic_writing_task_1",
      task: values.task,
      image_url: values.image_url,
      attempt: values.attempt,
    });
  }
  const image_url = form.watch("image_url");
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const imageInput = imageFileInputRef.current;
    if (imageInput) {
      imageInput.value = "";
    }
  }, [image_url]);
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task</FormLabel>
                <FormControl>
                  <Textarea placeholder="Task" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="https://aws.com/images/task1.png"
                      {...field}
                    />
                    <p className="text-sm font-medium pl-1 py-2">OR</p>
                    <Input
                      ref={imageFileInputRef}
                      type="file"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          const uploadUrl = await getUploadURL({
                            key:
                              Date.now() + "-" + file.name.replaceAll(" ", "-"),
                          });
                          await axios.put(uploadUrl, file);
                          const fileUrl = getUrlFromUploadUrl(uploadUrl);
                          const presignedUrl = await getPresignedUrl(fileUrl);
                          form.setValue("image_url", presignedUrl);
                        }
                      }}
                    />

                    {image_url && (
                      <>
                        <div className="h-[50px]"></div>
                        <img
                          src={image_url}
                          alt="image"
                          className="w-[500px] max-w-full"
                        />
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attempt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attempt</FormLabel>
                <FormControl>
                  <Textarea placeholder="Attempt" rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={answerEvaluatorMutation.isPending}>
            Submit
          </Button>
        </form>
      </Form>
      <div className="h-[30px]"></div>
      <ClipLoader
        loading={answerEvaluatorMutation.isPending}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {answerEvaluatorMutation.data && (
        <div>
          <p>Band: {answerEvaluatorMutation.data["band"]}</p>
          <p>Comment: {answerEvaluatorMutation.data["comment"]}</p>
        </div>
      )}
    </div>
  );
};

interface Task2FormProps {}
const Task2Form: React.FC<Task2FormProps> = ({}) => {
  const formSchema = z.object({
    task: nonEmptyStringValidation,
    attempt: nonEmptyStringValidation,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
      attempt: "",
    },
  });
  const answerEvaluatorMutation = useMutation({
    mutationFn: skartnerAI.answerEvaluator,
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    answerEvaluatorMutation.mutate({
      type: "ielts_writing_task_2",
      args: {
        task: values.task,
        attempt: values.attempt,
      },
    });
    eventTracker.answerEvaluated({
      type: "ielts_writing_task_2",
      task: values.task,
      attempt: values.attempt,
    });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task</FormLabel>
                <FormControl>
                  <Textarea placeholder="Task" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attempt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attempt</FormLabel>
                <FormControl>
                  <Textarea placeholder="Attempt" rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={answerEvaluatorMutation.isPending}>
            Submit
          </Button>
        </form>
      </Form>
      <div className="h-[30px]"></div>
      <ClipLoader
        loading={answerEvaluatorMutation.isPending}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {answerEvaluatorMutation.data && (
        <div>
          <p>Band: {answerEvaluatorMutation.data["band"]}</p>
          <p>Comment: {answerEvaluatorMutation.data["comment"]}</p>
        </div>
      )}
    </div>
  );
};
