'use client'

import { useToast } from '@/hooks/use-toast'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'




const page = () => {

  const { toast } = useToast()
  const router = useRouter()
  const params = useParams<{ username: string }>()
  console.log("params is: ", params)
  // const username = params.username
  const username = params?.username ?? ""

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const { register, watch, setValue } = form
  const messageContent = watch('content')

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)

    try {
      const response = await axios.post<ApiResponse>('/api/send-messages', {
        ...data,
        username
      })
      toast({
        title: response.data.message,
        variant: 'default'
      })
      setValue("content", "") // Clear input
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive'
      });

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Input placeholder="Write your anonymous message here"
                    // className="resize-none"
                    autoComplete="off"
                    {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {
              isLoading ? (
                <Button disabled>
                  <Loader2 className="h-4 w-4 animate-spin">
                    Please wait
                  </Loader2>
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent}>
                  Send It
                </Button>
              )
            }
          </div>
        </form>
      </Form>
    </div>
  )
}

export default page
