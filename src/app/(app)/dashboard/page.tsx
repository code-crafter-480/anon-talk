'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { Axios, AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"



const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { toast } = useToast()

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()

  // console.log("Data session is : ", session)
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  /*
    🟢 useForm :
      ➡️ This is a hook provided by react-hook-form that initializes the form and returns various methods and objects for handling form state, validation, and submission.
    🟢 resolver :
      ➡️ The resolver option in useForm allows you to integrate a third-party validation library (in this case, zod) for form validation.
    🟢 zodResolver :
      ➡️ This function comes from @hookform/resolvers/zod and acts as a bridge between react-hook-form and zod. It converts the validation logic of zod into a format that react-hook-form can understand.
    
    🔖 What It Does:
        ➡️ This setup ensures that any data submitted through the form is validated against the AcceptMessageSchema.
        ➡️ If the data is invalid according to the schema, react-hook-form will capture the errors and allow you to display feedback to the user.
        ➡️ Using zod and zodResolver makes it easy to define complex validation rules in a declarative and reusable way.
  */

  const { register, watch, setValue } = form

  const acceptMessages = watch('acceptMessages')     // ai watch ke kothao na kothao inject korte hoi, mane kon jinis take watch korbo... akhon ekhanei lagiye di66i pore atake UI te inject korbo... 'watch' ho66e ekhane akta method, and ai method jekhanei 'acceptMessages' use korbo okhane ai method ta lagbe... mane amra field er name 'acceptMessages' type hobe...


  //  useCallback(fn, dependencies) 
  //  Call "useCallback" at the top level of your component to cache a function definition between re-renders:
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])


  const fetchMessages = useCallback(async (refresh: boolean = false) => {    // The function takes a parameter 'refresh' which is of type boolean and defaults to false if not provided.
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      console.log("fetchMessages response in dashboard is : ", response)
      console.log("fetchMessages 'response.data?.messages' in dashboard is : ", response.data?.messages) 
      setMessages(response.data?.messages || [])
      toast({
        title: response.data.message,
        variant: "default"
      })

      console.log('Setting the response.data.messages is: ', response.data.messages)
      console.log('Setting the message is: ', messages)

      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])


  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
    // console.log('Setting the message is: ', messages)
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  
  // ➡️ handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response.data.message,
        variant: 'default'
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    }
  }
  console.log(session)
  if (!session) {
    console.log("Inside dashboard page")
    return <div className='text-center text-2xl mt-10'>Please Login1</div>
  }
  if (!session.user) {
    console.log("Hello 2")
    return <div>Please Login</div>
  }

  // 📌   http://localhost:3000/u/akashroy      localhost://localhost:/u/akashroy
  const { username } = session?.user as User       // 📌📌📌 ai 'User' next-auth theke newa hoye6e... ata problem create korte pare...
  // console.log("Window is: ", window)
  console.log("Username is: ", username)
  const hostname = window.location.hostname ? window.location.hostname : '';
  const protocol = window.location.protocol ? window.location.protocol : '';
  const port = window.location.port ? window.location.port : '';
  // const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  const baseUrl = `${protocol}//${hostname}:${port}`
  const profileUrl = `${baseUrl}/u/${username}`
  // const baseUrl = `${window.location.protocol}//${window.location.host}`;
  // const profileUrl = `${baseUrl}/u/${username}`;


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard"
    })
  }


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off' }
        </span>
      </div>
      <Separator />

      <Button 
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        { isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}

      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {
          messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                // key={message._id}
                // key={message._id as React.Key}
                key={index}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            
            <p>No messages to display.</p>
            
          )
        }
      </div>
    </div>
  )
}

export default page
