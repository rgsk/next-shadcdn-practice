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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";

const nonEmptyStringValidation = z.string().min(1, {
  message: "this field should not be empty",
});
const formSchema = z.object({
  task: nonEmptyStringValidation,
  attempt: nonEmptyStringValidation,
});

interface AnswerEvaluatorPageProps {}
const AnswerEvaluatorPage: React.FC<AnswerEvaluatorPageProps> = ({}) => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);
  // 1. Define your form.
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
  }

  return (
    <div className="p-4">
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
export default AnswerEvaluatorPage;
