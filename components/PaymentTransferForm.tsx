"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { decryptId } from '../lib/utils'
import { getBank, getBankByAccountId } from '../lib/actions/user.actions'
import { createTransfer } from '../lib/actions/dwolla.actions'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import BankDropDown from './BankDropDown'
import { Input } from '@/components/ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { createTransaction } from '../lib/actions/transation.actions'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
    email: z.string().email("Invalid Email Address"),
    name: z.string().min(4,"Transfer Note is Very Short"),
    amount: z.string().min(4, "Amount is very Little"),
    senderBank: z.string().min(4, "Please Select a Valid Bank Account"),
    shareableId: z.string().min(8, "Please Select a Valid Shareable Id"),
})
const PaymentTransferForm = ({accounts}: PaymentTransferFormProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            amount: "",
            senderBank: "",
            shareableId: ""
        }
    })
    const submit = async(data: z.infer<typeof formSchema>)=>{
        setIsLoading(true)

        try {
            const receiverAccountId = decryptId(data.shareableId)
            const receiverBank = await getBankByAccountId({
                accountId: receiverAccountId
            })
            const senderBank = await getBank({documentId: data.senderBank})
            const transferParams = {
                sourceFundingSourceUrl: senderBank.fundingSourceUrl,
                destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
                amount: data.amount
            }

            const transfer = await createTransfer(transferParams)

            if (transfer) {
                const transaction = {
                    name: data.name,
                    amount: data.amount,
                    senderId: senderBank.userId.$id,
                    senderBankId: senderBank.$id,
                    receiverId: receiverBank.userId.$id,
                    receiverBankId: receiverBank.$id,
                    email: data.email,
                }
                const newTransaction = await createTransaction(transaction)

                if (newTransaction) {
                    form.reset()
                    router.push("/")
                }
            }
        } catch (error) {
            console.error("Submitting Create Transfer Request Failed: ", error)
        }
        setIsLoading(false)
    }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className='flex flex-col'>
            <FormField control={form.control} name='senderBank' render={()=>(
                <FormItem className='border-t border-gray-200'>
                    <div className='payment-transfer_form-item pb-6 pt-5'>
                        <div className='payment-transfer_form-content'>
                            <FormLabel className='text-14 font-medium text-gray-700'>
                                Select Source Bank
                            </FormLabel>
                            <FormDescription className='text-12 font-normal text-gray-600'>
                                Select The Bank Account You Want To Transfer Funds From
                            </FormDescription>
                        </div>
                        <div className='flex w-full flex-col'>
                            <FormControl>
                                <BankDropDown accounts={accounts} setValue={form.setValue} otherStyles="!w-full"/>
                            </FormControl>
                            <FormMessage className='text-12 text-red-500'/>
                        </div>
                    </div>
                </FormItem>
            )}/> 

            <FormField control={form.control} name='name' render={({field})=>(
                <FormItem className='border-t border-gray-200'>
                    <div className='payment-transfer_form-item pb-6 pt-5'>
                        <div className='payment-trasnfer_form-content'>
                            <FormLabel className='text-14 font-medium text-gray-700'>
                                Transfer Note (Optional)
                            </FormLabel>
                            <FormDescription className='text-12 font-normal text-gray-600'>
                                Please Provide Any Additional Information or Instructions Related To The Transfer 
                            </FormDescription>
                        </div>
                        <div className='flex w-full flex-col'>
                            <FormControl>
                                <Textarea placeholder="Write A Short Note Here" className="input-class" {...field}/>
                            </FormControl>
                            <FormMessage className='text-12 text-red-500'/>
                        </div>
                    </div>
                </FormItem>
            )}/>
            <div className='payment-transfer_form-details'>
                <h2 className='text-18 font-semibold text-gray-900'>
                    Bank Account Details
                </h2>
                <p className='text-16 font-normal text-gray-600'>
                    Enter the Bank Account Details of the Recipient
                </p>
            </div>
            <FormField control={form.control} name='email' render={({field})=>(
                <FormItem className='border-t border-gray-200'>
                    <div className='payment-transfer_form-item py-5'>
                        <FormLabel className='text-14 w-full max-w-[280px] font-medium text-gray-700'>
                            Recipient&apos;s Email Address
                        </FormLabel>
                        <div className='flex w-full flex-col'>
                            <FormControl>
                                <Input placeholder='ex: mukyaladoe@gmail.com' className='input-class' {...field}/>
                            </FormControl>
                            <FormMessage className='text-12 text-red-500'/>
                        </div>
                    </div>
                </FormItem>
            )}/>
            <FormField control={form.control} name='shareableId' render={({field})=>(
                <FormItem className='border-t border-gray-200'>
                    <div className='payment-transfer_form-item pb-5 pt-6'>
                        <FormLabel className='text-14 w-full max-w-[280px] font-medium text-gray-700'>
                            Recipient&apos;s Plaid Shareable Id
                        </FormLabel>
                        <div className='flex w-full flex-col'>
                            <FormControl>
                                <Input placeholder='Enter The Public Account Number' className='input-class' {...field}/>
                            </FormControl>
                            <FormMessage className='text-12 text-red-500'/>
                        </div>
                    </div>
                </FormItem>
            )}/>
            <FormField control={form.control} name='amount' render={({field})=>(
                <FormItem className='border-y border-gray-200'>
                    <div className='payment-transfer_form-item py-5'>
                        <FormLabel className='text-14 w-full max-w-[280px] font-medium text-gray-700'>
                            Amount
                        </FormLabel>
                        <div className='flex w-full flex-col'>
                            <FormControl>
                                <Input placeholder='ex: 5.00' className='input-class' {...field}/>
                            </FormControl>
                            <FormMessage className='text-12 text-red-500'/>
                        </div>
                    </div>
                </FormItem>
            )}/>

            <div className='payment-transfer_btn-box'>
                <Button type='submit' className='payment-transfer_btn'>
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className='animate-spin'/> &nbsp; Sending...
                        </>
                    ):(
                        "Transfer Funds"
                    )}
                </Button>
            </div>
        </form>
    </Form>
  )
}

export default PaymentTransferForm