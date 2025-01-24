'use client'

// 👉 # 05 All...
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"




const page = () => {
  
  const { toast } = useToast()
  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({      // In TypeScript, 'infer' is a keyword used in conditional types to extract and capture the type information from another type. It's commonly used in more advanced type manipulation scenarios to dynamically infer a type within a type definition... ata type safety er jonno, use na korleo chole jabe, but recommended ata use korar...
    resolver: zodResolver(signInSchema),            // resolver: This option allows integrating an external validation library (like Zod) with React Hook Form. 
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log("first")
    console.log("under first : ",data)
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    console.log("sign-in result: ", result)

    if(result?.error) {
      toast({
        title: "Login Failed",
        description: "Incorrect username or password",
        variant: 'destructive'
      })
      return; 
    }

    if(result?.url) {
      router.replace("/dashboard")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Messages
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>

        {/* From shadcn 'form' Docs */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username"   // 'Input' tag from : npx shadcn@latest input 
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
            <Button type="submit">     {/* ekhane compulsory 'type="submit" e likhte hobe, noito submit work korbe na */}
              Sign in
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
            <p>
                Don't have a account?{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                    Sign up
                </Link>
            </p>
        </div>
      </div>
    </div>
  )
}

export default page
