'use client'

// 👉 # 04 All...
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'             // Here we use 'npm install usehooks-ts --legacy-peer-deps'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchems } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"




const page = () => {
  const [username, setUsername] = useState('')    // 'username' er moddhe ki6u time interval a api er through check korbo je username uniquely exist kore naki, Jodi each keyboard press a amra api pathai thaole huge api request chole jabe so atakeo control korte 'debouncing' technique use korbo... and ai technique implement korar jonno predefined hook(usehook-ts) use korbo... 
  const [usernameMessage, setUsernameMessage] = useState('')          // backend amake bolbe user available a6e kina or message debe...
  const [isCheckingUsername, setIsCheckcingUsername] = useState(false)    // amader akta loder field o lagbe, mane jokhon jokhon amra request pathabo backend tokhon ai process er somoy amra aktu loding state dekhate chaibo, so ai state ke manage korte akta state lagbe...
  const [isSubmitting, setIsSubmitting] = useState(false)       // ekhaneo akdhoroner loder use kora jete pare...

  const debounced = useDebounceCallback (setUsername, 400)       // so ami je api request fire korbo backend a seta ai 'debounced' er basis a korbo...
  const { toast } = useToast()
  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchems>>({      // In TypeScript, 'infer' is a keyword used in conditional types to extract and capture the type information from another type. It's commonly used in more advanced type manipulation scenarios to dynamically infer a type within a type definition... ata type safety er jonno, use na korleo chole jabe, but recommended ata use korar...
    resolver: zodResolver(signUpSchems),            // resolver: This option allows integrating an external validation library (like Zod) with React Hook Form. 
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckcingUsername(true)     // for showing loder effect...
        setUsernameMessage('')    // hote pare ami last time request er through ki6u error peye6i and ata oi state fill kore diye6i so otake amra empty korte chaibo... 
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log("axios data : ", response)
          console.log("axios data 2 : ", response.data.message)

          // ➡️ nicher two line a author er ki6u akta problem ho66ilo but ami temon ki6u akta bujte parlam na, Hitesh bol6e je 'username is unique' console a to print ho66e but nicher line a update ho66e na so nicher 2&3 line korar por update ho66e...
            setUsernameMessage(response.data.message)

          // let message = response.data.message
          // setUsernameMessage(message)

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setIsCheckcingUsername(false)
        }

      }
    }
    checkUsernameUnique()
  }
    , [username])


  const onSubmit = async (data: z.infer<typeof signUpSchems>) => {
    setIsSubmitting(true)     // mane ekhane ami loder lagate pari...
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title: 'Success',
        description: response.data.message
      })
      router.replace(`/verify/${username}`)        // ai page a giye 'verify-code' er akta request pathiye debo...
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"         // variant: This specifies the style or category of the toast. Common variants include... "destructive": This typically applies red or bold styles to emphasize the seriousness of the message, indicating an error or problem.
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Messages
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        {/* From shadcn 'form' Docs */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username"   // 'Input' tag from : npx shadcn@latest input 
                     {...field}
                     onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                     }}
                     />
                  </FormControl>
                  { isCheckingUsername && <Loader2 className="animate-spin"/> }
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                    {username} {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email"   // 'Input' tag from : npx shadcn@latest input 
                     {...field}
                        // ekahane 'onChange' lagbe na ata automatically niye nebe amra ekhane onChange use korbo na because at the time typing ami ki6u change kor6i na jokhon puro hoye jabe then submit button hole automatically ai value gulo niye nebe...
                     />      
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password"   // 'Input' tag from : npx shadcn@latest input 
                     {...field}
                     />      
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>     {/* ekhane compulsory 'type="submit" e likhte hobe, noito submit work korbe na */}
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : ("Sign up")
              }
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
              Already a member?{' '}
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign in</Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default page
