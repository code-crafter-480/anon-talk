'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'     // 'useParams' --> A Client Component hook that lets you read a route's dynamic params filled in by the current URL...
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"


const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()       // here we ensure the type safety...
    const { toast } = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({      // In TypeScript, 'infer' is a keyword used in conditional types to extract and capture the type information from another type. It's commonly used in more advanced type manipulation scenarios to dynamically infer a type within a type definition... ata type safety er jonno, use na korleo chole jabe, but recommended ata use korar...
        resolver: zodResolver(verifySchema),            // resolver: This option allows integrating an external validation library (like Zod) with React Hook Form. 
    })


    // jokhon submit hoye jabe tokhon data kivabe anbo
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            console.log("verify-username: ",response)

            if (response.data?.success) {
                toast({
                    title: "verified successfully",
                    description: response.data?.message
                })
                router.replace('/sign-in')
            }

        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"         // variant: This specifies the style or category of the toast. Common variants include... "destructive": This typically applies red or bold styles to emphasize the seriousness of the message, indicating an error or problem.
            })
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Verify Your Account
                    </h1>
                    <p className='mb-4'>Enter the verification code send to your email</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input autoComplete='off' placeholder="code" {...field} />
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
